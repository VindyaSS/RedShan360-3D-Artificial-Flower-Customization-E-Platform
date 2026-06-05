@echo off
REM 🌸 RedShan360 Quick Start Script for Windows

echo.
echo 🌸 RedShan360 Guest User Dashboard - Quick Start
echo ================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    call npm install --legacy-peer-deps
)

echo.
echo 🚀 Starting development server...
echo    → Open http://localhost:5173
echo.
echo 📝 Press Ctrl+C to stop
echo.

call npm run dev
pause
