# PowerHouse Tracker – repo audit (PowerShell version)
# This is a Windows-compatible version of the repo audit script

Write-Host "[AUDIT] PowerHouse Tracker Repo Analysis" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Repository Overview
Write-Host "`n[INFO] Repository Overview:" -ForegroundColor Yellow
$totalFiles = (Get-ChildItem -Recurse -File | Where-Object { $_.Name -notlike ".*" }).Count
$jsFiles = (Get-ChildItem -Recurse -File -Include "*.js", "*.jsx").Count
$reactComponents = (Get-ChildItem -Recurse -File -Include "*.jsx").Count
$cssFiles = (Get-ChildItem -Recurse -File -Include "*.css").Count

Write-Host "- Total Files: $totalFiles"
Write-Host "- JavaScript Files: $jsFiles"  
Write-Host "- React Components: $reactComponents"
Write-Host "- CSS Files: $cssFiles"

# Calculate total lines of code
$codeFiles = Get-ChildItem -Recurse -File -Include "*.js", "*.jsx", "*.css"
$totalLines = ($codeFiles | Get-Content | Measure-Object -Line).Lines
Write-Host "- Total Lines of Code: $totalLines"

# Branch Status (if git is available)
Write-Host "`n[GIT] Branch Status:" -ForegroundColor Yellow
try {
    $branches = git branch -a 2>$null
    if ($branches) {
        $branches | ForEach-Object { Write-Host $_ }
        $currentBranch = git branch --show-current 2>$null
        Write-Host "Current Branch: $currentBranch"
    } else {
        Write-Host "Git not available or not a git repository"
    }
} catch {
    Write-Host "Git not available or not a git repository"
}

# Project Structure
Write-Host "`n[STRUCTURE] Project Structure:" -ForegroundColor Yellow
try {
    tree /F | Select-Object -First 50
} catch {
    Write-Host "Directory structure:"
    Get-ChildItem -Directory | Select-Object -First 20 | ForEach-Object { Write-Host "  $($_.Name)/" }
}

# Dependencies
Write-Host "`n[DEPS] Dependencies:" -ForegroundColor Yellow
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.dependencies) {
        Write-Host "Dependencies:"
        $packageJson.dependencies.PSObject.Properties | ForEach-Object {
            if ($_.Name -match "react|zustand|vite") {
                Write-Host "  $($_.Name): $($_.Value)"
            }
        }
    }
    if ($packageJson.devDependencies) {
        Write-Host "Dev Dependencies:"
        $packageJson.devDependencies.PSObject.Properties | ForEach-Object {
            if ($_.Name -match "react|zustand|vite") {
                Write-Host "  $($_.Name): $($_.Value)"
            }
        }
    }
}

# TODO/FIXME tally
Write-Host "`n[ISSUES] TODO/FIXME Comments:" -ForegroundColor Yellow
$todoCount = 0
$searchFiles = Get-ChildItem -Recurse -File -Include "*.js", "*.jsx", "*.ts", "*.tsx"
foreach ($file in $searchFiles) {
    $content = Get-Content $file.FullName -ErrorAction SilentlyContinue
    if ($content) {
        $todoCount += ($content | Select-String -Pattern "TODO|FIXME|HACK|XXX" -AllMatches).Count
    }
}
Write-Host "Total TODO/FIXME comments found: $todoCount"

Write-Host "`n[SUCCESS] Repo audit completed successfully!" -ForegroundColor Green
