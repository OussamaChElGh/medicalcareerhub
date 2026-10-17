$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $root '.dev-server.pid'
$outLog = Join-Path $root '.dev-server.out.log'
$errLog = Join-Path $root '.dev-server.err.log'
$cmdFile = Join-Path $PSScriptRoot 'dev-run.cmd'
$port = if ($env:PORT) { [int]$env:PORT } else { 3000 }
$healthUrl = "http://127.0.0.1:$port/api/premium/config"

if (-not $env:NODE_ENV) { $env:NODE_ENV = 'development' }

function Test-ArcanumHealth {
  try {
    $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Get-ListenerPid {
  $listener = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue |
    Select-Object -First 1
  if ($listener) { return [int]$listener.OwningProcess }
  return $null
}

function Wait-ForHealth([int]$seconds) {
  $deadline = (Get-Date).AddSeconds($seconds)
  while ((Get-Date) -lt $deadline) {
    if (Test-ArcanumHealth) { return $true }
    Start-Sleep -Milliseconds 350
  }
  return $false
}

$managedPid = $null
if (Test-Path $pidFile) {
  $raw = (Get-Content -LiteralPath $pidFile -Raw).Trim()
  if ($raw -match '^\d+$') { $managedPid = [int]$raw }
}

if ($managedPid) {
  $existing = Get-Process -Id $managedPid -ErrorAction SilentlyContinue
  if ($existing) {
    if (Wait-ForHealth 5) {
      Write-Output "Servidor ya en marcha (PID $managedPid)."
      exit 0
    }
    Write-Output "El PID $managedPid no responde; se reinicia."
    taskkill /PID $managedPid /T /F | Out-Null
    Start-Sleep -Milliseconds 500
  }
  Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
}

$listenerPid = Get-ListenerPid
if ($listenerPid) {
  if (Test-ArcanumHealth) {
    Set-Content -LiteralPath $pidFile -Value $listenerPid -NoNewline
    Write-Output "Servidor ya en marcha (PID $listenerPid)."
    exit 0
  }
  Write-Error "El puerto $port esta ocupado por el PID $listenerPid y no responde como Arcanum. Usa npm run dev:stop o libera el puerto."
  exit 1
}

if (-not (Test-Path $cmdFile)) {
  Write-Error "No se encontro scripts\dev-run.cmd."
  exit 1
}

foreach ($log in @($outLog, $errLog)) {
  if (Test-Path $log) { Remove-Item -LiteralPath $log -Force }
}

try {
  $process = Start-Process -FilePath $cmdFile `
    -WorkingDirectory $root `
    -WindowStyle Hidden `
    -PassThru
} catch {
  Write-Error "No se pudo lanzar el servidor: $($_.Exception.Message)"
  exit 1
}

Set-Content -LiteralPath $pidFile -Value $process.Id -NoNewline
Write-Output "Servidor lanzado (PID $($process.Id))."
Write-Output "Logs: $outLog / $errLog"

if (Wait-ForHealth 15) {
  Write-Output "Servidor listo en http://localhost:$port."
  exit 0
}

Write-Error 'El servidor no respondio a tiempo. Ultimas lineas del log:'
if (Test-Path $outLog) { Get-Content -LiteralPath $outLog -Tail 30 }
if (Test-Path $errLog) { Get-Content -LiteralPath $errLog -Tail 30 }
if (Get-Process -Id $process.Id -ErrorAction SilentlyContinue) {
  taskkill /PID $process.Id /T /F | Out-Null
}
Remove-Item -LiteralPath $pidFile -Force -ErrorAction SilentlyContinue
exit 1
