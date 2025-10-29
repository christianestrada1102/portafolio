@echo off
echo ========================================
echo   Portafolio Web - Christian Estrada
echo ========================================
echo.
echo Iniciando Frontend y Backend...
echo.

REM Iniciar el backend en una nueva ventana
start cmd /k "cd server && npm install && npm start"

REM Esperar 3 segundos
timeout /t 3 /nobreak > nul

REM Iniciar el frontend en la ventana actual
echo Iniciando Frontend en http://localhost:3000
echo Backend en http://localhost:5000
echo.
npm run dev

pause

