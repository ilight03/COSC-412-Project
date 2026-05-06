@echo off
REM Student Assistant - Minimal Launcher
REM Starts Ollama, launches the backend via the bundled Maven wrapper, and opens login.html

setlocal enabledelayedexpansion

color 0A
title Student Assistant - Launch

echo.
echo Student Assistant - Launching components
echo.

REM Determine script directory
set "SCRIPT_DIR=%~dp0"

REM Read Ollama model from backend config (fallback to gemma4)
set "OLLAMA_MODEL=gemma4"
for %%F in ("%SCRIPT_DIR%backend\src\main\resources\application.properties" "%SCRIPT_DIR%backend\src\main\java\edu\widgetwizards\studentassistant\application.properties") do (
    if exist "%%~F" (
        for /f "usebackq tokens=2 delims==" %%A in (`findstr /B /C:"spring.ai.ollama.model=" "%%~F"`) do (
            if not "%%A"=="" set "OLLAMA_MODEL=%%A"
        )
    )
)

echo Using Ollama model: !OLLAMA_MODEL!

REM Pull the configured Ollama model (fast when cached)
echo Pulling model !OLLAMA_MODEL! (if not present)...
call ollama pull !OLLAMA_MODEL!

REM Start Ollama server in a new window
echo Starting Ollama server...
start "Ollama Server" cmd /k "ollama serve"

REM Use the bundled Maven wrapper to run backend
if exist "%SCRIPT_DIR%backend\mvnw.cmd" (
    set "MAVEN_CMD=%SCRIPT_DIR%backend\mvnw.cmd"
    echo Using Maven wrapper: !MAVEN_CMD!
) else (
    echo ERROR: Maven wrapper not found at %SCRIPT_DIR%backend\mvnw.cmd
    echo Please ensure the repository contains the Maven wrapper or install Maven and re-run.
    pause
    exit /b 1
)

REM Start backend with Spring Boot (run from backend working directory so pom.xml is found)
echo Starting backend (Spring Boot)...
start "Student Assistant Backend" /D "%SCRIPT_DIR%backend" cmd /k "mvnw.cmd spring-boot:run"

REM Open the login page in the default browser (frontend folder)
echo Opening login page...
start "Student Assistant UI" "%SCRIPT_DIR%frontend\login.html"

echo.
echo Launch sequence initiated. Wait a moment for services to become ready.
echo Frontend: %SCRIPT_DIR%frontend\login.html
echo Backend:  http://localhost:8080
echo Ollama:   http://localhost:11434
echo.
pause
