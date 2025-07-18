# Git Repository Cleanup Script
# Run this in PowerShell to fix desktop.ini issues

Write-Host "Starting Git repository cleanup..." -ForegroundColor Green

# Step 1: Reset any staged changes
Write-Host "1. Resetting staged changes..." -ForegroundColor Yellow
git reset HEAD

# Step 2: Remove all desktop.ini files from filesystem
Write-Host "2. Removing desktop.ini files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Name "desktop.ini" -Recurse -Force | ForEach-Object { 
    Remove-Item $_ -Force -ErrorAction SilentlyContinue
    Write-Host "   Removed: $_" -ForegroundColor Gray
}

# Step 3: Tell Git to ignore future desktop.ini files
Write-Host "3. Ensuring .gitignore includes desktop.ini..." -ForegroundColor Yellow
$gitignoreContent = @"
# Dependencies
node_modules/
.pnpm-store/
*.log

# Build outputs
dist/
build/
.parcel-cache/
.vite/

# Environment files
.env*

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
Thumbs.db
desktop.ini
Desktop.ini
`$RECYCLE.BIN/

# Cache
.cache/
.eslintcache

# Package manager
yarn.lock
package-lock.json
.pnpm-lock.yaml

# Test coverage
coverage/
.nyc-output/

# Playwright
test-results/
playwright-report/

# Archive and legacy files
archive*/
tracker-ui-good/
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8

# Step 4: Commit the .gitignore fix only
Write-Host "4. Committing .gitignore improvements..." -ForegroundColor Yellow
git add .gitignore
git commit -m "Fix .gitignore to prevent desktop.ini issues on Windows"

# Step 5: Clean up the working directory without staging everything
Write-Host "5. Cleaning working directory..." -ForegroundColor Yellow
git clean -fd -e node_modules -e .vscode -e .env*

Write-Host "✅ Git cleanup complete!" -ForegroundColor Green
Write-Host "Your repository is now clean and protected from Windows desktop.ini files." -ForegroundColor Green
