from groq import Groq
import httpx
import json
import asyncio
import hashlib
from app.core.config import settings
from app.core.cache import analysis_cache

class AnalyzeService:
    def __init__(self):
        # Groq Configuration (Primary Engine)
        """
        Initialize the AnalyzeService instance by configuring the Groq client for the primary engine when a GROQ API key is available.
        
        If `settings.GROQ_API_KEY` is set, `self.groq_client` is initialized with `Groq(api_key=...)`; otherwise `self.groq_client` is set to `None`.
        """
        if settings.GROQ_API_KEY:
            self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        else:
            self.groq_client = None

    async def get_file_content(self, owner: str, repo: str, path: str) -> str:
        """
        Retrieve raw file contents from a GitHub repository, trying the `main` branch and falling back to `master`.
        
        Parameters:
            owner (str): Repository owner or organization.
            repo (str): Repository name.
            path (str): Path to the file within the repository.
        
        Returns:
            str: The file contents when a successful (HTTP 200) response is received; an empty string if the file is not found or on any error.
        """
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
        """
        Constructs the Groq audit prompt for a DEEP LOGIC security analysis of a repository file.
        
        This prompt instructs the model to perform a focused security audit and to return a single valid JSON object describing findings. The `category` parameter adjusts the audit focus (e.g., logic, config, workflow, secrets); otherwise a general security and dependency audit is requested. The generated prompt embeds the repository context and file content and enforces the JSON output schema and severity taxonomy.
        
        Parameters:
            owner (str): GitHub repository owner or organization.
            repo (str): Repository name.
            path (str): Path to the file within the repository.
            content (str): Raw file content to be analyzed (included verbatim in the prompt).
            category (str): Audit category that tailors the focus. Common values:
                - "Logic": Broken access control, BOLA, injection, unsafe operations.
                - "Config": Insecure CORS, exposed debug modes, weak crypto.
                - "Workflow": Plain-text secret exposure in CI/CD, unpinned third-party actions.
                - "Secrets": Actual credentials/API keys or dangerous .env.example misconfigurations.
                - Any other value triggers a general security hygiene and dependency audit.
        
        Returns:
            str: A formatted instruction prompt suitable for sending to the Groq chat completion API.
        """
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
        """
        Performs a security-focused analysis of a repository file and returns the parsed analysis result.
        Uses in-memory caching to avoid redundant Groq API calls for unchanged files.
        """
        content = await self.get_file_content(owner, repo, path)
        if not content:
            return {"error": f"Could not fetch content for {path}", "file": path}

        # Cache key based on path and content hash to prevent stale results
        content_hash = hashlib.md5(content.encode()).hexdigest()
        cache_key = f"{owner}/{repo}/{path}:{content_hash}"
        
        cached_result = analysis_cache.get(cache_key)
        if cached_result:
            return cached_result

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
            
            # Save to cache
            analysis_cache.set(cache_key, result)
            return result
        except Exception as e:
            return {"error": f"Groq Analysis failed: {str(e)}", "file": path}

analyze_service = AnalyzeService()
