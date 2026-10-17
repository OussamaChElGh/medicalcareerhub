@echo off
cd /d "%~dp0.."
if not defined NODE_ENV set "NODE_ENV=development"
call "node_modules\.bin\tsx.cmd" server.ts 1>".dev-server.out.log" 2>".dev-server.err.log"
exit /b %ERRORLEVEL%
