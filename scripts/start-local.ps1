param([switch]$NoBrowser)
$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectPath
function Test-OurSite {
  try {
    $result = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000' -TimeoutSec 3
    return $result.Content.Contains('Zdrowie Bez')
  } catch { return $false }
}
if (Test-OurSite) {
  Write-Host 'Strona dziala: http://localhost:3000'
  if (-not $NoBrowser) { Start-Process 'http://localhost:3000' }
  exit 0
}
$nodeCommand = Get-Command node.exe -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) { $nodeCommand.Source } else { 'C:\Program Files\WindowsApps\OpenAI.CodexPrimaryRuntime.v26-1112-737-0_26.1112.737.0_x64__3k8sg7r9htsxt\dependencies\node\bin\node.exe' }
if (-not (Test-Path -LiteralPath $nodePath)) { throw 'Zainstaluj Node.js LTS z https://nodejs.org i uruchom ponownie.' }
$nextPath = Join-Path $projectPath 'node_modules\next\dist\bin\next'
if (-not (Test-Path -LiteralPath $nextPath)) { throw 'Brak zaleznosci. W folderze projektu uruchom npm ci.' }
$env:NEXT_TELEMETRY_DISABLED = '1'
$env:Path = (Split-Path -Parent $nodePath) + ';' + $env:Path
if (-not (Test-Path -LiteralPath (Join-Path $projectPath '.env.local'))) {
  $random = [Security.Cryptography.RandomNumberGenerator]::Create()
  $passwordBytes = New-Object byte[] 32
  $secretBytes = New-Object byte[] 48
  $random.GetBytes($passwordBytes)
  $random.GetBytes($secretBytes)
  $random.Dispose()
  $newPassword = [Convert]::ToBase64String($passwordBytes)
  $newSecret = [Convert]::ToBase64String($secretBytes)
  $envText = "NEXT_PUBLIC_SITE_URL=http://localhost:3000`nADMIN_PASSWORD=$newPassword`nSESSION_SECRET=$newSecret`n"
  [IO.File]::WriteAllText((Join-Path $projectPath '.env.local'), $envText)
  [IO.File]::WriteAllText((Join-Path $projectPath 'DOSTEP-DO-PANELU.txt'), "Panel: http://localhost:3000/admin`nHaslo: $newPassword`nNie udostepniaj tego pliku.`n")
}
New-Item -ItemType Directory -Path (Join-Path $projectPath 'data') -Force | Out-Null
$runMode = if (Test-Path -LiteralPath (Join-Path $projectPath '.next\BUILD_ID')) { 'start' } else { 'dev' }
$serverArgs = '"' + $nextPath + '" ' + $runMode + ' --hostname 127.0.0.1 --port 3000'
$server = Start-Process -FilePath $nodePath -ArgumentList $serverArgs -WorkingDirectory $projectPath -WindowStyle Hidden -RedirectStandardOutput (Join-Path $projectPath 'data\server.log') -RedirectStandardError (Join-Path $projectPath 'data\server-error.log') -PassThru
[IO.File]::WriteAllText((Join-Path $projectPath 'server.pid'), [string]$server.Id)
$deadline = (Get-Date).AddSeconds(55)
do {
  if ($server.HasExited) { throw 'Serwer zatrzymal sie. Sprawdz data\server-error.log (port 3000 moze byc zajety).' }
  if (Test-OurSite) { Write-Host 'Strona dziala: http://localhost:3000'; if (-not $NoBrowser) { Start-Process 'http://localhost:3000' }; exit 0 }
  Start-Sleep -Milliseconds 500
} while ((Get-Date) -lt $deadline)
throw 'Nie uzyskano odpowiedzi serwera. Sprawdz data\server-error.log.'
