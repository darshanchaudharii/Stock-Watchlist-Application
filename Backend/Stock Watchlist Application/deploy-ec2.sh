#!/bin/bash

# Stock Watchlist Application - EC2 Deployment Script
# This script configures environment variables and starts the application

echo "=========================================="
echo "Stock Watchlist Application Deployment"
echo "=========================================="

# Set environment variables for RDS connection
export DB_URL="jdbc:postgresql://stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com:5432/stockwatch"
export DB_USERNAME="postgres"
export DB_PASSWORD="EqHiHvPDPbpyCOv7jNaI"
export GOOGLE_CLIENT_ID="57836893394-dt5fiuc2tgk8a26boms6g68mjugdatru.apps.googleusercontent.com"
export GOOGLE_CLIENT_SECRET="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"
export FRONTEND_URL="https://stock-watchlist-application.vercel.app"

echo ""
echo "Environment variables set:"
echo "DB_URL: $DB_URL"
echo "DB_USERNAME: $DB_USERNAME"
echo "FRONTEND_URL: $FRONTEND_URL"
echo ""

# Test RDS connectivity
echo "Testing RDS connectivity..."
nc -zv stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com 5432

if [ $? -eq 0 ]; then
    echo "✓ RDS endpoint is reachable"
else
    echo "✗ Cannot reach RDS endpoint. Check security groups!"
    exit 1
fi

echo ""
echo "Starting application..."
java -jar stockwatch.jar
