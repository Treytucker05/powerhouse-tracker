# Simplified Git Desktop.ini Cleanup Script
Write-Host "🧹 Starting Git desktop.ini cleanup..." -ForegroundColor Yellow

$repoPath = "c:\Users\treyt\OneDrive\Desktop\Projects\ProgramDesignWorkspace"
Set-Location $repoPath

# Remove all desktop.ini files from .git directory recursively
Write-Host "🗑️ Removing desktop.ini files from .git directory..." -ForegroundColor Blue
$gitDir = ".\.git"

Get-ChildItem -Path $gitDir -Recurse -Force -Filter "desktop.ini" -ErrorAction SilentlyContinue | ForEach-Object {
    Write-Host "Removing: $($_.FullName)" -ForegroundColor Red
    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
}

# Clean git garbage
Write-Host "🧹 Running git garbage collection..." -ForegroundColor Blue
git gc --prune=now --aggressive

# Check repository integrity
Write-Host "🔍 Checking repository integrity..." -ForegroundColor Blue
git fsck --full

Write-Host "✅ Cleanup completed!" -ForegroundColor Green
Write-Host "Try pushing to GitHub now." -ForegroundColor Cyan
