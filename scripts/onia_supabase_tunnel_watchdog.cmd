@echo off
setlocal

set "LOG_DIR=%LOCALAPPDATA%\ONIA\onia-center"
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

node "%~dp0onia_center_local_stack.js" --tunnel-only --watch >> "%LOG_DIR%\supabase-watchdog.out.log" 2>> "%LOG_DIR%\supabase-watchdog.err.log"
