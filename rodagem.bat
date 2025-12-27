@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

set "COUNT="
if "%~1"=="" (
  set /p COUNT=Quantas instancias deseja abrir? 
) else (
  set "COUNT=%~1"
)
if not defined COUNT set "COUNT=1"

rem Solicitar ou receber link de convite
set "INVITE="
if "%~2"=="" (
  set /p INVITE=Informe o link de convite (ex: https://lovable.dev/invite/XXXXXX): 
) else (
  set "INVITE=%~2"
)

rem Validação simples do link
echo %INVITE% | findstr /I /C:"/invite/" >nul
if errorlevel 1 (
  echo Link de convite invalido. Deve conter "/invite/".
  exit /b 1
)

rem Atualizar invite.json com o link informado
set "ROOT=%~dp0"
powershell -NoProfile -Command ^
  "$path = Join-Path $env:ROOT 'invite.json';" ^
  "$obj = @{ '01' = @('%INVITE%') };" ^
  "$json = $obj | ConvertTo-Json;" ^
  "Set-Content -Path $path -Value $json -Encoding UTF8"

for /l %%I in (1,1,%COUNT%) do (
  start "OUTD-%%I" cmd /c node "%~dp0finish-him.mjs"
)

exit
