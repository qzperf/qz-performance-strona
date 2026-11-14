$ErrorActionPreference = 'Stop'
$projectPath = Split-Path -Parent $PSScriptRoot
$pidFile = Join-Path $projectPath 'server.pid'
if (-not (Test-Path -LiteralPath $pidFile)) { Write-Host 'Brak serwera uruchomionego skryptem tej aplikacji.'; exit 0 }
$serverProcessId = [int](Get-Content -LiteralPath $pidFile)
$serverProcess = Get-CimInstance Win32_Process -Filter ('ProcessId = ' + $serverProcessId) -ErrorAction SilentlyContinue
if ($serverProcess -and $serverProcess.CommandLine.IndexOf($projectPath, [StringComparison]::OrdinalIgnoreCase) -ge 0) {
  $childProcesses = Get-CimInstance Win32_Process -Filter ('ParentProcessId = ' + $serverProcessId) -ErrorAction SilentlyContinue
  foreach ($child in $childProcesses) { Stop-Process -Id $child.ProcessId -ErrorAction SilentlyContinue }
  Stop-Process -Id $serverProcessId -ErrorAction SilentlyContinue
  Write-Host 'Serwer aplikacji zatrzymany.'
} else { Write-Host 'Serwer juz nie dziala albo identyfikator nalezy do innego procesu. Nie zatrzymano innej aplikacji.' }
Remove-Item -LiteralPath $pidFile -ErrorAction SilentlyContinue
