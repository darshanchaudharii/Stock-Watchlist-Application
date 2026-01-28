# Stock-Watchlist-Application
=======
# 📈 StockWatch - Real-Time Stock Watchlist Application

A modern, full-stack stock watchlist application that allows users to track their favorite stocks in real-time. Built with React, Spring Boot, and PostgreSQL.

![StockWatch Demo](./screenshots/dashboard-preview.png)

## ✨ Features

- **🔐 Google OAuth Authentication** - Secure login with Google account
- **🔍 Real-Time Stock Search** - Search stocks by ticker or company name using Finnhub API
- **📊 Live Price Updates** - View current stock prices with auto-refresh every 30 seconds
- **➕ Personal Watchlist** - Add and remove stocks from your personalized watchlist
- **🌓 Dark/Light Mode** - Toggle between dark and light themes
- **📱 Fully Responsive** - Optimized for desktop, tablet, and mobile devices
- **🔔 Toast Notifications** - Visual feedback for all user actions

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌──────────────┐
│                 │      │                 │      │              │
│  React Frontend │◄────►│  Spring Boot    │◄────►│  PostgreSQL  │
│  (Vite + TS)    │      │  Backend API    │      │  Database    │
│                 │      │                 │      │              │
└─────────────────┘      └────────┬────────┘      └──────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Finnhub API   │
                         │ (Stock Quotes)  │
                         └─────────────────┘
```

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18 + TypeScript | UI framework with type safety |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Build Tool** | Vite | Fast development and build |
| **Backend** | Spring Boot 3.x | REST API & security |
| **Database** | PostgreSQL | Persistent data storage |
| **Authentication** | OAuth 2.0 (Google) | Secure user authentication |
| **Stock Data** | Finnhub API | Real-time stock quotes |

---

## 🎯 Architecture Decisions

### 1. **Monorepo Structure**
Both frontend and backend are organized in a single repository for easier development and deployment coordination.

### 2. **Session-Based Authentication**
Chose session-based auth with cookies over JWT for:
- Simpler token refresh handling
- Built-in CSRF protection with Spring Security
- Better security for browser-based apps

### 3. **API-First Design**
Backend exposes RESTful endpoints that the frontend consumes:
- `/api/auth/*` - Authentication endpoints
- `/api/stocks/*` - Stock search and quotes (public)
- `/api/watchlist/*` - User watchlist CRUD (protected)

### 4. **Caching Strategy**
Stock quotes are cached for 30 seconds to:
- Reduce API calls to Finnhub (free tier has rate limits)
- Improve response times for frequently accessed stocks

### 5. **Retry Mechanism**
Implemented exponential backoff retry for Finnhub API calls to handle transient 502/503 errors gracefully.

### 6. **Mobile-First Responsive Design**
Used Tailwind's responsive utilities (`sm:`, `md:`, `lg:`) for a mobile-first approach.

---

## 📁 Project Structure

```
Finoculus Assignment/
├── Backend/
│   └── Stock Watchlist Application/
│       ├── src/main/java/com/example/stockwatch/
│       │   ├── config/          # Security, CORS config
│       │   ├── controller/      # REST controllers
│       │   ├── dto/             # Data transfer objects
│       │   ├── entity/          # JPA entities
│       │   ├── repository/      # Data repositories
│       │   └── service/         # Business logic
│       ├── src/main/resources/
│       │   └── application.properties
│       └── pom.xml
│
├── Frontend/
│   └── Stockwatch/
│       ├── src/
│       │   ├── components/      # Reusable UI components
│       │   ├── context/         # React contexts (Auth, Theme, Toast)
│       │   ├── pages/           # Page components
│       │   └── services/        # API service functions
│       ├── public/
│       └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Java** 17+
- **PostgreSQL** 14+
- **Finnhub API Key** (Free at [finnhub.io](https://finnhub.io))
- **Google OAuth Credentials** (From [Google Cloud Console](https://console.cloud.google.com))

---

### 1️⃣ Database Setup

```sql
-- Create database
CREATE DATABASE stockwatch;

-- Create user (optional)
CREATE USER stockwatch_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE stockwatch TO stockwatch_user;
```

---

### 2️⃣ Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd "Backend/Stock Watchlist Application"
   ```

2. **Configure application.properties:**
   ```properties
   # Database
   spring.datasource.url=jdbc:postgresql://localhost:5432/stockwatch
   spring.datasource.username=your_username
   spring.datasource.password=your_password

   # Google OAuth
   spring.security.oauth2.client.registration.google.client-id=YOUR_GOOGLE_CLIENT_ID
   spring.security.oauth2.client.registration.google.client-secret=YOUR_GOOGLE_CLIENT_SECRET

   # Finnhub API
   stock.api.api-key=YOUR_FINNHUB_API_KEY
   stock.api.base-url=https://finnhub.io/api/v1

   # Frontend URL
   app.frontend.url=http://localhost:5173
   ```

3. **Run the backend:**
   ```bash
   # Windows
   .\mvnw.cmd spring-boot:run

   # Linux/Mac
   ./mvnw spring-boot:run
   ```
   
   Backend will start at `http://localhost:8080`

---

### 3️⃣ Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Frontend/Stockwatch
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will start at `http://localhost:5173`

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/oauth2/authorization/google` | Initiate Google OAuth |
| GET | `/api/auth/status` | Check authentication status |
| GET | `/api/auth/user` | Get current user info |
| POST | `/api/auth/logout` | Logout user |

### Stocks (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stocks/search?q=AAPL` | Search stocks |
| GET | `/api/stocks/quote/{symbol}` | Get stock quote |
| GET | `/api/stocks/quotes?symbols=AAPL,GOOGL` | Get multiple quotes |

### Watchlist (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get user's watchlist |
| POST | `/api/watchlist` | Add stock to watchlist |
| DELETE | `/api/watchlist/{symbol}` | Remove stock |
| GET | `/api/watchlist/check/{symbol}` | Check if stock in watchlist |

---

## 🚀 Deployment

The application is deployed securely using industry best practices.

### Infrastructure
- **Frontend**: Vercel (https://stock-watchlist-application.vercel.app)
- **Backend**: AWS EC2 (t2.micro)
- **Database**: AWS RDS (PostgreSQL 14)
- **Domain**: DuckDNS (stockwatch-backend.duckdns.org)

### Security Features
- **HTTPS/SSL**: Full encryption via Let's Encrypt & Certbot
- **Nginx Reverse Proxy**: Handles SSL termination and request forwarding
- **Cross-Origin Auth**: Configured `SameSite=None; Secure` cookies for secure Vercel-EC2 communication
- **Environment Isolation**: Production secrets managed via Environment Variables

---

## 🎨 Screenshots

### Landing Page
![Landing Page](./screenshots/landing-page.png)

### Dashboard (Dark Mode)
![Dashboard](./screenshots/dashboard-dark.png)

### Watchlist
![Watchlist](./screenshots/watchlist.png)

### Stock Details (Search)
![Stock Details](./screenshots/stock-details.png)

### Login Modal
![Login](./screenshots/login-modal.png)

---

## 🛠️ Development

### Running Tests
```bash
# Backend tests
cd "Backend/Stock Watchlist Application"
./mvnw test

# Frontend build check
cd Frontend/Stockwatch
npm run build
```

### Building for Production
```bash
# Backend
./mvnw clean package -DskipTests

# Frontend
npm run build
```

---

## 📝 Environment Variables

### Backend (`application.properties`)
| Variable | Description |
|----------|-------------|
| `spring.datasource.url` | PostgreSQL connection URL |
| `spring.datasource.username` | Database username |
| `spring.datasource.password` | Database password |
| `spring.security.oauth2.client.registration.google.client-id` | Google OAuth client ID |
| `spring.security.oauth2.client.registration.google.client-secret` | Google OAuth client secret |
| `stock.api.api-key` | Finnhub API key |
| `app.frontend.url` | Frontend URL for CORS |

---

## 🔒 Security Considerations

- CORS is configured to only allow requests from the frontend URL
- CSRF protection is disabled for API endpoints (stateless REST)
- OAuth tokens are stored server-side in sessions
- User passwords are never stored (OAuth only)
- API keys are kept in backend, never exposed to frontend

---

## 📄 License

This project was created as part of the Finoculus Assignment.

---

## 🙏 Acknowledgements

- [Finnhub](https://finnhub.io) for the free stock API
- [Lucide React](https://lucide.dev) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for styling utilities
