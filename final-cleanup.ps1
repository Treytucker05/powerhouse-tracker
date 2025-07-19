Write-Host "Cleaning up corrupted desktop.ini files from Git objects..." -ForegroundColor Yellow

# Find and remove all desktop.ini files in .git\objects
$objectFiles = Get-ChildItem -Path ".git\objects" -Recurse -Name "desktop.ini" -Force

$cleaned = 0
foreach ($file in $objectFiles) {
    $fullPath = ".git\objects\$file"
    try {
        Remove-Item $fullPath -Force
        Write-Host "Removed: $fullPath" -ForegroundColor Green
        $cleaned++
    } catch {
        Write-Host "Failed to remove: $fullPath" -ForegroundColor Red
    }
}

Write-Host "Running Git garbage collection to clean up..." -ForegroundColor Yellow
git gc --aggressive --prune=now

Write-Host "Cleanup complete! Removed $cleaned corrupted object files" -ForegroundColor Green

# Clean up the script files
Remove-Item "fix-git-refs.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item "fix-refs-simple.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item $MyInvocation.MyCommand.Path -Force -ErrorAction SilentlyContinue

Write-Host "Testing final Git status..." -ForegroundColor Cyan
git status
