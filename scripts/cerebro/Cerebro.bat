@echo off
rem ONIA Cerebro - abre el tunel al VPS y el panel en el navegador.
rem Si la ventana minimizada del tunel se cierra sola, ya habia un tunel abierto: no pasa nada.
start "tunel-cerebro" /min ssh -i %USERPROFILE%\.ssh\onia_hermes_vps_ed25519 -N -L 9201:127.0.0.1:9201 root@187.77.16.63
timeout /t 3 /nobreak >nul
start http://127.0.0.1:9201
