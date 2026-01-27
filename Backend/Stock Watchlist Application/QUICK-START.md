# QUICK START - Deploy to EC2 with RDS

## What I've Created for You

1. **.env** - Environment variables with RDS credentials
2. **setup-ec2.sh** - Complete EC2 setup script (installs packages, tests RDS, configures service)
3. **test-rds.sh** - RDS connection test script
4. **deploy-windows.bat** - Automated deployment from Windows
5. **test-connection.bat** - Quick RDS connection test
6. **stockwatch.service** - Systemd service configuration
7. **RDS-DEPLOYMENT.md** - Complete deployment documentation

## FASTEST WAY TO DEPLOY (3 Steps)

### Step 1: Test RDS Connection
```cmd
test-connection.bat
```

This will verify EC2 can reach your RDS database. If it fails, you need to fix security groups first!

### Step 2: Deploy Application
```cmd
deploy-windows.bat
```

This will:
- Upload all files to EC2
- Install required packages
- Test RDS connectivity
- Upload JAR file
- Configure and start the service

### Step 3: Verify
Open browser: http://ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:8080/actuator/health

## If Security Groups Need Fixing

### EC2 Security Group - Add Outbound Rule:
- Type: PostgreSQL
- Port: 5432
- Destination: 0.0.0.0/0 (or RDS security group ID)

### RDS Security Group - Add Inbound Rule:
- Type: PostgreSQL
- Port: 5432
- Source: EC2 security group ID (or EC2 private IP)

## Manual Commands (if automated script fails)

### Connect to EC2:
```cmd
ssh -i "C:\Users\darsh\Downloads\stockwatch-key-new.pem" ec2-user@ec2-13-233-113-144.ap-south-1.compute.amazonaws.com
```

### On EC2, run:
```bash
# Test RDS
./test-rds.sh

# Setup environment
./setup-ec2.sh

# Start application
sudo systemctl start stockwatch

# View logs
sudo journalctl -u stockwatch -f
```

## Configuration Details

**RDS Endpoint:** stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com
**Database:** stockwatch
**Username:** postgres
**Password:** EqHiHvPDPbpyCOv7jNaI

**Application Port:** 8080
**JAR Location:** /home/ec2-user/app/stockwatch.jar

## Troubleshooting

### Application won't start?
```bash
sudo journalctl -u stockwatch -n 100
```

### Can't connect to RDS?
Check security groups in AWS Console!

### Need to restart?
```bash
sudo systemctl restart stockwatch
```

## What's Configured

✓ RDS database connection
✓ Google OAuth2 credentials
✓ Frontend URL for CORS
✓ Systemd service for auto-restart
✓ Logging to journald

## Next Steps After Deployment

1. Test API endpoints
2. Configure EC2 security group for port 8080 (HTTP)
3. Update frontend to use EC2 URL
4. Optional: Set up Nginx reverse proxy
5. Optional: Configure SSL certificate
