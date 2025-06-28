@echo off
echo Starting Dynamic Form Generation System...
echo.

echo 1. Starting Server...
cd Server
start "Server" cmd /k "python main.py"
cd ..

echo 2. Starting Client...
cd Client
start "Client" cmd /k "npm start"
cd ..

echo.
echo System is starting up...
echo Server will be available at: http://localhost:8000
echo Client will be available at: http://localhost:3000
echo.
pause 