@echo off
echo ========================================
echo   Installation Daara Re-Creation Manager
echo ========================================
echo.

echo [1/4] Nettoyage des anciens fichiers...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist dist rmdir /s /q dist

echo [2/4] Installation des dependances...
npm install

echo [3/4] Compilation des styles CSS...
npm run css:build

echo [4/4] Test de l'application...
echo.
echo ========================================
echo   Installation terminee !
echo ========================================
echo.
echo Pour lancer l'application : npm start
echo Pour creer l'executable Windows : npm run build:win
echo.
pause
