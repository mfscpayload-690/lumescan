import asyncio
import json

import httpx
from groq import Groq

from app.core.config import settings

class AnalyzeService:
    def __init__(self):
        if settings.GROQ_API_KEY:
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        else:
            self.groq_client = None

    async def get_file_content(self, owner: str, repo: str, path: str) -> str:
        """
        Retrieve raw file contents from a GitHub repository.
        """
        urls = [
            f"https://raw.githubusercontent.com/{owner}/{repo}/main/{path}",
            f"https://raw.githubusercontent.com/{owner}/{repo}/master/{path}"
        ]
        
        async with httpx.AsyncClient() as client:
            for url in urls:
                try:
                    response = await client.get(url)
                    if response.status_code == 200:
                        return response.text
                except Exception:
                    continue
        return ""

    def _generate_prompt(
        self, owner: str, repo: str, path: str, content: str, category: str
    ) -> str:
        """
        Generates a security audit prompt for the AI.
        """
        focus = "general security hygiene and dependency audit."
        if category == "Logic":
            focus = "BOLA, SQL/NoSQL Injection, and Unsafe Operations."
        elif category == "Config":
            focus = "Insecure CORS, exposed debug modes, and weak crypto."
        elif category == "Workflow":
            focus = "Secret exposure in CI/CD and unpinned 3rd party actions."
        elif category == "Secrets":
            focus = "credentials or dangerous misconfigurations."

        return f"""
        Audit the following {category} file: '{path}' in {owner}/{repo}.
        Focus: {focus}
        
        File Content:
        {content}
        
        Output valid JSON with "findings" array (file, line, message, severity, title).
        """

    async def analyze_file(
        self, owner: str, repo: str, path: str, category: str = "General"
    ) -> dict:
        """
        Performs a security-focused analysis of a repository file.
        """
        if not self.groq_client:
            return {"file": path, "error": "Groq client not configured"}

        content = await self.get_file_content(owner, repo, path)
        if not content:
            return {"file": path, "error": "Could not fetch file content"}

        prompt = self._generate_prompt(owner, repo, path, content, category)
        
        try:
            loop = asyncio.get_event_loop()
            chat_completion = await loop.run_in_executor(
                None,
                lambda: self.groq_client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": "You are a security auditor JSON machine."},
                        {"role": "user", "content": prompt}
                    ],
                    model="llama-3.3-70b-versatile",
                    response_format={"type": "json_object"},
                )
            )
            
            result = json.loads(chat_completion.choices[0].message.content)
            result["file"] = path
            return result
        except Exception as e:
            return {"file": path, "error": str(e)}

analyze_service = AnalyzeService()
