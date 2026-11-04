@echo off
title Estudos UNIVESP
cd /d "%~dp0"
powershell.exe -NoProfile -Command "try { $studyStatus = Invoke-RestMethod -Uri 'http://127.0.0.1:3000/api/study' -TimeoutSec 2; if ($studyStatus.version -eq 1 -and $null -ne $studyStatus.examDate) { exit 0 }; exit 1 } catch { exit 1 }"
if not errorlevel 1 (
  start "" "http://127.0.0.1:3000"
  exit /b 0
)
if not exist "node_modules\next\dist\bin\next" (
  echo Instale as dependencias com npm ci antes de iniciar.
  pause
  exit /b 1
)
echo Abra http://127.0.0.1:3000 no navegador quando aparecer Ready.
echo Mantenha esta janela aberta enquanto estuda.
node "node_modules\next\dist\bin\next" dev --hostname 127.0.0.1 --port 3000
pause
