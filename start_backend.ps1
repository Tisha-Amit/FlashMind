# FlashMind – One-click launcher
# Run this file from ANY location by right-clicking → "Run with PowerShell"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "  ==============================" -ForegroundColor Cyan
Write-Host "    FlashMind Launcher" -ForegroundColor Cyan
Write-Host "  ==============================" -ForegroundColor Cyan
Write-Host ""

# --- Kill old processes on ports 5000 and 5173 ---
Write-Host "[1/3] Stopping any old Flask / Vite processes..." -ForegroundColor Yellow
$ports = @(5000, 5173)
foreach ($port in $ports) {
    $pids = netstat -ano | Select-String ":$port\s" | ForEach-Object {
        ($_ -split '\s+')[-1]
    } | Select-Object -Unique
    foreach ($p in $pids) {
        try { Stop-Process -Id $p -Force -ErrorAction SilentlyContinue } catch {}
    }
}
Start-Sleep -Seconds 1

# --- Start Flask backend ---
Write-Host "[2/3] Starting Flask backend on http://localhost:5000 ..." -ForegroundColor Yellow
$backendPath = Join-Path $root "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendPath'; python app.py" -WindowStyle Normal

Start-Sleep -Seconds 3

# --- Start Vite frontend ---
Write-Host "[3/3] Starting Vite frontend on http://localhost:5173 ..." -ForegroundColor Yellow
$frontendPath = Join-Path $root "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$frontendPath'; npm run dev" -WindowStyle Normal

Start-Sleep -Seconds 3

# --- Open browser ---
Write-Host ""
Write-Host "  Opening FlashMind in your browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "  FlashMind is running!" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Gray
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "  Close the two terminal windows to stop the servers." -ForegroundColor Gray
Write-Host ""
