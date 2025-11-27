@echo off
echo === Running 5/3/1 Extraction Build ===
cd /d %~dp0\..
call npm run extract:all
echo.
echo ✅ Extraction complete. Excel + CSVs should be open.
pause
