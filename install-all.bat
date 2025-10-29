@echo off
echo ========================================
echo   Instalando dependencias...
echo ========================================
echo.

echo [1/2] Instalando dependencias del Frontend...
call npm install
echo.

echo [2/2] Instalando dependencias del Backend...
cd server
call npm install
cd ..
echo.

echo ========================================
echo   Instalacion completada!
echo ========================================
echo.
echo Siguiente paso: Configura el archivo .env en la carpeta server/
echo Lee el archivo server/ENV_TEMPLATE.txt para instrucciones.
echo.
echo Para iniciar el proyecto, ejecuta: start-dev.bat
echo.

pause

