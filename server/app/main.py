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
    allow_origins=["*"],
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

@app.post("/api/v1/scan/init")
async def init_scan(request: ScanRequest):
    """
    Fetches a GitHub repository tree, classifies blob files by category, and returns a paginated subset of matching files.
    
    Parameters:
        request (ScanRequest): Contains `repo_url` (GitHub repository URL) and `offset` (pagination start index).
    
    Returns:
        dict: {
            "owner": owner (str),
            "repo": repo (str),
            "files_found": list[dict]: paginated list of {"path": str, "category": str},
            "total_found": int,
            "offset": int,
            "message": str | None
        }
    
    Raises:
        HTTPException: status 400 if `repo_url` is not a valid GitHub repository URL.
        HTTPException: status equals GitHub response status if fetching the repository tree fails.
        HTTPException: status 500 for other internal errors.
    """
    match = GITHUB_URL_PATTERN.match(request.repo_url.rstrip("/"))
    if not match:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL format")
    
    owner, repo = match.groups()
    
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
                "message": f"Showing files {request.offset + 1}-{request.offset + len(files)} of {total_found}." if total_found > 50 else None
            }
            
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

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
                safe_path = getattr(file_info, "path", "<unknown>")
                yield f"{json.dumps({'file': safe_path, 'error': str(e)})}\n"
    
    return StreamingResponse(generate_results(), media_type="application/x-ndjson")
