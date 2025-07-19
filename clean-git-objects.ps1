Write-Host "Cleaning up corrupted Git objects (desktop.ini files)..." -ForegroundColor Yellow

# Clean up desktop.ini files in Git objects directory
$objectsPath = ".git\objects"
$cleaned = 0
$found = 0

if (Test-Path $objectsPath) {
    Write-Host "Scanning Git objects directory..." -ForegroundColor Cyan
    
    # Find all desktop.ini files in objects directory
    $allFiles = Get-ChildItem -Path $objectsPath -Recurse -Name "*desktop.ini*" -ErrorAction SilentlyContinue
    
    foreach ($file in $allFiles) {
        $fullPath = Join-Path $objectsPath $file
        $found++
        
        if (Test-Path $fullPath) {
            try {
                Remove-Item $fullPath -Force
                Write-Host "Removed: .git\objects\$file" -ForegroundColor Green
                $cleaned++
            } catch {
                Write-Host "Failed to remove: .git\objects\$file" -ForegroundColor Red
            }
        }
    }
    
    # Also check each subdirectory specifically
    $subdirs = Get-ChildItem -Path $objectsPath -Directory -ErrorAction SilentlyContinue
    foreach ($subdir in $subdirs) {
        $desktopFile = Join-Path $subdir.FullName "desktop.ini"
        if (Test-Path $desktopFile) {
            $found++
            try {
                Remove-Item $desktopFile -Force
                Write-Host "Removed: .git\objects\$($subdir.Name)\desktop.ini" -ForegroundColor Green
                $cleaned++
            } catch {
                Write-Host "Failed to remove: .git\objects\$($subdir.Name)\desktop.ini" -ForegroundColor Red
            }
        }
    }
}

Write-Host ""
Write-Host "Running Git garbage collection..." -ForegroundColor Yellow
git gc --prune=now

Write-Host ""
Write-Host "Git objects cleanup complete!" -ForegroundColor Green
Write-Host "Summary: $cleaned/$found desktop.ini files removed from Git objects" -ForegroundColor Cyan

Write-Host ""
Write-Host "Testing Git operations..." -ForegroundColor Yellow
$result = git status 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Git is working normally!" -ForegroundColor Green
} else {
    Write-Host "Git status result:" -ForegroundColor Yellow
    Write-Host $result
}

Write-Host ""
Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue
