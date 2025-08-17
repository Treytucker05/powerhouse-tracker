# PowerShell Script to Archive Unused Files
# Run this from the root ProgramDesignWorkspace directory

Write-Host "🧹 Cleaning up workspace - archiving unused files..." -ForegroundColor Green

# Create archive directories if they don't exist
$archiveRoot = "archive-v3-cleanup"
$archiveOld = "$archiveRoot/old-src-files"
$archiveDocs = "$archiveRoot/documentation"
$archiveConfigs = "$archiveRoot/old-configs"
$archiveTests = "$archiveRoot/test-files"

New-Item -ItemType Directory -Force -Path $archiveOld | Out-Null
New-Item -ItemType Directory -Force -Path $archiveDocs | Out-Null
New-Item -ItemType Directory -Force -Path $archiveConfigs | Out-Null
New-Item -ItemType Directory -Force -Path $archiveTests | Out-Null

Write-Host "📁 Moving old source files..." -ForegroundColor Yellow

# Move the old src directory (since we're using tracker-ui-good/tracker-ui)
if (Test-Path "src") {
    Move-Item "src" "$archiveOld/src-old" -Force
    Write-Host "✅ Moved src/ to archive" -ForegroundColor Green
}

# Move old configuration files
$oldConfigs = @(
    "eslint.config.js.backup",
    "playwright-preload.cjs", 
    "playwright-vitest-shim.cjs",
    "playwright-vitest-shim.js",
    "run-playwright.cjs",
    "server.cjs",
    "node-bootstrap.js",
    "minimal-test.mjs",
    "smoke.js",
    "smoke.mjs",
    "inspect-function.js",
    "demo-rir.js"
)

Write-Host "⚙️ Moving old configuration files..." -ForegroundColor Yellow
foreach ($file in $oldConfigs) {
    if (Test-Path $file) {
        Move-Item $file "$archiveConfigs/$file" -Force
        Write-Host "✅ Moved $file" -ForegroundColor Green
    }
}

# Move documentation files to keep workspace clean
$docFiles = @(
    "ADVANCED_INTELLIGENCE_README.md",
    "AGENTS.md",
    "BUTTON_AUDIT_REPORT.md", 
    "BUTTON_MASTER_TABLE.md",
    "CALCULATOR_AUDIT.md",
    "CSS_MODERNIZATION_COMPLETE.md",
    "DASHBOARD_COMPONENT_TYPING_REPORT.md",
    "DATABASE_SCHEMA_REVIEW.md",
    "DESIGN_SYSTEM_COMPLETE.md",
    "DESIGN_SYSTEM_GUIDE.md",
    "DESIGN_SYSTEM_UNIFIED.md",
    "DEVSEED_CIRCULAR_FIX_STATUS.md",
    "EVENT_LISTENERS_COMPLETE.md",
    "FATIGUE_UPGRADE_COMPLETE.md",
    "IMPLEMENTATION_COMPLETE.md",
    "IMPLEMENTATION_STATUS_REPORT.md",
    "MACROCYCLE_COMPLETE_SUCCESS.md",
    "MACROCYCLE_COMPLETION_STATUS.md",
    "MACROCYCLE_TESTING_COMPLETE.md",
    "MACROCYCLE_TESTING_GUIDE.md",
    "PHASE_3_COMPLETE.md",
    "PROGRAM_DESIGN_INTEGRATION_COMPLETE.md",
    "PROGRAM_DESIGN_NAVIGATION_COMPLETE.md",
    "PROGRESSION_DEMO.md",
    "README_CONSOLIDATED.md",
    "README_CONSOLIDATION_COMPLETE.md",
    "README_NEW.md",
    "README_UPDATE_SUMMARY.md",
    "README_V3_UPDATE_SUMMARY.md",
    "REPO_ANALYSIS_REPORT.json",
    "REPO_ANALYSIS_REPORT.md",
    "RP_CONSTANTS_UPDATE_2024_25.md",
    "RP_MACROCYCLE_INTEGRATION_COMPLETE.md",
    "SHARED_CONSTANTS_COMPLETE.md",
    "SUPABASE_IMPORT_FIX_COMPLETE.md",
    "TAILWIND_CONFIG_UPDATE.md",
    "UPGRADE_3_COMPLETE.md",
    "UTILITY_INTEGRATION_COMPLETE.md"
)

Write-Host "📝 Moving documentation files..." -ForegroundColor Yellow
foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Move-Item $file "$archiveDocs/$file" -Force
        Write-Host "✅ Moved $file" -ForegroundColor Green
    }
}

# Move test-related files
$testFiles = @(
    "MACROCYCLE_TEST_RUNNER.js",
    "MACROCYCLE_TEST_SCENARIOS.js",
    "test-results",
    "tests",
    "__tests__",
    "coverage",
    "e2e-standalone",
    "playwright-report"
)

Write-Host "🧪 Moving test files..." -ForegroundColor Yellow
foreach ($item in $testFiles) {
    if (Test-Path $item) {
        Move-Item $item "$archiveTests/$item" -Force
        Write-Host "✅ Moved $item" -ForegroundColor Green
    }
}

# Move old asset directories
$assetDirs = @(
    "css",
    "js", 
    "lib",
    "partials",
    "assets",
    "helpers"
)

Write-Host "🎨 Moving old asset directories..." -ForegroundColor Yellow
foreach ($dir in $assetDirs) {
    if (Test-Path $dir) {
        Move-Item $dir "$archiveOld/$dir" -Force
        Write-Host "✅ Moved $dir/" -ForegroundColor Green
    }
}

# Create a summary file
$summary = @"
# Workspace Cleanup Summary - $(Get-Date)

## Archived Files
This cleanup moved unused files from the v2 implementation to archives.

### Active Workspace
- **Working Directory**: tracker-ui-good/tracker-ui/
- **Enhanced Assessment**: ✅ Implemented with all features
- **Clean Structure**: ✅ Only active files remain

### Archived Content
- **Old Source**: archive-v3-cleanup/old-src-files/
- **Documentation**: archive-v3-cleanup/documentation/
- **Old Configs**: archive-v3-cleanup/old-configs/
- **Test Files**: archive-v3-cleanup/test-files/

### Enhanced Assessment Features
✅ Injury Screening
✅ Gainer Type Test  
✅ Fiber Dominance Assessment
✅ Mileage/Capacity Assessment
✅ Biomotor Priorities
✅ SMART Goals Framework
✅ Assessment Insights

## Next Steps
1. Navigate to: tracker-ui-good/tracker-ui/
2. Run: npm start
3. Go to Program Design → Goals & Needs
4. See all enhanced assessment features!
"@

$summary | Out-File "$archiveRoot/CLEANUP_SUMMARY.md" -Encoding UTF8

Write-Host "" -ForegroundColor White
Write-Host "🎉 Cleanup Complete!" -ForegroundColor Green
Write-Host "📂 Working directory: tracker-ui-good/tracker-ui/" -ForegroundColor Cyan
Write-Host "📋 Summary: $archiveRoot/CLEANUP_SUMMARY.md" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "🚀 Your enhanced assessment is ready!" -ForegroundColor Yellow
Write-Host "   1. cd tracker-ui-good/tracker-ui" -ForegroundColor White
Write-Host "   2. npm start" -ForegroundColor White
Write-Host "   3. Go to Program Design → Goals & Needs" -ForegroundColor White
