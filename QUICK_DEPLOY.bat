@echo off
echo ========================================
echo   Preparando para Desplegar en Vercel
echo ========================================
echo.

echo [1/4] Verificando que el proyecto compile...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR: El build fallo. Revisa los errores arriba.
    pause
    exit /b 1
)
echo Build exitoso!
echo.

echo [2/4] Inicializando Git (si no existe)...
if not exist .git (
    git init
    echo Git inicializado
) else (
    echo Git ya esta inicializado
)
echo.

echo [3/4] Agregando archivos a Git...
git add .
echo.

echo [4/4] Creando commit...
git commit -m "Ready for Vercel deployment"
echo.

echo ========================================
echo   Proyecto listo para Vercel!
echo ========================================
echo.
echo Ahora tienes 2 opciones:
echo.
echo OPCION 1 - Desplegar desde GitHub:
echo   1. Crea un repositorio en github.com
echo   2. Ejecuta: git remote add origin [URL-DE-TU-REPO]
echo   3. Ejecuta: git push -u origin main
echo   4. Ve a vercel.com e importa tu repositorio
echo.
echo OPCION 2 - Desplegar con CLI:
echo   1. Instala Vercel CLI: npm install -g vercel
echo   2. Ejecuta: vercel login
echo   3. Ejecuta: vercel
echo.
echo Lee DESPLEGAR_VERCEL.md para instrucciones detalladas
echo.

pause

