@echo off
echo Stopping API Testing Playground servers...
taskkill /F /IM node.exe 2>nul
echo All servers stopped.
pause
