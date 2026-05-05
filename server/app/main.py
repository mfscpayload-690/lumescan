from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import re
import httpx
import traceback
from app.services.analyze import analyze_service

app = FastAPI(title="LumeScan API", version="1.0.0", redirect_slashes=False)

# Models
class ScanRequest(BaseModel):
    repo_url: str
    offset: int = Field(default=0, ge=0)

class AnalyzeFileItem(BaseModel):
    path: str
    category: str

class AnalyzeRequest(BaseModel):
    owner: str
    repo: str
    files: list[AnalyzeFileItem]

GITHUB_URL_PATTERN = re.compile(r"https?://github\.com/([^/]+)/([^/]+)/?$")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    """
    Return a simple health-check message indicating the API is running.
    
    Returns:
        dict: A dictionary with a single key `"message"` whose value is `"LumeScan API is running"`.
    """
    return {"message": "LumeScan API is running"}

@app.get("/api/v1/search/repos")
async def search_repos(q: str):
    """
    Search for GitHub repositories by name/query.
    Returns the top 5 results for better UX.
    """
    if not q or len(q) < 2:
        return {"items": []}
    
    try:
        async with httpx.AsyncClient() as client:
            # Search repositories, sorted by stars for better quality results
            url = f"https://api.github.com/search/repositories?q={q}&per_page=5&sort=stars"
            response = await client.get(url)
            if response.status_code != 200:
                return {"items": []}
            
            data = response.json()
            return {
                "items": [
                    {
                        "full_name": repo["full_name"],
                        "html_url": repo["html_url"],
                        "description": repo["description"]
                    } for repo in data.get("items", [])
                ]
            }
    except Exception:
        return {"items": []}

@app.post("/api/v1/scan/init")
async def init_scan(request: ScanRequest):
    """
    Fetches a GitHub repository tree, classifies blob files by category, and returns a paginated subset of matching files.
    
    Parameters:
        request (ScanRequest): Contains `repo_url` (GitHub repository URL or owner/repo slug) and `offset` (pagination start index).
    """
    url = request.repo_url.strip().rstrip("/")
    match = GITHUB_URL_PATTERN.match(url)
    
    if match:
        owner, repo = match.groups()
    elif "/" in url and not url.startswith("http"):
        parts = url.split("/")
        if len(parts) == 2:
            owner, repo = parts
        else:
            raise HTTPException(status_code=400, detail="Invalid format. Use 'owner/repo' or full URL.")
    else:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository format.")
    
    try:
        async with httpx.AsyncClient(follow_redirects=True) as client:
            tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
            response = await client.get(tree_url)
            
            if response.status_code != 200:
                tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
                response = await client.get(tree_url)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repository tree")
            
            tree_data = response.json()
            
            # Fetch Repo Metadata for context
            repo_meta_url = f"https://api.github.com/repos/{owner}/{repo}"
            meta_res = await client.get(repo_meta_url)
            metadata = {}
            if meta_res.status_code == 200:
                m = meta_res.json()
                metadata = {
                    "stars": m.get("stargazers_count"),
                    "forks": m.get("forks_count"),
                    "language": m.get("language"),
                    "license": m.get("license", {}).get("name") if m.get("license") else "No License",
                    "updated_at": m.get("updated_at"),
                    "open_issues": m.get("open_issues_count"),
                    "description": m.get("description")
                }

            files = []
            for item in tree_data.get("tree", []):
                if item["type"] == "blob":
                    path = item["path"]
                    category = None
                    if any(path.endswith(ext) for ext in [".py", ".js", ".ts", ".jsx", ".tsx"]):
                        category = "Logic"
                    elif any(path.endswith(ext) for ext in [".yaml", ".yml", ".json", ".conf", ".ini"]):
                        category = "Config"
                    elif "workflow" in path.lower():
                        category = "Workflow"
                    
                    if category:
                        files.append({"path": path, "category": category})
            
            # Cap at 50 files for stability with pagination
            total_found = len(files)
            files = files[request.offset : request.offset + 50]
            
            return {
                "owner": owner, 
                "repo": repo, 
                "files_found": files,
                "total_found": total_found,
                "offset": request.offset,
                "metadata": metadata,
                "message": f"Showing files {request.offset + 1}-{request.offset + len(files)} of {total_found}." if total_found > 50 else None
            }
            
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="An error occurred while initializing the scan.")

@app.post("/api/v1/scan/analyze")
async def analyze_repo(request: AnalyzeRequest):
    """
    Stream per-file analysis results for the given repository files.
    
    Parameters:
        request (AnalyzeRequest): Request containing `owner`, `repo`, and `files`. Each item in `files` is expected to include at least `path` and `category`.
    
    Returns:
        StreamingResponse: A response that yields newline-delimited JSON objects. Each yielded line is either an analysis result for a file or an error object with the shape `{"file": <path>, "error": <message>}`.
    """
    from fastapi.responses import StreamingResponse
    import asyncio
    import json
    
    async def generate_results():
        """
        Yield per-file analysis results and per-file errors as newline-terminated JSON strings.
        
        Each iteration waits 1.5 seconds, invokes the analysis service for the current file, and yields the analysis result serialized as JSON with a trailing newline. If analyzing a file raises an exception, yields a JSON object containing the file path and the error message (also newline-terminated).
        
        Returns:
            An async generator that yields strings. Each yielded string is either:
              - the JSON-serialized analysis result followed by "\n", or
              - the JSON-serialized error object {"file": <path>, "error": <message>} followed by "\n".
        """
        for file_info in request.files:
            try:
                # 1.5s safety delay between files
                await asyncio.sleep(1.5)
                result = await analyze_service.analyze_file(
                    request.owner, request.repo, file_info.path, file_info.category
                )
                yield f"{json.dumps(result)}\n"
            except Exception as e:
                traceback.print_exc()
                yield f"{json.dumps({'file': file_info.path, 'error': 'Analysis failed for this file'})}\n"
    
    return StreamingResponse(generate_results(), media_type="application/x-ndjson")
