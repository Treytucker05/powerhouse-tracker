Write-Host "Cleaning up all broken desktop.ini Git references..." -ForegroundColor Yellow

# Remove broken reference files directly
$brokenRefs = @(
    ".git\refs\desktop.ini",
    ".git\refs\heads\backup\desktop.ini",
    ".git\refs\heads\chore\desktop.ini", 
    ".git\refs\heads\codex\desktop.ini",
    ".git\refs\heads\desktop.ini",
    ".git\refs\heads\feat\desktop.ini",
    ".git\refs\heads\feature\desktop.ini",
    ".git\refs\heads\fix\desktop.ini",
    ".git\refs\heads\test\desktop.ini",
    ".git\refs\remotes\desktop.ini",
    ".git\refs\remotes\origin\1fpeg3-codex\desktop.ini",
    ".git\refs\remotes\origin\chore\desktop.ini",
    ".git\refs\remotes\origin\codex\desktop.ini",
    ".git\refs\remotes\origin\copilot\desktop.ini",
    ".git\refs\remotes\origin\desktop.ini",
    ".git\refs\remotes\origin\feat\desktop.ini",
    ".git\refs\remotes\origin\feature\desktop.ini",
    ".git\refs\remotes\origin\fix\desktop.ini",
    ".git\refs\tags\desktop.ini"
)

$cleaned = 0

foreach ($ref in $brokenRefs) {
    if (Test-Path $ref) {
        try {
            Remove-Item $ref -Force
            Write-Host "Removed: $ref" -ForegroundColor Green
            $cleaned++
        } catch {
            Write-Host "Failed to remove: $ref" -ForegroundColor Red
        }
    }
}

Write-Host "Running Git garbage collection..." -ForegroundColor Yellow
git gc --prune=now

Write-Host "Git reference cleanup complete! Cleaned $cleaned references" -ForegroundColor Green

Write-Host "Testing Git status..." -ForegroundColor Yellow
git status
