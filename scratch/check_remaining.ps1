$root = "c:\Users\PETHERNA PRAVEEN\Desktop\oceanus-website-main\oceanus-website-main"
$htmlFiles = Get-ChildItem -Path $root -Filter *.html

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $hasWhiteFooterLogo = $content -match 'footer-logo[\s\S]*?logo-white\.png'
    $has550 = $content -match '550'
    $has56Ports = $content -match '56\s+ports|56\s*<'
    
    Write-Host "File: $($file.Name)"
    Write-Host "  White Footer Logo: $hasWhiteFooterLogo"
    Write-Host "  Has 550: $has550"
    Write-Host "  Has 56: $has56Ports"
}
