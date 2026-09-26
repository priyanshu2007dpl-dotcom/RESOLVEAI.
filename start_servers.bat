@echo off
echo ========================================================
echo   Starting Resolve AI Platform (Backend + Frontend)
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/2] Launching Backend Uvicorn on http://127.0.0.1:8000 ...
start "Resolve AI Backend API" cmd /k "cd backend && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

echo [2/2] Launching Frontend Next.js on http://localhost:3000 ...
start "Resolve AI Frontend Web" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo   Resolve AI is running!
echo   Frontend: http://localhost:3000
echo   Backend:  http://127.0.0.1:8000
echo   API Docs: http://127.0.0.1:8000/docs
echo ========================================================
pause
