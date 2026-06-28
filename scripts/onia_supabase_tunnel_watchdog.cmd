@echo off
setlocal

set "LOG_DIR=%LOCALAPPDATA%\ONIA\onia-center"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

node "%~dp0onia_center_local_stack.js" --tunnel-only --watch >> "%LOG_DIR%\onia-tunnel-watchdog.out.log" 2>> "%LOG_DIR%\onia-tunnel-watchdog.err.log"
