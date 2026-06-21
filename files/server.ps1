$port = 8000
$folder = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host ""
Write-Host "SERVER STARTED" -ForegroundColor Green
Write-Host ""
Write-Host "Visit: http://localhost:$port" -ForegroundColor Yellow
Write-Host "Serving: $folder" -ForegroundColor White
Write-Host ""
Write-Host "Music will play when you visit!" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

$httpListener = New-Object System.Net.HttpListener
$httpListener.Prefixes.Add("http://localhost:$port/")
$httpListener.Start()

try {
    while ($httpListener.IsListening) {
        $context = $httpListener.GetContext()
        $request = $context.Request
        $response = $context.Response
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") { $urlPath = "/index.html" }
        $filePath = Join-Path $folder $urlPath.TrimStart("/").Replace("/", "\")
        if (Test-Path $filePath -PathType Leaf) {
            $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentLength64 = $fileBytes.Length
            $response.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
            Write-Host "Served: $urlPath" -ForegroundColor Green
        } else {
            $response.StatusCode = 404
        }
        $response.Close()
    }
}
catch { Write-Host "Error: $_" -ForegroundColor Red }
finally {
    $httpListener.Close()
    Write-Host "Server stopped." -ForegroundColor Yellow
}
