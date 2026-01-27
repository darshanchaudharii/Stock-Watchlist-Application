@echo off
REM Windows Deployment Script for Stock Watchlist Application
REM This script uploads files to EC2 and helps with deployment

echo ==========================================
echo Stock Watchlist - EC2 Deployment Helper
echo ==========================================
echo.

set PEM_FILE=C:\Users\darsh\Downloads\stockwatch-key-new.pem
set EC2_USER=ec2-user
set EC2_HOST=ec2-13-233-113-144.ap-south-1.compute.amazonaws.com
set JAR_FILE=target\StockWatch-0.0.1-SNAPSHOT.jar

echo Checking if PEM file exists...
if not exist "%PEM_FILE%" (
    echo ERROR: PEM file not found at %PEM_FILE%
    pause
    exit /b 1
)

echo Checking if JAR file exists...
if not exist "%JAR_FILE%" (
    echo ERROR: JAR file not found. Please build the project first with: mvn clean package
    pause
    exit /b 1
)

echo.
echo Step 1: Uploading setup script to EC2...
scp -i "%PEM_FILE%" setup-ec2.sh %EC2_USER%@%EC2_HOST%:~/
if errorlevel 1 (
    echo ERROR: Failed to upload setup script
    pause
    exit /b 1
)

echo.
echo Step 2: Making setup script executable...
ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "chmod +x ~/setup-ec2.sh"

echo.
echo Step 3: Running setup script on EC2...
ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "~/setup-ec2.sh"
if errorlevel 1 (
    echo ERROR: Setup script failed
    pause
    exit /b 1
)

echo.
echo Step 4: Uploading JAR file to EC2...
scp -i "%PEM_FILE%" "%JAR_FILE%" %EC2_USER%@%EC2_HOST%:~/app/stockwatch.jar
if errorlevel 1 (
    echo ERROR: Failed to upload JAR file
    pause
    exit /b 1
)

echo.
echo Step 5: Starting the application...
ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "sudo systemctl start stockwatch"

echo.
echo Step 6: Checking application status...
timeout /t 5 /nobreak > nul
ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "sudo systemctl status stockwatch"

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo.
echo Application should be running at: http://%EC2_HOST%:8080
echo.
echo Useful commands:
echo   View logs: ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "sudo journalctl -u stockwatch -f"
echo   Stop app:  ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "sudo systemctl stop stockwatch"
echo   Restart:   ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "sudo systemctl restart stockwatch"
echo.
pause
