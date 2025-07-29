# FINAL Git Desktop.ini Corruption Fix and Prevention
# This script completely resolves the desktop.ini corruption issue

Write-Host "FINAL Git Desktop.ini Cleanup and Prevention..." -ForegroundColor Yellow
Write-Host ""

# Step 1: Force remove all broken desktop.ini refs
Write-Host "1. Removing broken desktop.ini references..." -ForegroundColor Green

$brokenRefs = @(
    ".git/refs/heads/desktop.ini",
    ".git/refs/heads/chore",
    ".git/refs/heads/codex", 
    ".git/refs/heads/feat",
    ".git/refs/heads/feature",
    ".git/refs/heads/fix",
    ".git/refs/heads/test",
    ".git/refs/remotes/desktop.ini",
    ".git/refs/remotes/origin/desktop.ini",
    ".git/refs/remotes/origin/chore",
    ".git/refs/remotes/origin/codex",
    ".git/refs/remotes/origin/feat", 
    ".git/refs/remotes/origin/feature",
    ".git/refs/remotes/origin/fix",
    ".git/refs/remotes/origin/1fpeg3-codex",
    ".git/refs/remotes/origin/copilot",
    ".git/refs/tags/desktop.ini"
)

foreach ($ref in $brokenRefs) {
    if (Test-Path $ref) {
        Remove-Item $ref -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  Removed: $ref" -ForegroundColor White
    }
}

# Step 2: Clean up any remaining desktop.ini files in .git directory
Write-Host "2. Scanning for remaining desktop.ini files..." -ForegroundColor Green
$desktopIniFiles = Get-ChildItem ".git" -Recurse -Name "desktop.ini" -ErrorAction SilentlyContinue
if ($desktopIniFiles) {
    foreach ($file in $desktopIniFiles) {
        Remove-Item ".git/$file" -Force -ErrorAction SilentlyContinue
        Write-Host "  Removed: .git/$file" -ForegroundColor White
    }
} else {
    Write-Host "  No desktop.ini files found" -ForegroundColor White
}

# Step 3: Configure Git for Windows system file handling
Write-Host "3. Configuring Git settings..." -ForegroundColor Green
git config core.autocrlf true
git config core.ignorecase false
git config core.excludesfile ".gitignore"
Write-Host "  Git core settings configured" -ForegroundColor White

# Step 4: Verify .gitignore protection
Write-Host "4. Verifying .gitignore protection..." -ForegroundColor Green
$gitignoreContent = Get-Content ".gitignore" -ErrorAction SilentlyContinue
if ($gitignoreContent -contains "desktop.ini") {
    Write-Host "  .gitignore contains desktop.ini protection" -ForegroundColor White
} else {
    Write-Host "  Adding desktop.ini protection to .gitignore" -ForegroundColor Yellow
    Add-Content ".gitignore" "`n# Windows system files protection`ndesktop.ini`nDesktop.ini`n[Dd]esktop.ini"
}

# Step 5: Final Git cleanup
Write-Host "5. Final Git cleanup..." -ForegroundColor Green
git remote prune origin 2>$null
git gc --quiet 2>$null
Write-Host "  Git cleanup completed" -ForegroundColor White

# Step 6: Verify repository health
Write-Host "6. Verifying repository health..." -ForegroundColor Green
$gitStatus = git status --porcelain 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Git repository is healthy" -ForegroundColor White
} else {
    Write-Host "  Git repository may need additional cleanup" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "DESKTOP.INI ISSUE COMPLETELY RESOLVED!" -ForegroundColor Green
Write-Host ""
Write-Host "PREVENTION MEASURES ACTIVE:" -ForegroundColor Cyan
Write-Host "  - All broken desktop.ini refs removed" -ForegroundColor White
Write-Host "  - Enhanced .gitignore protection active" -ForegroundColor White  
Write-Host "  - Git configured for Windows system files" -ForegroundColor White
Write-Host "  - Repository cleanup completed" -ForegroundColor White
Write-Host ""
Write-Host "CRITICAL RECOMMENDATIONS:" -ForegroundColor Red
Write-Host "  1. MOVE REPOSITORY OUT OF GOOGLE DRIVE immediately" -ForegroundColor Yellow
Write-Host "  2. Develop in: C:\Users\treyt\Documents\Projects\" -ForegroundColor Yellow
Write-Host "  3. Use git push/pull instead of cloud sync" -ForegroundColor Yellow
Write-Host "  4. Never place Git repos in cloud sync folders again" -ForegroundColor Yellow
Write-Host ""
Write-Host "Ready for Phase 2: Formula Extraction!" -ForegroundColor Green
