param(
    [string]$OutputPath = (Join-Path $PSScriptRoot '..\fixtures\oceany-devnet-test.png')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$destination = [System.IO.Path]::GetFullPath($OutputPath)
[System.IO.Directory]::CreateDirectory([System.IO.Path]::GetDirectoryName($destination)) | Out-Null

$canvas = [System.Drawing.Bitmap]::new(1024, 1024)
$graphics = [System.Drawing.Graphics]::FromImage($canvas)
$background = $null
$wavePen = $null
$borderPen = $null
$white = $null
$cyan = $null
$muted = $null
$brandFont = $null
$headlineFont = $null
$footerFont = $null
$center = $null

try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $background = [System.Drawing.Drawing2D.LinearGradientBrush]::new(
        [System.Drawing.Rectangle]::new(0, 0, 1024, 1024),
        [System.Drawing.Color]::FromArgb(8, 28, 51),
        [System.Drawing.Color]::FromArgb(9, 77, 103),
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical
    )
    $graphics.FillRectangle($background, 0, 0, 1024, 1024)

    $wavePen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(105, 58, 210, 228), 12)
    $borderPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(140, 82, 203, 219), 6)
    $graphics.DrawEllipse($wavePen, -110, 610, 840, 310)
    $graphics.DrawEllipse($wavePen, 260, 690, 880, 320)
    $graphics.DrawRectangle($borderPen, 42, 42, 940, 940)

    $white = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::White)
    $cyan = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(117, 235, 241))
    $muted = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(210, 225, 236))
    $brandFont = [System.Drawing.Font]::new('Segoe UI', 76, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $headlineFont = [System.Drawing.Font]::new('Segoe UI', 56, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $footerFont = [System.Drawing.Font]::new('Segoe UI', 29, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $center = [System.Drawing.StringFormat]::new()
    $center.Alignment = [System.Drawing.StringAlignment]::Center
    $center.LineAlignment = [System.Drawing.StringAlignment]::Center

    $graphics.DrawString('OCEANY', $brandFont, $white, [System.Drawing.RectangleF]::new(70, 230, 884, 110), $center)
    $graphics.DrawString('DEVNET TEST', $headlineFont, $cyan, [System.Drawing.RectangleF]::new(70, 370, 884, 90), $center)
    $graphics.DrawString('NOT FOR SALE', $headlineFont, $white, [System.Drawing.RectangleF]::new(70, 475, 884, 90), $center)
    $graphics.DrawString('Synthetic QA fixture | No beta benefit', $footerFont, $muted, [System.Drawing.RectangleF]::new(70, 825, 884, 72), $center)

    $canvas.Save($destination, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Output "Created $destination"
}
finally {
    foreach ($resource in @($center, $footerFont, $headlineFont, $brandFont, $muted, $cyan, $white, $borderPen, $wavePen, $background, $graphics, $canvas)) {
        if ($null -ne $resource) { $resource.Dispose() }
    }
}
