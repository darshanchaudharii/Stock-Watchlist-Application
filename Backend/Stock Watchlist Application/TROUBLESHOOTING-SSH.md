# Alternative Deployment - Direct EC2 Configuration

## Issue: Cannot SSH to EC2

Your SSH connection is timing out. This usually means:

### 1. EC2 Instance is Stopped
- Go to AWS Console → EC2 → Instances
- Check if instance is **Running**
- If stopped, click **Start Instance**
- Wait for status to show "Running"
- Get the new Public IPv4 address/DNS

### 2. Security Group Blocks SSH
- Go to AWS Console → EC2 → Security Groups
- Find your EC2 instance's security group
- Check **Inbound Rules**
- Must have: SSH (port 22) from your IP

**Add this rule:**
- Type: SSH
- Protocol: TCP
- Port: 22
- Source: My IP (or your specific IP/32)

### 3. Wrong EC2 Address
Current address in scripts: `ec2-13-233-113-144.ap-south-1.compute.amazonaws.com`

If EC2 was restarted, the public IP changes. Get new address from AWS Console.

## Quick Fix Steps

### Step 1: Run Diagnostic
```cmd
diagnose-ec2.bat
```

This will show:
- If EC2 is reachable
- Your current public IP
- Connection status

### Step 2: Fix Security Group

Go to AWS Console:
1. EC2 → Instances → Select your instance
2. Security tab → Click security group link
3. Edit inbound rules
4. Add/Update SSH rule with your IP

### Step 3: Update Scripts (if IP changed)

If EC2 has a new public IP, update these files:
- `deploy-windows.bat` - line 9
- `test-connection.bat` - line 6

Replace with new EC2 public DNS/IP from AWS Console.

## Manual Deployment (If you can SSH)

Once you can connect:

```cmd
ssh -i "C:\Users\darsh\Downloads\stockwatch-key-new.pem" ec2-user@[YOUR-EC2-ADDRESS]
```

Then on EC2:

```bash
# Install PostgreSQL client
sudo yum install -y postgresql15

# Test RDS connection
export PGPASSWORD="EqHiHvPDPbpyCOv7jNaI"
psql -h stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com -U postgres -d postgres -c "SELECT 1;"

# If database doesn't exist, create it
psql -h stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com -U postgres -d postgres -c "CREATE DATABASE stockwatch;"

# Set environment variables
export DB_URL="jdbc:postgresql://stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com:5432/stockwatch"
export DB_USERNAME="postgres"
export DB_PASSWORD="EqHiHvPDPbpyCOv7jNaI"
export GOOGLE_CLIENT_ID="57836893394-dt5fiuc2tgk8a26boms6g68mjugdatru.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="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"
export FRONTEND_URL="https://stock-watchlist-application.vercel.app"

# Run application
cd /home/ec2-user/app
java -jar stockwatch.jar
```

## Alternative: Use AWS Systems Manager

If SSH is blocked and you can't change security groups:

1. Go to AWS Console → Systems Manager → Session Manager
2. Click "Start Session"
3. Select your EC2 instance
4. Run commands directly in browser

## Check Current EC2 Status

Run this PowerShell command:
```powershell
Test-NetConnection -ComputerName ec2-13-233-113-144.ap-south-1.compute.amazonaws.com -Port 22
```

If `TcpTestSucceeded: False`, EC2 is not reachable on SSH.
