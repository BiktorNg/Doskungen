@echo off
chcp 65001 >nul
where node >nul 2>nul
if errorlevel 1 ( echo Node.js saknas - installera fran https://nodejs.org & start https://nodejs.org & pause & exit /b 1 )
if not exist node_modules call npm install
call npm start
