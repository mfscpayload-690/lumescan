import re
import traceback

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from app.core.config import settings
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
    Fetches a GitHub repository tree and returns matching files.
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
            raise HTTPException(
                status_code=400,
                detail="Invalid format. Use 'owner/repo' or full URL."
            )
    else:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository format.")
    
    try:
        timeout = httpx.Timeout(20.0, connect=5.0)
        async with httpx.AsyncClient(follow_redirects=True, timeout=timeout) as client:
            tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
            try:
                response = await client.get(tree_url)
                if response.status_code != 200:
                    tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
                    response = await client.get(tree_url)
            except httpx.TimeoutException as e:
                raise HTTPException(
                    status_code=504,
                    detail="GitHub API timed out while fetching repository tree."
                ) from e
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=response.status_code,
                    detail="Failed to fetch repository tree"
                )
            
            tree_data = response.json()
            
            # Fetch additional metadata for UI
            meta_url = f"https://api.github.com/repos/{owner}/{repo}"
            meta_response = await client.get(meta_url)
            languages_url = f"https://api.github.com/repos/{owner}/{repo}/languages"
            languages_response = await client.get(languages_url)
            
            metadata = {}
            if meta_response.status_code == 200:
                m = meta_response.json()
                languages_data = languages_response.json() if languages_response.status_code == 200 else {}
                metadata = {
                    "full_name": m.get("full_name"),
                    "description": m.get("description"),
                    "stars": m.get("stargazers_count"),
                    "forks": m.get("forks_count"),
                    "language": m.get("language"),
                    "languages": list(languages_data.keys()),
                    "license": m.get("license", {}).get("name") if m.get("license") else "No License",
                    "updated_at": m.get("updated_at"),
                    "open_issues": m.get("open_issues_count"),
                }

            all_files = []
            for item in tree_data.get("tree", []):
                if item.get("type") == "blob":
                    path = item.get("path", "")
                    category = "General"
                    
                    logic_exts = [
                        ".py", ".js", ".ts", ".tsx", ".jsx", ".go", ".rs", ".rb",
                        ".php", ".java", ".cpp", ".c", ".cs"
                    ]
                    config_exts = [".yaml", ".yml", ".json", ".conf", ".ini", ".toml", ".xml"]
                    
                    if any(path.lower().endswith(ext) for ext in logic_exts):
                        category = "Logic"
                    elif any(path.lower().endswith(ext) for ext in config_exts):
                        category = "Config"
                    elif "workflow" in path.lower() or path.lower().endswith(
                        (".github/workflows", "gitlab-ci.yml")
                    ):
                        category = "Workflow"
                    elif any(name in path.lower() for name in ["dockerfile", "containerfile"]):
                        category = "Infrastructure"
                    
                    all_files.append({"path": path, "category": category})

            files = all_files[request.offset : request.offset + 50]
            total_found = len(all_files)
            
            next_cursor = None
            if total_found > request.offset + 50:
                next_cursor = f"Showing {request.offset + 1}-{request.offset + len(files)} of {total_found}."
            
            return {
                "owner": owner,
                "repo": repo,
                "files": files,
                "total_found": total_found,
                "next_cursor": next_cursor,
                "metadata": metadata
            }
    except HTTPException:
        raise
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="An error occurred while initializing the scan."
        ) from None

@app.post("/api/v1/scan/analyze")
async def analyze_scan(request: AnalyzeRequest):
    """
    Analyzes files using the AI service.
    """
    from fastapi.responses import StreamingResponse
    import asyncio
    import json
    
    async def generate_results():
        for file_info in request.files:
            try:
                result = await analyze_service.analyze_file(
                    request.owner,
                    request.repo,
                    file_info.path,
                    file_info.category
                )
                yield f"{json.dumps(result)}\n"
            except Exception:
                traceback.print_exc()
                yield f"{json.dumps({'file': file_info.path, 'error': 'Analysis failed'})}\n"
            await asyncio.sleep(0.1)
    
    return StreamingResponse(generate_results(), media_type="application/x-ndjson")
