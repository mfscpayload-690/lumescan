import re
import httpx
import json
import asyncio
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from app.services.analyze import analyze_service

router = APIRouter()

GITHUB_URL_PATTERN = re.compile(r"https?://github\.com/([^/]+)/([^/]+)/?$")

class ScanRequest(BaseModel):
    repo_url: str = Field(..., description="The full URL of the GitHub repository")

class AnalyzeRequest(BaseModel):
    owner: str
    repo: str
    files: list[str]

@router.post("/scan/init")
async def init_scan(request: ScanRequest):
    # 1. Validation
    match = GITHUB_URL_PATTERN.match(request.repo_url.rstrip("/"))
    if not match:
        raise HTTPException(status_code=400, detail="Invalid GitHub repository URL format")
    
    owner, repo = match.groups()
    
    # 2. Fetching tree recursively
    # Note: For public repos, we don't strictly need a token but rate limits are low.
    # For now, we'll assume public access.
    tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/main?recursive=1"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(tree_url)
            # If main doesn't exist, try master
            if response.status_code == 404:
                tree_url = f"https://api.github.com/repos/{owner}/{repo}/git/trees/master?recursive=1"
                response = await client.get(tree_url)
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to fetch repository tree")
            
            data = response.json()
            tree = data.get("tree", [])
            
            # 3. Filtering
            target_files = [
                item["path"] for item in tree 
                if item["type"] == "blob" and (
                    item["path"].endswith("package.json") or
                    item["path"].endswith("Dockerfile") or
                    item["path"].endswith(".env.example") or
                    item["path"].endswith(".yml") or
                    item["path"].endswith(".yaml")
                )
            ]
            
            return {
                "owner": owner,
                "repo": repo,
                "files_found": target_files,
                "total_files": len(tree),
                "status": "success"
            }
            
        except httpx.RequestError as exc:
            raise HTTPException(status_code=500, detail=f"Request to GitHub API failed: {exc}")

@router.post("/scan/analyze")
async def analyze_repo(request: AnalyzeRequest):
    async def generate_results():
        for file_path in request.files:
            try:
                result = await analyze_service.analyze_file(request.owner, request.repo, file_path)
                # Yield as a JSON line
                yield json.dumps(result) + "\n"
            except Exception as e:
                yield json.dumps({"file": file_path, "error": str(e)}) + "\n"
            
            # Pacing to avoid rate limits
            await asyncio.sleep(6.5)
            
    return StreamingResponse(generate_results(), media_type="application/x-ndjson")
