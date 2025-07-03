# Macrocycle Files Cleanup Script (PowerShell)
# This script archives or deletes old/legacy macrocycle files
# Run this after confirming the unified Macrocycle.jsx is working

Write-Host "🧹 Macrocycle Files Cleanup Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Define base directories (relative to workspace root)
$TRACKER_UI_GOOD = "tracker-ui-good\tracker-ui\src\pages"
$TRACKER_UI = "tracker-ui\src\pages"
$TRACKER_UI_CLEAN = "tracker-ui-clean\src\pages"

# Define legacy files to clean up
$LEGACY_FILES = @(
    "$TRACKER_UI_GOOD\Macrocycle7.1.25.fixed.jsx",
    "$TRACKER_UI_GOOD\Macrocycle7.1.25.jsx",
    "$TRACKER_UI\Macrocycle.jsx",
    "$TRACKER_UI\MacrocycleEnhanced.jsx",
    "$TRACKER_UI_CLEAN\Macrocycle.jsx",
    "$TRACKER_UI_CLEAN\MacrocycleBuilder.jsx"
)

# Create archive directory
$ARCHIVE_DIR = "archive\macrocycle-legacy-$(Get-Date -Format 'yyyyMMdd')"
New-Item -ItemType Directory -Force -Path $ARCHIVE_DIR | Out-Null

Write-Host "📁 Created archive directory: $ARCHIVE_DIR" -ForegroundColor Green
Write-Host ""

# Function to safely archive a file
function Move-FileToArchive {
    param($FilePath)
    
    if (Test-Path $FilePath) {
        Write-Host "📦 Archiving: $FilePath" -ForegroundColor Yellow
        $FileName = Split-Path $FilePath -Leaf
        Copy-Item $FilePath "$ARCHIVE_DIR\$FileName"
        Remove-Item $FilePath
        Write-Host "✅ Archived and removed: $FilePath" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  File not found: $FilePath" -ForegroundColor Red
    }
}

# Archive legacy files
Write-Host "🗂️  Archiving legacy macrocycle files..." -ForegroundColor Cyan
Write-Host "----------------------------------------" -ForegroundColor Cyan

foreach ($file in $LEGACY_FILES) {
    Move-FileToArchive -FilePath $file
}

Write-Host ""
Write-Host "🎯 Cleanup Summary:" -ForegroundColor Cyan
Write-Host "- Legacy files archived to: $ARCHIVE_DIR" -ForegroundColor White
Write-Host "- Active file: tracker-ui-good\tracker-ui\src\pages\Macrocycle.jsx" -ForegroundColor White
Write-Host "- Routing updated in App.jsx to use unified Macrocycle component" -ForegroundColor White
Write-Host ""
Write-Host "✅ Cleanup complete! Only the unified Macrocycle.jsx should remain active." -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "1. Test the macrocycle builder in the browser" -ForegroundColor White
Write-Host "2. Verify all features work correctly" -ForegroundColor White
Write-Host "3. If everything works, you can safely delete the archive folder" -ForegroundColor White
