# Deployment Guide - Stock Watchlist Backend

## Environment Variables Required

Before running the application, set these environment variables:

### Database
- `DB_URL` - PostgreSQL connection URL (e.g., jdbc:postgresql://localhost:5432/stockwatch)
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

### Google OAuth2
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret

### Frontend
- `FRONTEND_URL` - Frontend application URL (e.g., https://stock-watchlist-application.vercel.app)

## Building the Application

```bash
mvn clean package -DskipTests
```

## Running on EC2 (HTTP on port 8080)

### Option 1: Export environment variables
```bash
export DB_URL="jdbc:postgresql://your-db-host:5432/stockwatch"
export DB_USERNAME="your_username"
export DB_PASSWORD="your_password"
export GOOGLE_CLIENT_ID="your_client_id"
export GOOGLE_CLIENT_SECRET="your_client_secret"
export FRONTEND_URL="https://stock-watchlist-application.vercel.app"

java -jar target/StockWatch-0.0.1-SNAPSHOT.jar
```

### Option 2: Pass as command-line arguments
```bash
java -jar target/StockWatch-0.0.1-SNAPSHOT.jar \
  --DB_URL="jdbc:postgresql://your-db-host:5432/stockwatch" \
  --DB_USERNAME="your_username" \
  --DB_PASSWORD="your_password" \
  --GOOGLE_CLIENT_ID="your_client_id" \
  --GOOGLE_CLIENT_SECRET="your_client_secret" \
  --FRONTEND_URL="https://stock-watchlist-application.vercel.app"
```

### Option 3: Use systemd service (recommended for production)
Create `/etc/systemd/system/stockwatch.service`:

```ini
[Unit]
Description=Stock Watchlist Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/app
Environment="DB_URL=jdbc:postgresql://your-db-host:5432/stockwatch"
Environment="DB_USERNAME=your_username"
Environment="DB_PASSWORD=your_password"
Environment="GOOGLE_CLIENT_ID=your_client_id"
Environment="GOOGLE_CLIENT_SECRET=your_client_secret"
Environment="FRONTEND_URL=https://stock-watchlist-application.vercel.app"
ExecStart=/usr/bin/java -jar /home/ec2-user/app/StockWatch-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable stockwatch
sudo systemctl start stockwatch
sudo systemctl status stockwatch
```

## CORS Configuration

The application is configured to accept requests from:
- https://stock-watchlist-application.vercel.app
- http://stockwatch-backend.duckdns.org:8080

Credentials are enabled for session-based authentication.

## OAuth2 Configuration

- The application uses Spring Security's default OAuth2 redirect URI: `/login/oauth2/code/google`
- Make sure this redirect URI is registered in your Google Cloud Console
- Full redirect URI example: `http://stockwatch-backend.duckdns.org:8080/login/oauth2/code/google`

## Startup Logs

On successful startup, you should see:
```
========================================
Stock Watchlist Application Starting
Server Port: 8080
========================================
✓ Database connection successful
Database URL: jdbc:postgresql://...
```

## Health Check

Test the application is running:
```bash
curl http://localhost:8080/api/auth/status
```

## Notes

- Application runs on HTTP port 8080
- No HTTPS/SSL configuration in the application (will be handled by Nginx proxy later)
- Session cookies use default Spring Security settings (no SameSite=None or Secure flags)
- No hardcoded URLs - all configuration is environment-driven
- Frontend folder (if present) does not affect backend build
