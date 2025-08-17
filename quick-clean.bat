@echo off
echo Removing desktop.ini files from Git objects...

for /d %%d in (.git\objects\*) do (
    if exist "%%d\desktop.ini" (
        echo Removing %%d\desktop.ini
        del /q "%%d\desktop.ini" 2>nul
    )
)

echo Cleanup complete!
git status
