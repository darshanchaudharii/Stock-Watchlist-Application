@echo off
REM EC2 Connection Diagnostic Script

set EC2_HOST=ec2-13-233-113-144.ap-south-1.compute.amazonaws.com

echo ==========================================
echo EC2 Connection Diagnostics
echo ==========================================
echo.

echo Testing DNS resolution...
nslookup %EC2_HOST%
echo.

echo Testing network connectivity (port 22)...
echo This may take 10-15 seconds...
powershell -Command "Test-NetConnection -ComputerName %EC2_HOST% -Port 22 -InformationLevel Detailed"

echo.
echo ==========================================
echo Diagnosis Complete
echo ==========================================
echo.
echo If connection failed, check:
echo   1. EC2 instance is RUNNING (check AWS Console)
echo   2. EC2 Security Group allows SSH (port 22) from your IP
echo   3. EC2 public IP/hostname is correct
echo.
echo Your current public IP:
powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org').Content"
echo.
echo Add this IP to EC2 Security Group inbound rules:
echo   Type: SSH
echo   Port: 22
echo   Source: [Your IP above]/32
echo.
pause
