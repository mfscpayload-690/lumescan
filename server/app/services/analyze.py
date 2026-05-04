import google.generativeai as genai
import httpx
import json
import re
from app.core.config import settings

class AnalyzeService:
    def __init__(self):
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.model = genai.GenerativeModel('gemini-2.5-flash-lite')
        else:
            self.model = None

    async def get_file_content(self, owner: str, repo: str, path: str) -> str:
        url = f"https://raw.githubusercontent.com/{owner}/{repo}/main/{path}"
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(url)
                if response.status_code == 404:
                    url = f"https://raw.githubusercontent.com/{owner}/{repo}/master/{path}"
                    response = await client.get(url)
                
                if response.status_code == 200:
                    return response.text
            except Exception:
                pass
            return ""

    async def analyze_file(self, owner: str, repo: str, path: str) -> dict:
        if not self.model:
            return {"error": "Gemini API key not configured", "file": path}

        content = await self.get_file_content(owner, repo, path)
        if not content:
            return {"error": f"Could not fetch content for {path}", "file": path}

        prompt = f"""
        You are a Senior Security Engineer. Analyze the following file content from the GitHub repository '{owner}/{repo}' (file path: '{path}').
        
        File Content:
        ---
        {content}
        ---
        
        Identify:
        1. Potential security vulnerabilities (e.g., hardcoded secrets, insecure configurations, vulnerable dependencies).
        2. Compliance risks.
        3. Best practice violations.
        
        Provide the result in a structured JSON format ONLY. Do not add any conversational text.
        
        Format Example:
        {{
            "file": "{path}",
            "findings": [
                {{
                    "type": "Vulnerability",
                    "severity": "High",
                    "description": "Hardcoded API key found.",
                    "recommendation": "Use environment variables."
                }}
            ]
        }}
        """

        try:
            response = self.model.generate_content(prompt)
            text = response.text
            
            # Use regex to find the JSON block if it's wrapped in markdown
            json_match = re.search(r'\{.*\}', text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            
            return {"error": "Failed to parse AI response", "raw": text, "file": path}
        except Exception as e:
            return {"error": f"AI Analysis failed: {str(e)}", "file": path}

analyze_service = AnalyzeService()
