@echo off
echo ========================================================
echo   Setting Up Resolve AI Platform Environment
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Setting up Python virtual environment in backend...
cd backend
python -m venv .venv
call .venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m app.seed.demo_data
cd ..

echo [2/3] Installing frontend Node packages...
cd frontend
call npm install
cd ..

echo.
echo ========================================================
echo   Setup Complete! You can now double-click start_servers.bat!
echo ========================================================
pause
