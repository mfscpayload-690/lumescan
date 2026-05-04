from groq import Groq
import httpx
import json
import asyncio
from app.core.config import settings

class AnalyzeService:
    def __init__(self):
        # Groq Configuration (Primary Engine)
        if settings.GROQ_API_KEY:
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        else:
            self.groq_client = None

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

    def _get_prompt(self, owner, repo, path, content, category):
        return f"""
        You are a Senior Security Auditor performing a DEEP LOGIC audit on a {category} file: '{path}'.
        Repository Context: {owner}/{repo}

        AUDIT FOCUS (OWASP & Framework Specific):
        {
            "- LOGIC AUDIT: Search for Broken Access Control, BOLA (Object level auth), SQL/NoSQL Injection, and Unsafe Operations." if category == "Logic" else
            "- CONFIG AUDIT: Search for Insecure CORS (allow_origins=['*']), exposed debug modes, and weak crypto." if category == "Config" else
            "- WORKFLOW AUDIT: Search for plain-text secret exposure in CI/CD and unpinned 3rd party actions." if category == "Workflow" else
            "- SECRETS AUDIT: Search for actual API keys, credentials, or dangerous misconfigurations in .env.example." if category == "Secrets" else
            "Perform a general security hygiene and dependency audit."
        }

        FILE CONTENT:
        ---
        {content}
        ---

        Output Requirements:
        1. Return ONLY a valid JSON object.
        2. Identify specific lines or logic blocks that are problematic.
        3. Assign severity: Critical, High, Medium, Low, Informational.

        JSON FORMAT:
        {{
            "file": "{path}",
            "findings": [
                {{
                    "type": "Vulnerability|Compliance|BestPractice",
                    "severity": "Critical|High|Medium|Low|Informational",
                    "description": "Short, technical description of the flaw.",
                    "recommendation": "Step-by-step remediation advice."
                }}
            ]
        }}
        """

    async def analyze_file(self, owner: str, repo: str, path: str, category: str = "General") -> dict:
        content = await self.get_file_content(owner, repo, path)
        if not content:
            return {"error": f"Could not fetch content for {path}", "file": path}

        prompt = self._get_prompt(owner, repo, path, content, category)

        if not self.groq_client:
            return {"error": "Groq API key not configured", "file": path}

        try:
            # Groq high-speed analysis
            response = await asyncio.to_thread(
                self.groq_client.chat.completions.create,
                messages=[
                    {"role": "system", "content": "You are a specialized security auditor JSON output machine."},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
                response_format={"type": "json_object"}
            )
            result = json.loads(response.choices[0].message.content)
            # Ensure AI doesn't override critical metadata (Hallucination Shield)
            result["file"] = path
            result["category"] = category
            return result
        except Exception as e:
            return {"error": f"Groq Analysis failed: {str(e)}", "file": path}

analyze_service = AnalyzeService()
