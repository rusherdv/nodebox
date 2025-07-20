@echo off
REM NodeBox Server Startup Script - Safe automation tool
REM This script starts a local web server for PC remote control
cd /d "%~dp0"
pm2 start pm2.config.js --env production
pause