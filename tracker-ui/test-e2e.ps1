# E2E Test Script for PowerShell
# Run this to test the application end-to-end

Write-Host "Building application..." -ForegroundColor Green
pnpm run build

Write-Host "Starting preview server..." -ForegroundColor Green
$previewJob = Start-Job -ScriptBlock { npx vite preview --port 5173 }

Write-Host "Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep 8

Write-Host "Running Playwright tests..." -ForegroundColor Green
npx playwright test

Write-Host "Stopping preview server..." -ForegroundColor Yellow
Stop-Job $previewJob
Remove-Job $previewJob

Write-Host "E2E tests completed!" -ForegroundColor Green
