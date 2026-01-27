# Stock Watchlist Application - RDS Deployment Guide

## Prerequisites
- EC2 Instance: ec2-13-233-113-144.ap-south-1.compute.amazonaws.com
- RDS Endpoint: stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com
- PEM File: C:\Users\darsh\Downloads\stockwatch-key-new.pem

## Security Group Configuration

### EC2 Security Group (REQUIRED)
**Outbound Rules:**
- Type: PostgreSQL
- Protocol: TCP
- Port: 5432
- Destination: RDS Security Group ID or 0.0.0.0/0

### RDS Security Group (REQUIRED)
**Inbound Rules:**
- Type: PostgreSQL
- Protocol: TCP
- Port: 5432
- Source: EC2 Security Group ID or EC2 Private IP

## Deployment Methods

### Method 1: Automated Deployment (Windows)

1. **Build the application:**
   ```cmd
   mvn clean package -DskipTests
   ```

2. **Run the deployment script:**
   ```cmd
   deploy-windows.bat
   ```

This script will:
- Upload setup script to EC2
- Install required packages
- Test RDS connectivity
- Upload JAR file
- Configure systemd service
- Start the application

### Method 2: Manual Deployment

#### Step 1: Build the Application
```cmd
mvn clean package -DskipTests
```

#### Step 2: Upload Files to EC2
```cmd
scp -i "C:\Users\darsh\Downloads\stockwatch-key-new.pem" setup-ec2.sh ec2-user@ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:~/
scp -i "C:\Users\darsh\Downloads\stockwatch-key-new.pem" test-rds.sh ec2-user@ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:~/
scp -i "C:\Users\darsh\Downloads\stockwatch-key-new.pem" target\StockWatch-0.0.1-SNAPSHOT.jar ec2-user@ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:~/
```

#### Step 3: Connect to EC2
```cmd
ssh -i "C:\Users\darsh\Downloads\stockwatch-key-new.pem" ec2-user@ec2-13-233-113-144.ap-south-1.compute.amazonaws.com
```

#### Step 4: Test RDS Connection
```bash
chmod +x test-rds.sh
./test-rds.sh
```

If this fails, check security groups!

#### Step 5: Run Setup Script
```bash
chmod +x setup-ec2.sh
./setup-ec2.sh
```

#### Step 6: Move JAR to App Directory
```bash
mkdir -p /home/ec2-user/app
mv StockWatch-0.0.1-SNAPSHOT.jar /home/ec2-user/app/stockwatch.jar
```

#### Step 7: Start the Application
```bash
sudo systemctl start stockwatch
sudo systemctl status stockwatch
```

#### Step 8: View Logs
```bash
sudo journalctl -u stockwatch -f
```

## Verification

### Check Application Status
```bash
sudo systemctl status stockwatch
```

### Test API Endpoint
```bash
curl http://localhost:8080/actuator/health
```

Or from your browser:
```
http://ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:8080/actuator/health
```

### View Application Logs
```bash
# Follow logs in real-time
sudo journalctl -u stockwatch -f

# View last 100 lines
sudo journalctl -u stockwatch -n 100

# View logs from today
sudo journalctl -u stockwatch --since today
```

## Troubleshooting

### Issue: Cannot connect to RDS

**Solution 1: Check Security Groups**
```bash
# Test network connectivity
nc -zv stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com 5432
```

If this fails:
1. Go to AWS Console → EC2 → Security Groups
2. Find your EC2 security group
3. Add outbound rule: PostgreSQL (5432) to RDS security group
4. Go to RDS security group
5. Add inbound rule: PostgreSQL (5432) from EC2 security group

**Solution 2: Check RDS is in same VPC**
- EC2 and RDS must be in the same VPC or have proper networking setup

### Issue: Authentication Failed

**Check credentials:**
```bash
export PGPASSWORD="EqHiHvPDPbpyCOv7jNaI"
psql -h stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com -U postgres -d postgres
```

### Issue: Application won't start

**Check logs:**
```bash
sudo journalctl -u stockwatch -n 200 --no-pager
```

**Restart application:**
```bash
sudo systemctl restart stockwatch
```

## Useful Commands

### Service Management
```bash
# Start
sudo systemctl start stockwatch

# Stop
sudo systemctl stop stockwatch

# Restart
sudo systemctl restart stockwatch

# Status
sudo systemctl status stockwatch

# Enable auto-start on boot
sudo systemctl enable stockwatch

# Disable auto-start
sudo systemctl disable stockwatch
```

### Log Management
```bash
# Follow logs
sudo journalctl -u stockwatch -f

# Last 50 lines
sudo journalctl -u stockwatch -n 50

# Logs from last hour
sudo journalctl -u stockwatch --since "1 hour ago"

# Clear old logs
sudo journalctl --vacuum-time=7d
```

### Database Operations
```bash
# Connect to RDS
export PGPASSWORD="EqHiHvPDPbpyCOv7jNaI"
psql -h stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com -U postgres -d stockwatch

# List tables
\dt

# Describe table
\d table_name

# Exit
\q
```

## Environment Variables

The application uses these environment variables (configured in systemd service):

```
DB_URL=jdbc:postgresql://stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com:5432/stockwatch
DB_USERNAME=postgres
DB_PASSWORD=EqHiHvPDPbpyCOv7jNaI
GOOGLE_CLIENT_ID=57836893394-dt5fiuc2tgk8a26boms6g68mjugdatru.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
FRONTEND_URL=https://stock-watchlist-application.vercel.app
```

## API Endpoints

Once deployed, the application will be available at:
- Base URL: http://ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:8080
- Health Check: http://ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:8080/actuator/health
- API Docs: http://ec2-13-233-113-144.ap-south-1.compute.amazonaws.com:8080/swagger-ui.html

## Next Steps

1. Configure EC2 security group to allow inbound HTTP traffic on port 8080
2. Set up Nginx as reverse proxy (optional)
3. Configure SSL certificate (optional)
4. Set up CloudWatch monitoring (optional)
