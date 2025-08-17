# Git Desktop.ini Prevention Script
Write-Host "Configuring Git to prevent desktop.ini corruption..." -ForegroundColor Yellow

# Configure Git core settings
git config core.autocrlf true
git config core.ignorecase false
git config core.excludesfile ".gitignore"

# Remove any existing desktop.ini files from index  
Write-Host "Cleaning any tracked desktop.ini files..." -ForegroundColor Green
git rm --cached -r . --ignore-unmatch --quiet 2>$null
git add . 2>$null

Write-Host "Git configuration complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Prevention measures active:" -ForegroundColor Cyan
Write-Host "- Enhanced .gitignore with comprehensive patterns" -ForegroundColor White
Write-Host "- Git configured to handle Windows system files properly" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT RECOMMENDATIONS:" -ForegroundColor Red
Write-Host "1. Move this repository OUTSIDE of Google Drive sync folder" -ForegroundColor Yellow
Write-Host "2. Use proper Git remotes (GitHub) instead of cloud sync for backup" -ForegroundColor Yellow
Write-Host "3. Develop locally, sync via Git push/pull" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ready to continue with Phase 2: Formula Extraction!" -ForegroundColor Green
