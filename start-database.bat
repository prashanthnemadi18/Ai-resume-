@echo off
echo ========================================
echo Starting PostgreSQL Database in Docker
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop first.
    echo.
    pause
    exit /b 1
)

echo Docker is running...
echo.

REM Start only the PostgreSQL database
echo Starting PostgreSQL container...
docker-compose up -d postgres

echo.
echo ========================================
echo PostgreSQL Database Started!
echo ========================================
echo.
echo Database Details:
echo   Host: localhost
echo   Port: 5432
echo   Database: resume_db
echo   Username: postgres
echo   Password: postgres123
echo.
echo Connection URL:
echo   jdbc:postgresql://localhost:5432/resume_db
echo.
echo To stop the database:
echo   docker-compose down
echo.
echo To view logs:
echo   docker-compose logs -f postgres
echo.
pause
