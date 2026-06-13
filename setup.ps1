# Art Smart Academy — Setup Script
# Run this in PowerShell or Command Prompt from the project root

Write-Host "🎨 Art Smart Academy — Installing dependencies..." -ForegroundColor Cyan

npm install

Write-Host "✅ Dependencies installed!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 IMPORTANT: Copy your logo files to the public/ folder:" -ForegroundColor Yellow
Write-Host "   • public/logo_mark_blue.png" -ForegroundColor White
Write-Host "   • public/logo_mark_white.png" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Then run: npm run dev" -ForegroundColor Cyan
Write-Host "🌐 Open: http://localhost:3000" -ForegroundColor Cyan
