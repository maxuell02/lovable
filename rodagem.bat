@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

rem 1. Solicitar obrigatoriamente o link de convite
set "INVITE="
if "%~1"=="" (
  set /p INVITE=Informe o link de convite (ex: https://lovable.dev/invite/XXXXXX): 
) else (
  set "INVITE=%~1"
)

rem Validação simples do link
echo %INVITE% | findstr /I /C:"/invite/" >nul
if errorlevel 1 (
  echo Link de convite invalido. Deve conter "/invite/".
  pause
  exit /b 1
)

rem 2. Definir o número de instâncias automaticamente como 1
set "COUNT=1"

rem 3. Atualizar o ficheiro invite.json com o link informado
set "ROOT=%~dp0"
powershell -NoProfile -Command ^
  "$path = Join-Path $env:ROOT 'invite.json';" ^
  "$obj = @{ '01' = @('%INVITE%') };" ^
  "$json = $obj | ConvertTo-Json;" ^
  "Set-Content -Path $path -Value $json -Encoding UTF8"

rem 4. Iniciar a execução
echo Iniciando sessao com o convite: %INVITE%
for /l %%I in (1,1,%COUNT%) do (
  start "OUTD-%%I" cmd /c node "%~dp0finish-him.mjs"
)

exit