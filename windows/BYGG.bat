@echo off
chcp 65001 >nul
title Bygger Doskungen i Västmyra
echo.
echo  Bygger Doskungen i Västmyra som Windows-app...
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js saknas. Installera "LTS" fran https://nodejs.org och kor BYGG.bat igen.
  start https://nodejs.org
  pause
  exit /b 1
)
call npm install
if errorlevel 1 ( echo. & echo  npm install misslyckades. & pause & exit /b 1 )
call npm run dist
if errorlevel 1 ( echo. & echo  Bygget misslyckades. & pause & exit /b 1 )
echo.
echo  Klart! Installationsfilen och en portabel version ligger i mappen dist.
explorer dist
pause
