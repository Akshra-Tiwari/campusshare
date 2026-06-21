@echo off
echo.
echo ==========================================
echo   CampusShare Setup - JNCT Bhopal
echo ==========================================
echo.

where node >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)
echo [OK] Node.js found

echo.
echo [1/4] Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo [OK] Frontend ready

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
cd ..
echo [OK] Backend ready

echo.
echo [3/4] Installing Firebase CLI...
call npm install -g firebase-tools
echo [OK] Firebase CLI ready

echo.
echo [4/4] Installing Vercel CLI...
call npm install -g vercel
echo [OK] Vercel CLI ready

echo.
echo ==========================================
echo   Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo   1. firebase login
echo   2. firebase deploy --only firestore:rules,firestore:indexes
echo   3. Open two terminals:
echo        Terminal 1: cd frontend ^& npm run dev
echo        Terminal 2: cd backend ^& npm run dev
echo   4. Open: http://localhost:5173
echo.
pause
