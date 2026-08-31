$root = "c:\Users\PETHERNA PRAVEEN\Desktop\oceanus-website-main\oceanus-website-main"

$targetFiles = @(
    "service-nvocc.html",
    "service-agency.html",
    "service-freight-forwarding.html",
    "service-supply-chain.html",
    "service-project-cargo.html",
    "contact.html",
    "quote.html",
    "privacy-policy.html",
    "terms.html",
    "404.html"
)

foreach ($fileName in $targetFiles) {
    $filePath = Join-Path $root $fileName
    if (-not (Test-Path $filePath)) { continue }
    $content = Get-Content $filePath -Raw

    # 1. Update footer background class
    $content = $content -replace '<footer class="footer-section fix">', '<footer class="footer-section section-bg fix">'
    $content = $content -replace '<div class="footer-top-wrapper style-top-inner">', '<div class="footer-top-wrapper style-2">'
    $content = $content -replace '<span>Need Our Services\?</span>', 'Let’s Build Something Great Together.'
    
    # 2. Update footer logo to full-color logo.png
    $content = $content -replace '(?s)(<div class="footer-form">\s*<a href="index\.html" class="footer-logo">\s*<img src=")assets/img/logo/logo-white\.png(")', '$1assets/img/logo/logo.png$2'

    # 3. Update 56 ports mentions in service pages
    $content = $content -replace '56 ports', '80+ ports'

    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "Updated basic footer elements in $fileName"
}
