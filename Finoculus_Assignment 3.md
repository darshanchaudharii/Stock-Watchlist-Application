Stock Watchlist Application - Take-Home Assignment 

Overview
Build a Stock Watchlist Application that allows authenticated users to track their favorite stocks with real-time price information.

Time Limit: 48 hours


---

Functional Requirements
Core Features (Must Have)
| Feature | Description |

|---------|-------------|

| Google Authentication | Users must sign in with Google OAuth2 to access the app |

| Stock Search | Search stocks by ticker symbol or company name |

| Add to Watchlist | Add stocks to personal watchlist (persisted per user) |

| Remove from Watchlist | Remove stocks from watchlist |

| View Watchlist | Display watchlist with: Ticker, Company Name, Current Price, Price Change (%) |

| Auto-refresh Prices | Prices should refresh periodically (every 30-60 seconds) |

User Flow
No
Yes
Landing Page
Authenticated?
Google Sign In
Dashboard
View Watchlist
Search Stocks
Add to Watchlist
Remove Stock
---

Technical Requirements
Frontend Stack (Prescribed)
| Technology | Purpose |

|------------|---------|

| Next.js 14 | React framework with App Router |

| TypeScript | Type safety (strict mode) |

| Tailwind CSS | Styling |

| Shadcn/UI | Component library |

| TanStack Query | Server state management, caching, auto-refresh |

| React Hook Form + Zod | Form handling and validation |

| NextAuth.js | Google OAuth integration |

Backend Stack (Candidate Choice)
Candidates may choose their backend technology. Suggested options:

Node.js + Express
Spring Boot
NestJS
Python + FastAPI
Go + Gin
Serverless (Vercel API Routes, AWS Lambda)
Requirement: Must justify the choice in README.

Database (Candidate Choice)
Options:

PostgreSQL (recommended)
MongoDB
Firebase Firestore
Supabase
Deployment (Candidate Choice)
Deploy to any cloud platform with public URL:

Vercel
AWS (EC2, ECS, Lambda)
Railway
Render
Fly.io
Requirement: Must include deployment URL and brief architecture justification in README.

---

Stock Data APIs (Free Tiers)
Candidates should use one of these free APIs:

| API | Free Tier Limits | Documentation |

|-----|------------------|---------------|

| Finnhub | 60 calls/min | https://finnhub.io/docs/api |

| Alpha Vantage | 25 calls/day | https://www.alphavantage.co/documentation/ |

| Twelve Data | 800 calls/day | https://twelvedata.com/docs |

| Polygon.io | 5 calls/min | https://polygon.io/docs |

---

UI/UX Specifications
Page 1: Landing / Login Page
+--------------------------------------------------+
|  [Logo] StockWatch                    [Sign In]  |
+--------------------------------------------------+
|                                                  |
|         Track Your Favorite Stocks               |
|         in Real-Time                             |
|                                                  |
|         [  Sign in with Google  ]                |
|                                                  |
|         - Real-time price updates                |
|         - Personal watchlist                     |
|         - Search any stock                       |
|                                                  |
+--------------------------------------------------+
Page 2: Dashboard (Authenticated)
+--------------------------------------------------+
|  [Logo] StockWatch      [Search...]   [Avatar v] |
+--------------------------------------------------+
|                                                  |
|  My Watchlist (5 stocks)           [+ Add Stock] |
|                                                  |
|  +--------------------------------------------+  |
|  | AAPL    Apple Inc.        $178.52  +1.23%  |  |
|  |                                    [Remove]|  |
|  +--------------------------------------------+  |
|  | GOOGL   Alphabet Inc.     $141.80  -0.45%  |  |
|  |                                    [Remove]|  |
|  +--------------------------------------------+  |
|  | MSFT    Microsoft Corp.   $378.91  +0.89%  |  |
|  |                                    [Remove]|  |
|  +--------------------------------------------+  |
|                                                  |
|  Last updated: 2 seconds ago    [Refresh]        |
|                                                  |
+--------------------------------------------------+
Component: Add Stock Modal/Dialog
+------------------------------------------+
|  Add Stock to Watchlist              [X] |
+------------------------------------------+
|                                          |
|  Search: [AAPL________________] [Search] |
|                                          |
|  Results:                                |
|  +------------------------------------+  |
|  | AAPL - Apple Inc.          [+ Add] |  |
|  +------------------------------------+  |
|  | AAPD - Direxion Daily...   [+ Add] |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
Visual Design Guidelines
Use a clean, modern aesthetic (light/dark mode support is a bonus)
Green for positive price changes, Red for negative
Skeleton loaders for loading states
Toast notifications for actions (added, removed, errors)
Mobile responsive design



---

Acceptance Criteria
Must Pass (P0)
[ ] Google OAuth login/logout works
[ ] Can search for stocks by ticker
[ ] Can add stocks to watchlist (persisted to database)
[ ] Can remove stocks from watchlist
[ ] Watchlist displays ticker, company name, current price
[ ] Prices auto-refresh without full page reload
[ ] TypeScript with no any types (strict mode)
[ ] Deployed to a public URL
[ ] README with setup instructions and architecture decisions
Should Have (P1)
[ ] Loading states (skeletons/spinners)
[ ] Error handling with user-friendly messages
[ ] Price change percentage with color coding
[ ] Mobile responsive design
[ ] Proper form validation (prevent duplicate stocks)
Nice to Have (P2 - Bonus)
[ ] Dark mode toggle
[ ] Sort watchlist (by ticker, price, change %)
[ ] Drag-and-drop reorder watchlist
[ ] Price alerts (notify when price crosses threshold)
[ ] Mini price chart (sparkline)
[ ] Any other features you can think of

---

IMPORTANT - USAGE OF AI Coding Tools
------------------------------------

 - DO NOT AI Coding Agents like Claude Code , Cursor , AntiGRavity , ChatGPT , Claude.ai etc to generate all the code < we will check and you will be asked to explain the code > 
 - You can use code ediors with AI assisted code completion - VS Code with AI plugins tec


-------



Submission Requirements
GitHub Repository (public or invite reviewer)
Live demo URL
Tech stack choices with brief justification

---

