@echo off
echo ========================================
echo AI Resume Builder - Spring Boot Backend
echo ========================================
echo.

echo Checking Java installation...
java -version
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17+ from https://adoptium.net/
    pause
    exit /b 1
)
echo.

echo Checking Maven installation...
mvn -version
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven from https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo.

echo Building project...
call mvn clean install
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo Starting Spring Boot Application...
echo Server will run on http://localhost:8080
echo Press Ctrl+C to stop
echo ========================================
echo.

call mvn spring-boot:run
