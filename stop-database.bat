@echo off
echo ========================================
echo Stopping PostgreSQL Database
echo ========================================
echo.

docker-compose down

echo.
echo Database stopped!
echo.
echo Note: Your data is preserved in Docker volume 'postgres_data'
echo To delete all data, run: docker-compose down -v
echo.
pause
