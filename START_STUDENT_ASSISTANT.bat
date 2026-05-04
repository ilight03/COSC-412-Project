@echo off
REM Student Assistant - One-Click Setup and Launch (Auto-Installer)
REM This script automatically installs all dependencies and starts the application

setlocal enabledelayedexpansion

color 0A
title Student Assistant - Automated Setup Launch

echo.
echo ======================================
echo  Student Assistant Auto-Installer
echo ======================================
echo.
echo This will automatically install all
echo required dependencies and start the app.
echo.

set "JAVA_INSTALLED=0"
set "MAVEN_INSTALLED=0"
set "OLLAMA_INSTALLED=0"

REM Create temp working directory used by all download steps
if not exist "%TEMP%\StudentAssistant" mkdir "%TEMP%\StudentAssistant"

REM ===== CHECK AND INSTALL JAVA =====
echo [1/3] Checking for Java 17+...
java -version >nul 2>&1
if errorlevel 1 (
    echo [WARN] Java not found. Downloading Java 17...
    
    REM Create temp directory
    if not exist "%TEMP%\StudentAssistant" mkdir "%TEMP%\StudentAssistant"
    
    REM Try method 1: Use curl
    echo Attempting to download OpenJDK 17 using curl...
    curl -L -o "%TEMP%\StudentAssistant\java.zip" "https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.8+7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.8_7.zip" >nul 2>&1
    
    if errorlevel 1 (
        echo [INFO] Curl failed, trying PowerShell method...
        REM Try method 2: PowerShell
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri 'https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.8+7/OpenJDK17U-jdk_x64_windows_hotspot_17.0.8_7.zip' -OutFile '%TEMP%\StudentAssistant\java.zip' -UseBasicParsing -TimeoutSec 30" >nul 2>&1
    )
    
    if errorlevel 1 (
        echo [ERROR] Java download failed after multiple attempts.
        set "JAVA_INSTALLED=2"
    ) else (
        REM Extract Java
        echo Extracting Java...
        powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%TEMP%\StudentAssistant\java.zip' -DestinationPath '%TEMP%\StudentAssistant\' -Force" >nul 2>&1
        
        REM Move to Program Files
        if not exist "C:\Program Files\Java" mkdir "C:\Program Files\Java"
        for /d %%D in ("%TEMP%\StudentAssistant\jdk*") do (
            move "%%D" "C:\Program Files\Java\jdk17" >nul 2>&1
        )
        
        REM Add Java to PATH
        setx JAVA_HOME "C:\Program Files\Java\jdk17" >nul 2>&1
        setx PATH "!PATH!;C:\Program Files\Java\jdk17\bin" >nul 2>&1
        
        echo [OK] Java installed to C:\Program Files\Java\jdk17
        set "JAVA_INSTALLED=1"
    )
) else (
    echo [OK] Java found
)

REM ===== SELECT MAVEN COMMAND =====
echo [2/3] Preparing Maven wrapper...
if exist "%~dp0backend\mvnw.cmd" (
    set "MAVEN_CMD=%~dp0backend\mvnw.cmd"
    echo [OK] Using bundled Maven wrapper
) else (
    echo [ERROR] Maven wrapper not found.
    echo Please make sure backend\mvnw.cmd exists.
    set "MAVEN_INSTALLED=2"
)

REM ===== CHECK AND INSTALL OLLAMA =====
echo [3/3] Checking for Ollama...
where ollama >nul 2>&1
if errorlevel 1 (
    echo [WARN] Ollama not found. Downloading Ollama installer...
    
    REM Try method 1: Use curl
    echo Attempting to download Ollama using curl...
    curl -L -o "%TEMP%\StudentAssistant\OllamaSetup.exe" "https://ollama.ai/download/OllamaSetup.exe" >nul 2>&1
    
    if errorlevel 1 (
        echo [INFO] Curl failed, trying PowerShell method...
        REM Try method 2: PowerShell
        powershell -NoProfile -ExecutionPolicy Bypass -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; $ProgressPreference='SilentlyContinue'; Invoke-WebRequest -Uri 'https://ollama.ai/download/OllamaSetup.exe' -OutFile '%TEMP%\StudentAssistant\OllamaSetup.exe' -UseBasicParsing -TimeoutSec 30" >nul 2>&1
    )
    
    if errorlevel 1 (
        echo [ERROR] Ollama download failed after multiple attempts.
        set "OLLAMA_INSTALLED=2"
    ) else (
        REM Run Ollama installer (silent install)
        echo Running Ollama installer...
        "%TEMP%\StudentAssistant\OllamaSetup.exe" /S
        timeout /t 10 /nobreak
        
        echo [OK] Ollama installed
        set "OLLAMA_INSTALLED=1"
    )
) else (
    echo [OK] Ollama found
)

REM ===== SUMMARY: Check what failed =====
echo.
echo ======================================
echo  Installation Summary
echo ======================================
echo.

set "FAILED_COUNT=0"

if !JAVA_INSTALLED! equ 2 (
    echo [FAILED] Java - Please install manually from:
    echo          https://adoptium.net/temurin/releases/?version=17
    set /a FAILED_COUNT+=1
)

if !MAVEN_INSTALLED! equ 2 (
    echo [FAILED] Maven - Please install manually from:
    echo          https://maven.apache.org/download.cgi
    set /a FAILED_COUNT+=1
)

if !OLLAMA_INSTALLED! equ 2 (
    echo [FAILED] Ollama - Please install manually from:
    echo          https://ollama.ai/download
    set /a FAILED_COUNT+=1
)

if !FAILED_COUNT! geq 1 (
    echo.
    echo Troubleshooting tips:
    echo - Check your internet connection
    echo - Disable your antivirus/firewall temporarily
    echo - Try running this script with admin privileges
    echo.
    set /p CONTINUE="Continue anyway? (y/n): "
    if /i not "!CONTINUE!"=="y" (
        exit /b 1
    )
    echo.
)

REM Refresh PATH if we installed anything
if !JAVA_INSTALLED! equ 1 (
    echo.
    echo Please restart this script for Java PATH changes to take effect.
    pause
    exit /b 0
)

REM ===== PULL AI MODEL =====
echo.
set "OLLAMA_MODEL=gemma:2b"

REM Try to read model from backend application.properties (resources first, then java fallback)
for %%F in ("%~dp0backend\src\main\resources\application.properties" "%~dp0backend\src\main\java\edu\widgetwizards\studentassistant\application.properties") do (
    if exist "%%~F" (
        for /f "usebackq tokens=1,* delims==" %%A in (`findstr /B /C:"spring.ai.ollama.model=" "%%~F"`) do (
            if not "%%B"=="" set "OLLAMA_MODEL=%%B"
        )
    )
)

echo Ensuring Ollama model is available...
echo Pulling !OLLAMA_MODEL! model (this may take a few minutes on first run)...
call ollama pull !OLLAMA_MODEL!

echo.
echo ======================================
echo  Starting Application Components
echo ======================================
echo.

REM Start Ollama in a new window
echo Starting Ollama server...
start "Ollama Server" cmd /k "ollama serve"
timeout /t 3 /nobreak

REM Start Backend in a new window
echo Starting Backend (Spring Boot)...
cd backend
start "Student Assistant Backend" cmd /k ""%MAVEN_CMD%" spring-boot:run"
cd ..
timeout /t 5 /nobreak

REM Open the application UI
echo Opening login page...
start "Student Assistant UI" "%~dp0login.html"

REM Open browser
echo.
echo ======================================
echo  Opening Application in Browser
echo ======================================
echo.

echo.
echo [OK] All components started!
echo.
echo Frontend:  login.html
echo Backend:   http://localhost:8080
echo Ollama:    http://localhost:11434
echo.
echo Keep these windows open while using the application.
echo To stop everything, close each window.
echo.
pause
