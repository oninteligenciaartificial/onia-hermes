@echo off
chcp 65001 >nul
title Grabador de pantalla - ONIA
setlocal

set "FF=C:\Users\tukom\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.2-full_build\bin\ffmpeg.exe"
set "DEST=%~dp0"

REM Region exacta de la ventana de Claude una vez acomodada por el .ps1
set "X=208"
set "Y=28"
set "TAM=1304x992"

if not exist "%FF%" (
  echo.
  echo No encuentro ffmpeg. Avisale a Claude.
  echo.
  pause
  exit /b 1
)

echo.
echo ==========================================
echo    GRABADOR - ventana de Claude
echo ==========================================
echo.

REM --- PRIMERO los datos, con esta ventana al frente ---
set "NOMBRE="
set /p "NOMBRE=Nombre del clip [clip1, clip2, clip3]: "
if "%NOMBRE%"=="" set "NOMBRE=clip"

set "SEG="
set /p "SEG=Cuantos segundos grabar [ej 20]: "
if "%SEG%"=="" set "SEG=20"

echo.
echo Presiona una tecla cuando estes listo.
echo Al presionar, Claude pasa al frente y arranca la cuenta regresiva.
pause >nul

REM --- RECIEN AHORA se acomoda Claude y pasa al frente ---
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0_acomodar-ventana.ps1" >nul 2>&1

echo.
echo Empieza en 5...
timeout /t 1 /nobreak >nul
echo             4...
timeout /t 1 /nobreak >nul
echo             3...
timeout /t 1 /nobreak >nul
echo             2...
timeout /t 1 /nobreak >nul
echo             1...
timeout /t 1 /nobreak >nul

"%FF%" -y -hide_banner -loglevel error -f gdigrab -framerate 30 -offset_x %X% -offset_y %Y% -video_size %TAM% -t %SEG% -i desktop -c:v libx264 -preset ultrafast -crf 18 -pix_fmt yuv420p "%DEST%%NOMBRE%.mp4"

echo.
if exist "%DEST%%NOMBRE%.mp4" (
  echo ==========================================
  echo   LISTO - guardado como %NOMBRE%.mp4
  echo ==========================================
) else (
  echo FALLO - no se genero el archivo. Avisale a Claude.
)
echo.
pause
