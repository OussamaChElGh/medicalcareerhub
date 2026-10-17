$ErrorActionPreference = 'Stop'

$stopScript = Join-Path $PSScriptRoot 'dev-server.mjs'
$startScript = Join-Path $PSScriptRoot 'dev-bg.ps1'

& node $stopScript stop
$stopCode = $LASTEXITCODE
if ($stopCode -ne 0) { exit $stopCode }

Start-Sleep -Milliseconds 700
& powershell -NoProfile -ExecutionPolicy Bypass -File $startScript
exit $LASTEXITCODE
