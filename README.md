---
title: LumeScan API
emoji: 🛡️
colorFrom: green
colorTo: emerald
sdk: docker
app_port: 7860
---

# LUME SCAN

**LumeScan** is a high-speed, automated GitHub security auditor designed to detect logic flaws, exposed secrets, and misconfigurations in real-time. Powered by the **Groq Llama 3.3** engine, it provides deep-context security analysis with lightning-fast results.

## Key Features

- **High-Speed AI Auditing**: Powered by **Groq / Llama 3.3 (70B)** for near-instant security reasoning.
- **Real-Time Streaming**: Findings are streamed to a professional dashboard as they are discovered.
- **Paginated Analysis**: Efficiently handles large repositories by auditing in manageable 50-file batches.
- **Deep Logic Scans**: Specifically targets BOLA, SQL/NoSQL Injection, Command Injection, and SSRF vulnerabilities.
- **Actionable Remediation**: Every finding includes clear, technical steps to fix the flaw.

## Project Structure

- `web/`: Modern Next.js + TailwindCSS security dashboard.
- `server/`: FastAPI backend with direct GitHub API integration and AI streaming.

## Setup & Installation

### Backend (Server)
1. Navigate to `/server`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Set your environment variables:
   ```bash
   GROQ_API_KEY=your_key_here
   ```
4. Start the server: `uvicorn app.main:app --reload --port 8000`.

### Frontend (Web)
1. Navigate to `/web`.
2. Install dependencies: `npm install`.
3. Start the dashboard: `npm run dev`.

## Audit Scope
- **Logic**: Python/JS Controllers, Auth flows, and Data Handling.
- **Config**: Dependency pinning, CORS, and infrastructure settings.
- **Secrets**: API keys, credentials, and `.env` exposures.
- **Workflows**: GitHub Actions security and unpinned versions.

---
*Built for security researchers and developers who demand speed and depth.*
