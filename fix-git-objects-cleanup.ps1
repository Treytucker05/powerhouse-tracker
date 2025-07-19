#!/usr/bin/env powershell

Write-Host "🔧 Cleaning up corrupted Git objects (desktop.ini files)..." -ForegroundColor Yellow

# Clean up desktop.ini files in Git objects directory
$objectsPath = ".git\objects"
$cleaned = 0
$found = 0

if (Test-Path $objectsPath) {
    Write-Host "🔍 Scanning Git objects directory..." -ForegroundColor Cyan
    
    # Get all desktop.ini files in the objects directory recursively
    $desktopIniFiles = Get-ChildItem -Path $objectsPath -Name "desktop.ini" -Recurse -ErrorAction SilentlyContinue
    
    foreach ($file in $desktopIniFiles) {
        $fullPath = Join-Path $objectsPath $file
        $found++
        
        try {
            Remove-Item $fullPath -Force
            Write-Host "✅ Removed: .git\objects\$file" -ForegroundColor Green
            $cleaned++
        } catch {
            Write-Host "❌ Failed to remove: .git\objects\$file - $_" -ForegroundColor Red
        }
    }
    
    # Also check for desktop.ini files in subdirectories
    $subdirs = Get-ChildItem -Path $objectsPath -Directory -ErrorAction SilentlyContinue
    foreach ($subdir in $subdirs) {
        $subdirPath = $subdir.FullName
        $desktopIniPath = Join-Path $subdirPath "desktop.ini"
        
        if (Test-Path $desktopIniPath) {
            $found++
            try {
                Remove-Item $desktopIniPath -Force
                $relativePath = $desktopIniPath.Replace("$PWD\.git\objects\", "")
                Write-Host "✅ Removed: .git\objects\$relativePath" -ForegroundColor Green
                $cleaned++
            } catch {
                Write-Host "❌ Failed to remove: $desktopIniPath - $_" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "⚠️  Git objects directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🧹 Cleaning up empty object directories..." -ForegroundColor Yellow

# Clean up any empty directories that might be left
$subdirs = Get-ChildItem -Path $objectsPath -Directory -ErrorAction SilentlyContinue
foreach ($subdir in $subdirs) {
    try {
        $items = Get-ChildItem $subdir.FullName -ErrorAction SilentlyContinue
        if (-not $items) {
            Remove-Item $subdir.FullName -Force -ErrorAction SilentlyContinue
            Write-Host "🗂️  Removed empty dir: $($subdir.Name)" -ForegroundColor Cyan
        }
    } catch {
        # Ignore errors for directory cleanup
    }
}

Write-Host ""
Write-Host "🔄 Running Git fsck to validate repository..." -ForegroundColor Yellow
try {
    $fsckResult = git fsck --full 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git repository integrity check passed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Git fsck found issues:" -ForegroundColor Yellow
        Write-Host $fsckResult -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Git fsck failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔄 Running Git garbage collection..." -ForegroundColor Yellow
try {
    git gc --prune=now --aggressive 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Git garbage collection completed!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Git gc had issues" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Git gc failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Git objects cleanup complete!" -ForegroundColor Green
Write-Host "📊 Summary: $cleaned/$found desktop.ini files removed from Git objects" -ForegroundColor Cyan

# Test if Git operations work now
Write-Host ""
Write-Host "🧪 Testing Git operations..." -ForegroundColor Yellow
try {
    Write-Host "Testing git status..." -ForegroundColor Gray
    $statusResult = git status --porcelain 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ git status: OK" -ForegroundColor Green
    } else {
        Write-Host "❌ git status failed:" -ForegroundColor Red
        Write-Host $statusResult -ForegroundColor Red
    }
    
    Write-Host "Testing git show-ref..." -ForegroundColor Gray
    $refResult = git show-ref 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ git show-ref: OK" -ForegroundColor Green
    } else {
        Write-Host "⚠️  git show-ref issues (may be normal if no refs):" -ForegroundColor Yellow
        Write-Host $refResult -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Git test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "🗑️  Cleaning up script..." -ForegroundColor Yellow
Start-Sleep 2
Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
