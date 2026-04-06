$domain = "kikayabinkarubi.net"
$ip = "76.76.21.21"
$file = "C:\Windows\System32\drivers\etc\hosts"

# Check for Admin privileges
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Warning "Requesting Administrator privileges..."
    Start-Process powershell -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$($MyInvocation.MyCommand.Definition)`""
    exit
}

# Check if entry already exists to avoid duplicates
$content = Get-Content $file
if ($content -match "$ip $domain") {
    Write-Host "Entry already exists. You are good to go!" -ForegroundColor Green
} else {
    Add-Content -Path $file -Value "`n$ip $domain"
    Write-Host "Success! Added '$ip $domain' to hosts file." -ForegroundColor Green
    Write-Host "Your computer will now bypass global DNS and go straight to Vercel." -ForegroundColor Cyan
}

Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
