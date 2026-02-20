@echo off
echo ========================================
echo Starting AI Resume Builder - Development
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend-java && start.bat"

echo Waiting 10 seconds for backend to start...
timeout /t 10 /nobreak

echo.
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
