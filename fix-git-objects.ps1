#!/usr/bin/env powershell

Write-Host "🔧 Fixing corrupted Git object files..." -ForegroundColor Yellow

# Find all desktop.ini files in .git/objects
$objectsPath = ".git\objects"
$desktopIniFiles = @()

if (Test-Path $objectsPath) {
    Write-Host "📁 Scanning Git objects directory..." -ForegroundColor Cyan
    
    # Get all desktop.ini files in objects directory
    $desktopIniFiles = Get-ChildItem -Path $objectsPath -Name "desktop.ini" -Recurse -Force -ErrorAction SilentlyContinue
    
    if ($desktopIniFiles.Count -gt 0) {
        Write-Host "Found $($desktopIniFiles.Count) desktop.ini files in Git objects" -ForegroundColor Red
        
        foreach ($file in $desktopIniFiles) {
            $fullPath = Join-Path $objectsPath $file
            try {
                Remove-Item $fullPath -Force
                Write-Host "✅ Removed: $fullPath" -ForegroundColor Green
            } catch {
                Write-Host "❌ Failed to remove: $fullPath" -ForegroundColor Red
            }
        }
    } else {
        Write-Host "No desktop.ini files found in objects directory" -ForegroundColor Green
    }
    
    # Also check for any folders named desktop.ini
    $badFolders = Get-ChildItem -Path $objectsPath -Directory -Name "*desktop*" -Recurse -Force -ErrorAction SilentlyContinue
    foreach ($folder in $badFolders) {
        $fullPath = Join-Path $objectsPath $folder
        try {
            Remove-Item $fullPath -Recurse -Force
            Write-Host "✅ Removed folder: $fullPath" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to remove folder: $fullPath" -ForegroundColor Red
        }
    }
}

# Check specific problematic object directories mentioned in error
$problematicObjects = @("df", "e0", "e1", "e2")
foreach ($objDir in $problematicObjects) {
    $objPath = ".git\objects\$objDir"
    $desktopFile = "$objPath\desktop.ini"
    
    if (Test-Path $desktopFile) {
        Write-Host "🎯 Found problematic object: $desktopFile" -ForegroundColor Yellow
        try {
            Remove-Item $desktopFile -Force
            Write-Host "✅ Removed: $desktopFile" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to remove: $desktopFile" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "🧹 Running Git fsck to check repository integrity..." -ForegroundColor Yellow
try {
    $fsckResult = git fsck --full 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Repository integrity check passed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Repository fsck output:" -ForegroundColor Yellow
        Write-Host $fsckResult -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Git fsck failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔄 Running Git garbage collection..." -ForegroundColor Yellow
try {
    git gc --aggressive --prune=now
    Write-Host "✅ Garbage collection complete!" -ForegroundColor Green
} catch {
    Write-Host "❌ Garbage collection failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🧪 Testing Git operations..." -ForegroundColor Yellow
try {
    $statusResult = git status 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git status working!" -ForegroundColor Green
    } else {
        Write-Host "❌ Git status error:" -ForegroundColor Red
        Write-Host $statusResult -ForegroundColor Red
    }
    
    # Test a simple Git command
    $logResult = git log --oneline -1 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git log working!" -ForegroundColor Green
        Write-Host "Latest commit: $logResult" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Git log error:" -ForegroundColor Red
        Write-Host $logResult -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Git test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Git object cleanup complete!" -ForegroundColor Green

# Clean up this script
Write-Host ""
Write-Host "🗑️  Cleaning up script..." -ForegroundColor Yellow
Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
