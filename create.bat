@echo off
setlocal ENABLEDELAYEDEXPANSION
cd /d "%~dp0"

set COUNT=
if "%~1"=="" (
  set /p COUNT=Quantas instancias deseja abrir? 
) else (
  set COUNT=%~1
)
if not defined COUNT set COUNT=1

for /l %%I in (1,1,%COUNT%) do (
  start "Camoufox-%%I" /min cmd /c node "%~dp0index.mjs"
)

exit
