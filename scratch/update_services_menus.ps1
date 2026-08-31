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

$servicesMap = @{
    "service.html" = "Our Services"
    "service-iso-tank.html" = "ISO Tank Operator"
    "service-nvocc.html" = "NVOCC"
    "service-agency.html" = "Agency Representation"
    "service-freight-forwarding.html" = "Freight Forwarding"
    "service-supply-chain.html" = "Supply Chain Services"
    "service-project-cargo.html" = "Project Cargo"
}

foreach ($fileName in $targetFiles) {
    $filePath = Join-Path $root $fileName
    if (-not (Test-Path $filePath)) { continue }
    $content = Get-Content $filePath -Raw

    # Build submenu
    $submenuLines = @(
        '                                                    <ul class="submenu">',
        '                                                        <li><a href="service.html">Our Services</a></li>',
        $('                                                        <li' + ($(if ($fileName -eq 'service-iso-tank.html') {' class="active"'} else {''})) + '><a href="service-iso-tank.html">ISO Tank Operator</a></li>'),
        $('                                                        <li' + ($(if ($fileName -eq 'service-nvocc.html') {' class="active"'} else {''})) + '><a href="service-nvocc.html">NVOCC</a></li>'),
        $('                                                        <li' + ($(if ($fileName -eq 'service-agency.html') {' class="active"'} else {''})) + '><a href="service-agency.html">Agency Representation</a></li>'),
        $('                                                        <li' + ($(if ($fileName -eq 'service-freight-forwarding.html') {' class="active"'} else {''})) + '><a href="service-freight-forwarding.html">Freight Forwarding</a></li>'),
        $('                                                        <li' + ($(if ($fileName -eq 'service-supply-chain.html') {' class="active"'} else {''})) + '><a href="service-supply-chain.html">Supply Chain Services</a></li>'),
        $('                                                        <li' + ($(if ($fileName -eq 'service-project-cargo.html') {' class="active"'} else {''})) + '><a href="service-project-cargo.html">Project Cargo</a></li>'),
        '                                                    </ul>'
    ) -join "`r`n"

    $content = [System.Text.RegularExpressions.Regex]::Replace(
        $content,
        '(?s)<ul class="submenu">.*?</ul>',
        $submenuLines
    )

    # If it is a service details page with sidebar:
    if ($fileName -like "service-*.html") {
        $sidebarLines = @(
            '<div class="title">Our Core Services</div>',
            '                                                <ul>',
            $('                                                    <li' + ($(if ($fileName -eq 'service-iso-tank.html') {' class="active"'} else {''})) + '><a href="service-iso-tank.html">ISO Tank Operator</a></li>'),
            $('                                                    <li' + ($(if ($fileName -eq 'service-nvocc.html') {' class="active"'} else {''})) + '><a href="service-nvocc.html">NVOCC</a></li>'),
            $('                                                    <li' + ($(if ($fileName -eq 'service-agency.html') {' class="active"'} else {''})) + '><a href="service-agency.html">Agency Representation</a></li>'),
            $('                                                    <li' + ($(if ($fileName -eq 'service-freight-forwarding.html') {' class="active"'} else {''})) + '><a href="service-freight-forwarding.html">Freight Forwarding</a></li>'),
            $('                                                    <li' + ($(if ($fileName -eq 'service-supply-chain.html') {' class="active"'} else {''})) + '><a href="service-supply-chain.html">Supply Chain Services</a></li>'),
            $('                                                    <li' + ($(if ($fileName -eq 'service-project-cargo.html') {' class="active"'} else {''})) + '><a href="service-project-cargo.html">Project Cargo</a></li>'),
            '                                                </ul>'
        ) -join "`r`n"

        $content = [System.Text.RegularExpressions.Regex]::Replace(
            $content,
            '(?s)<div class="title">Our Core Services</div>\s*<ul>.*?</ul>',
            $sidebarLines
        )
    }

    # Footer services widget
    $footerServicesLines = @(
        '<div class="widget-title">Services</div>',
        '                                            <ul class="list-area">',
        '                                                <li><a href="service-iso-tank.html"><i class="fa-solid fa-chevrons-right"></i> ISO Tank Operator</a></li>',
        '                                                <li><a href="service-nvocc.html"><i class="fa-solid fa-chevrons-right"></i> NVOCC</a></li>',
        '                                                <li><a href="service-agency.html"><i class="fa-solid fa-chevrons-right"></i> Agency Representation</a></li>',
        '                                                <li><a href="service-freight-forwarding.html"><i class="fa-solid fa-chevrons-right"></i> Freight Forwarding</a></li>',
        '                                                <li><a href="service-supply-chain.html"><i class="fa-solid fa-chevrons-right"></i> Supply Chain Services</a></li>',
        '                                                <li><a href="service-project-cargo.html"><i class="fa-solid fa-chevrons-right"></i> Project Cargo</a></li>',
        '                                            </ul>'
    ) -join "`r`n"

    $content = [System.Text.RegularExpressions.Regex]::Replace(
        $content,
        '(?s)<div class="widget-title">\s*Services\s*</div>\s*<ul class="list-area">.*?</ul>',
        $footerServicesLines
    )

    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "Updated menus and footer services in $fileName"
}
