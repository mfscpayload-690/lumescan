# 🛰️ LumeScan

LumeScan is an automated deep-cycle security audit tool for GitHub repositories.

## 🚀 How to Run the Application

### 1. Start the Backend (FastAPI)
Navigate to the `server` directory, activate the virtual environment, and start the Uvicorn server.

```bash
cd server
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```
The backend will be available at `http://localhost:8000`.

### 2. Start the Frontend (Next.js)
Navigate to the `web` directory and start the development server.

```bash
cd web
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📂 Project Structure
- `web/`: Next.js 16 (App Router) - Frontend Dashboard & Landing Page.
- `server/`: FastAPI (Python 3.14) - Security Scan Logic.

## 🛡️ Core Features (Phase 1)
- **High-Conversion Landing Page**: Cyber-security firm style.
- **Cyber-Glow Dashboard**: Real-time terminal status logs.
- **Automated Scanner**: Traverses GitHub repos for `package.json`, `Dockerfile`, and more.
