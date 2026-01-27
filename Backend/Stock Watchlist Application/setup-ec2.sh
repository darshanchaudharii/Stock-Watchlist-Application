#!/bin/bash

# Complete EC2 Setup Script for Stock Watchlist Application
# Run this script on your EC2 instance after uploading the JAR file

set -e

echo "=========================================="
echo "Stock Watchlist - EC2 Setup Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# RDS Configuration
RDS_ENDPOINT="stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com"
RDS_PORT="5432"
DB_NAME="stockwatch"
DB_USER="postgres"
DB_PASSWORD="EqHiHvPDPbpyCOv7jNaI"

echo ""
echo "Step 1: Installing required packages..."
sudo yum update -y
sudo yum install -y java-17-amazon-corretto postgresql15 nc

echo ""
echo "Step 2: Testing network connectivity to RDS..."
echo -n "Testing connection to $RDS_ENDPOINT:$RDS_PORT... "
if nc -zv -w5 $RDS_ENDPOINT $RDS_PORT 2>&1 | grep -q succeeded; then
    echo -e "${GREEN}✓ SUCCESS${NC}"
else
    echo -e "${RED}✗ FAILED${NC}"
    echo -e "${YELLOW}Please check:${NC}"
    echo "  1. EC2 security group allows outbound traffic to port 5432"
    echo "  2. RDS security group allows inbound traffic from EC2"
    echo "  3. RDS is in the same VPC or properly configured"
    exit 1
fi

echo ""
echo "Step 3: Testing PostgreSQL connection..."
export PGPASSWORD="$DB_PASSWORD"
if psql -h $RDS_ENDPOINT -U $DB_USER -d postgres -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ PostgreSQL connection successful${NC}"
    
    # Check if database exists
    DB_EXISTS=$(psql -h $RDS_ENDPOINT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'")
    if [ "$DB_EXISTS" = "1" ]; then
        echo -e "${GREEN}✓ Database '$DB_NAME' exists${NC}"
    else
        echo -e "${YELLOW}Creating database '$DB_NAME'...${NC}"
        psql -h $RDS_ENDPOINT -U $DB_USER -d postgres -c "CREATE DATABASE $DB_NAME;"
        echo -e "${GREEN}✓ Database created${NC}"
    fi
else
    echo -e "${RED}✗ PostgreSQL connection failed${NC}"
    echo "Please verify RDS credentials and security group settings"
    exit 1
fi
unset PGPASSWORD

echo ""
echo "Step 4: Creating application directory..."
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

echo ""
echo "Step 5: Creating systemd service..."
sudo tee /etc/systemd/system/stockwatch.service > /dev/null <<EOF
[Unit]
Description=Stock Watchlist Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/app
Environment="DB_URL=jdbc:postgresql://$RDS_ENDPOINT:$RDS_PORT/$DB_NAME"
Environment="DB_USERNAME=$DB_USER"
Environment="DB_PASSWORD=$DB_PASSWORD"
Environment="GOOGLE_CLIENT_ID=57836893394-dt5fiuc2tgk8a26boms6g68mjugdatru.apps.googleusercontent.com"
Environment="GOOGLE_CLIENT_SECRET=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"
Environment="FRONTEND_URL=https://stock-watchlist-application.vercel.app"
ExecStart=/usr/bin/java -jar /home/ec2-user/app/stockwatch.jar
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=stockwatch

[Install]
WantedBy=multi-user.target
EOF

echo ""
echo "Step 6: Enabling systemd service..."
sudo systemctl daemon-reload
sudo systemctl enable stockwatch

echo ""
echo -e "${GREEN}=========================================="
echo "Setup Complete!"
echo "==========================================${NC}"
echo ""
echo "Next steps:"
echo "  1. Upload your JAR file to /home/ec2-user/app/stockwatch.jar"
echo "  2. Start the service: sudo systemctl start stockwatch"
echo "  3. Check status: sudo systemctl status stockwatch"
echo "  4. View logs: sudo journalctl -u stockwatch -f"
echo ""
echo "Quick start command:"
echo "  sudo systemctl start stockwatch && sudo journalctl -u stockwatch -f"
echo ""
