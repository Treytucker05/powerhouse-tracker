#!/usr/bin/env powershell

Write-Host "🔧 Cleaning up all broken desktop.ini Git references..." -ForegroundColor Yellow

# Define all the broken references we found
$brokenRefs = @(
    "refs/desktop.ini",
    "refs/heads/backup/desktop.ini",
    "refs/heads/chore/desktop.ini",
    "refs/heads/codex/desktop.ini",
    "refs/heads/desktop.ini",
    "refs/heads/feat/desktop.ini",
    "refs/heads/feature/desktop.ini",
    "refs/heads/fix/desktop.ini",
    "refs/heads/test/desktop.ini",
    "refs/remotes/desktop.ini",
    "refs/remotes/origin/1fpeg3-codex/desktop.ini",
    "refs/remotes/origin/chore/desktop.ini",
    "refs/remotes/origin/codex/desktop.ini",
    "refs/remotes/origin/copilot/desktop.ini",
    "refs/remotes/origin/desktop.ini",
    "refs/remotes/origin/feat/desktop.ini",
    "refs/remotes/origin/feature/desktop.ini",
    "refs/remotes/origin/fix/desktop.ini",
    "refs/tags/desktop.ini"
)

$cleaned = 0
$total = $brokenRefs.Count

foreach ($ref in $brokenRefs) {
    $refPath = ".git/$ref"
    $refFile = $refPath -replace '/', '\'
    
    if (Test-Path $refFile) {
        try {
            Remove-Item $refFile -Force
            Write-Host "✅ Removed: $ref" -ForegroundColor Green
            $cleaned++
        } catch {
            Write-Host "❌ Failed to remove: $ref" -ForegroundColor Red
        }
    } else {
        Write-Host "ℹ️  Not found: $ref" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🧹 Cleaning up empty directories..." -ForegroundColor Yellow

# Clean up empty directories
$emptyDirs = @(
    ".git\refs\heads\backup",
    ".git\refs\heads\chore",
    ".git\refs\heads\codex",
    ".git\refs\heads\feat",
    ".git\refs\heads\feature",
    ".git\refs\heads\fix",
    ".git\refs\heads\test",
    ".git\refs\remotes\origin\1fpeg3-codex",
    ".git\refs\remotes\origin\chore",
    ".git\refs\remotes\origin\codex",
    ".git\refs\remotes\origin\copilot",
    ".git\refs\remotes\origin\feat",
    ".git\refs\remotes\origin\feature",
    ".git\refs\remotes\origin\fix"
)

foreach ($dir in $emptyDirs) {
    if (Test-Path $dir) {
        try {
            $items = Get-ChildItem $dir -ErrorAction SilentlyContinue
            if (-not $items) {
                Remove-Item $dir -Force
                Write-Host "🗂️  Removed empty dir: $dir" -ForegroundColor Cyan
            }
        } catch {
            # Ignore errors for directory cleanup
        }
    }
}

Write-Host ""
Write-Host "🔄 Running Git garbage collection..." -ForegroundColor Yellow
git gc --prune=now

Write-Host ""
Write-Host "🎉 Git reference cleanup complete!" -ForegroundColor Green
Write-Host "📊 Summary: $cleaned/$total broken references removed" -ForegroundColor Cyan

# Test if the error is gone
Write-Host ""
Write-Host "🧪 Testing Git operations..." -ForegroundColor Yellow
try {
    $result = git status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git is working normally!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  There may still be issues:" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Git test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🗑️  Cleaning up script..." -ForegroundColor Yellow
Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
