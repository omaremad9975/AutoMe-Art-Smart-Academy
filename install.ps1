# Install dependencies (run this in the project folder)
# Usage: right-click → "Run with PowerShell" OR run in terminal

Write-Host "Installing Art Smart Academy Dashboard dependencies..." -ForegroundColor Cyan

# Try to find npm
$npmPath = Get-Command npm -ErrorAction SilentlyContinue
if ($npmPath) {
    npm install
    Write-Host "Done! Run 'npm run dev' to start." -ForegroundColor Green
} else {
    # Try common Node.js locations
    $candidates = @(
        "$env:ProgramFiles\nodejs\npm.cmd",
        "$env:ProgramFiles(x86)\nodejs\npm.cmd",
        "$env:LOCALAPPDATA\Programs\nodejs\npm.cmd",
        "$env:APPDATA\npm\npm.cmd"
    )
    $found = $candidates | Where-Object { Test-Path $_ } | Select-Object -First 1
    if ($found) {
        & $found install
        Write-Host "Done! Run 'npm run dev' to start." -ForegroundColor Green
    } else {
        Write-Host "npm not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
        Write-Host "Then run: npm install && npm run dev" -ForegroundColor Yellow
    }
}
