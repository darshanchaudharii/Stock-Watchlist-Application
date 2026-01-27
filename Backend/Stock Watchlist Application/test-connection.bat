@echo off
REM Quick Test - Upload and run RDS connection test

set PEM_FILE=C:\Users\darsh\Downloads\stockwatch-key-new.pem
set EC2_USER=ec2-user
set EC2_HOST=ec2-13-233-113-144.ap-south-1.compute.amazonaws.com

echo ==========================================
echo Testing RDS Connection from EC2
echo ==========================================
echo.

echo Uploading test script...
scp -i "%PEM_FILE%" test-rds.sh %EC2_USER%@%EC2_HOST%:~/

echo.
echo Running RDS connection test...
ssh -i "%PEM_FILE%" %EC2_USER%@%EC2_HOST% "chmod +x ~/test-rds.sh && ~/test-rds.sh"

echo.
pause
