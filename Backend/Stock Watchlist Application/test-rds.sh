#!/bin/bash

# Quick RDS Connection Test Script
# Run this on EC2 to verify RDS connectivity

RDS_ENDPOINT="stockwatch-db.cj4a40s6uy0p.ap-south-1.rds.amazonaws.com"
RDS_PORT="5432"
DB_USER="postgres"
DB_PASSWORD="EqHiHvPDPbpyCOv7jNaI"

echo "Testing RDS Connection..."
echo "========================="
echo ""

# Test 1: Network connectivity
echo "Test 1: Network connectivity to $RDS_ENDPOINT:$RDS_PORT"
if nc -zv -w5 $RDS_ENDPOINT $RDS_PORT 2>&1 | grep -q succeeded; then
    echo "✓ Network connection successful"
else
    echo "✗ Network connection failed"
    echo "  Check security groups!"
    exit 1
fi

echo ""

# Test 2: PostgreSQL authentication
echo "Test 2: PostgreSQL authentication"
export PGPASSWORD="$DB_PASSWORD"
if psql -h $RDS_ENDPOINT -U $DB_USER -d postgres -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✓ Authentication successful"
else
    echo "✗ Authentication failed"
    echo "  Check username and password"
    exit 1
fi

echo ""

# Test 3: Database existence
echo "Test 3: Checking for 'stockwatch' database"
DB_EXISTS=$(psql -h $RDS_ENDPOINT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='stockwatch'")
if [ "$DB_EXISTS" = "1" ]; then
    echo "✓ Database 'stockwatch' exists"
else
    echo "! Database 'stockwatch' does not exist"
    echo "  Creating database..."
    psql -h $RDS_ENDPOINT -U $DB_USER -d postgres -c "CREATE DATABASE stockwatch;"
    echo "✓ Database created"
fi

echo ""

# Test 4: Connection to stockwatch database
echo "Test 4: Connecting to 'stockwatch' database"
if psql -h $RDS_ENDPOINT -U $DB_USER -d stockwatch -c "SELECT current_database(), version();" > /dev/null 2>&1; then
    echo "✓ Successfully connected to stockwatch database"
else
    echo "✗ Failed to connect to stockwatch database"
    exit 1
fi

unset PGPASSWORD

echo ""
echo "========================="
echo "All tests passed! ✓"
echo "========================="
echo ""
echo "RDS is ready for the application."
