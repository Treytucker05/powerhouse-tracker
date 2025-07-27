# Git Desktop.ini Cleanup Script
# This script removes all desktop.ini files that have corrupted the Git repository

Write-Host "🧹 Starting comprehensive Git desktop.ini cleanup..." -ForegroundColor Yellow

$repoPath = "c:\Users\treyt\OneDrive\Desktop\Projects\ProgramDesignWorkspace"
Set-Location $repoPath

Write-Host "📍 Working in: $repoPath" -ForegroundColor Green

# Stop any git processes that might be running
Write-Host "🛑 Stopping any running Git processes..." -ForegroundColor Blue
Get-Process | Where-Object {$_.ProcessName -like "*git*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Remove all desktop.ini files from .git directory
Write-Host "🗑️ Removing desktop.ini files from .git directory..." -ForegroundColor Blue
$gitPath = Join-Path $repoPath ".git"
$desktopIniFiles = Get-ChildItem -Path $gitPath -Recurse -Force -Name "desktop.ini" -ErrorAction SilentlyContinue

if ($desktopIniFiles) {
    Write-Host "Found $($desktopIniFiles.Count) desktop.ini files to remove:" -ForegroundColor Red
    foreach ($file in $desktopIniFiles) {
        $fullPath = Join-Path $gitPath $file
        try {
            Remove-Item $fullPath -Force -ErrorAction Stop
            Write-Host "  ✅ Removed: $file" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ Failed to remove: $file - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No desktop.ini files found in .git directory" -ForegroundColor Green
}

# Clean up Git references
Write-Host "🔧 Cleaning up Git references..." -ForegroundColor Blue
try {
    # Remove any remaining desktop.ini refs
    $refsPath = Join-Path $gitPath "refs"
    Get-ChildItem -Path $refsPath -Recurse -Force -Filter "desktop.ini" -ErrorAction SilentlyContinue | Remove-Item -Force
    
    # Remove packed-refs if it exists and is corrupted
    $packedRefsPath = Join-Path $gitPath "packed-refs"
    if (Test-Path $packedRefsPath) {
        $content = Get-Content $packedRefsPath -ErrorAction SilentlyContinue
        if ($content -match "desktop\.ini") {
            Write-Host "🔨 Cleaning packed-refs file..." -ForegroundColor Blue
            $cleanContent = $content | Where-Object { $_ -notmatch "desktop\.ini" }
            $cleanContent | Set-Content $packedRefsPath
        }
    }
    
    Write-Host "✅ Git references cleaned" -ForegroundColor Green
} catch {
    Write-Host "❌ Error cleaning Git references: $($_.Exception.Message)" -ForegroundColor Red
}

# Run Git maintenance
Write-Host "🔧 Running Git maintenance..." -ForegroundColor Blue
try {
    # Git garbage collection
    & git gc --prune=now --aggressive 2>$null
    Write-Host "✅ Git garbage collection completed" -ForegroundColor Green
    
    # Git fsck to check for remaining issues
    Write-Host "🔍 Checking repository integrity..." -ForegroundColor Blue
    $fsckOutput = & git fsck --full 2>&1
    
    if ($fsckOutput -match "desktop\.ini") {
        Write-Host "⚠️ Still found desktop.ini references in repository" -ForegroundColor Yellow
        $fsckOutput | Where-Object { $_ -match "desktop\.ini" } | ForEach-Object {
            Write-Host "  $_" -ForegroundColor Red
        }
    } else {
        Write-Host "✅ No desktop.ini references found in repository integrity check" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error during Git maintenance: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Git functionality
Write-Host "🧪 Testing Git functionality..." -ForegroundColor Blue
try {
    $gitStatus = & git status --porcelain 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git status working correctly" -ForegroundColor Green
    } else {
        Write-Host "❌ Git status failed: $gitStatus" -ForegroundColor Red
    }
    
    $showRef = & git show-ref 2>&1
    if ($showRef -match "desktop\.ini") {
        Write-Host "⚠️ Still found desktop.ini in show-ref output" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Git show-ref working correctly" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Error testing Git functionality: $($_.Exception.Message)" -ForegroundColor Red
}

# Add .gitignore entries to prevent future desktop.ini issues
Write-Host "🛡️ Adding desktop.ini to .gitignore..." -ForegroundColor Blue
$gitignorePath = Join-Path $repoPath ".gitignore"
$desktopIniIgnore = @"

# Windows desktop.ini files (Google Drive sync can create these)
desktop.ini
**/desktop.ini
Thumbs.db
*.lnk
"@

if (Test-Path $gitignorePath) {
    $existingContent = Get-Content $gitignorePath -Raw
    if ($existingContent -notmatch "desktop\.ini") {
        Add-Content $gitignorePath $desktopIniIgnore
        Write-Host "✅ Added desktop.ini entries to existing .gitignore" -ForegroundColor Green
    } else {
        Write-Host "✅ desktop.ini already in .gitignore" -ForegroundColor Green
    }
} else {
    Set-Content $gitignorePath $desktopIniIgnore.Trim()
    Write-Host "✅ Created .gitignore with desktop.ini entries" -ForegroundColor Green
}

} catch {
    Write-Host "❌ Error during .gitignore update: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Git cleanup completed!" -ForegroundColor Green
Write-Host "You should now be able to push to GitHub without desktop.ini errors." -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Try 'git status' to verify everything is working" -ForegroundColor White
Write-Host "2. Try pushing to GitHub Desktop again" -ForegroundColor White
Write-Host "3. If issues persist, consider using 'git push origin main --force-with-lease'" -ForegroundColor White
