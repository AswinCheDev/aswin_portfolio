# ValueScout

## Elevator Pitch

ValueScout is a shopping comparison tool for the Indian fashion market that scrapes product data from multiple e-commerce sites, compares prices across Amazon/Flipkart/Nike in real time via SerpAPI, and uses a CLIP vision model to recommend outfit combinations from the scraped catalog.

## Overview

ValueScout is a web-based shopping assistant that aggregates product listings from multiple Indian e-commerce sources (Amazon India, Flipkart, Nike, Myntra, SuperKicks, VegNonVeg), compares prices across them, and uses a CLIP-based AI model to recommend outfit combinations from scraped product data stored in MongoDB. It targets Indian consumers shopping for fashion and footwear. The project was initially scaffolded with Lovable (a Vite+React code generator) on 2025-10-14, then heavily modified through late 2025 and into mid-2026. The backend was migrated from Flask to Node.js/Express (documented in `server/MIGRATION_SUMMARY.md`). As of the latest commit (2026-07-09), the project appears actively maintained.

## Architecture

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   Frontend   │──────▶│   Backend (Node) │──────▶│    MongoDB       │
│  React/Vite  │ :8080 │   Express        │ :8000 │  value_scout DB  │
│  (port 8080) │       │   (port 8000)    │       │  (port 27017)    │
└──────────────┘       └───────┬──────────┘       └──────────────────┘
                               │                           ▲
                               │ Proxy /api/*              │
                               │                           │
                               ▼                           │
                  ┌────────────────────┐                   │
                  │  SerpAPI (external) │                   │
                  │  Amazon / Google    │                   │
                  │  Shopping APIs      │                   │
                  └────────────────────┘                   │
                                                           │
┌──────────────┐       ┌──────────────────┐                │
│  Scrapers    │──────▶│  AI Microservice  │───────────────┘
│  Playwright  │       │  Flask (Python)   │
│  (one-off)   │       │  (port 5000)      │
└──────────────┘       └──────────────────┘
```

**Three-service architecture:**

1. **Frontend** (React SPA at `:8080`): Vite dev server proxies `/api/*` requests to the Express backend at `:8000` (configured in `frontend/vite.config.ts`, lines 13-18).
2. **Backend** (Express at `:8000`): Single-file server (`server/main_api_server.js`, 1884 lines) handles all REST API endpoints, MongoDB access via Mongoose, SerpAPI calls, email via Nodemailer, and a cron-based price tracker.
3. **AI Microservice** (Flask at `:5000`): `ai/ai_api.py` serves style/outfit recommendations using cosine similarity on CLIP embeddings stored in MongoDB.

**Offline scrapers** (`ai/scraper.py`, `ai/scraper_v2.py`) use Playwright to scrape product data from Myntra, SuperKicks, and VegNonVeg into MongoDB. These are run manually before the AI service can function.

**Why this architecture**: The `MIGRATION_SUMMARY.md` documents that the backend was originally Flask (Python). It was migrated to Node.js/Express for "better performance with MongoDB + bulk operations" and "cleaner code with async/await." The AI component remained in Python because it depends on PyTorch and sentence-transformers for CLIP embeddings.

The root `package.json` uses `concurrently` to start all three services with `npm run dev`.

## Tech Stack

### Frontend
| Technology | Version | Source |
|---|---|---|
| React | ^18.3.1 | `frontend/package.json` |
| TypeScript | ^5.8.3 | `frontend/package.json` |
| Vite | ^5.4.19 | `frontend/package.json` |
| Tailwind CSS | ^3.4.17 | `frontend/package.json` |
| Radix UI (20+ primitives) | various | `frontend/package.json` (lines 15-41) |
| React Router DOM | ^6.30.1 | `frontend/package.json` |
| React Hook Form | ^7.61.1 | `frontend/package.json` |
| Zod | ^3.25.76 | `frontend/package.json` |
| TanStack React Query | ^5.83.0 | `frontend/package.json` |
| Recharts | ^2.15.4 | `frontend/package.json` |
| @react-oauth/google | ^0.12.2 | `frontend/package.json` |
| Lucide React (icons) | ^0.462.0 | `frontend/package.json` |
| Sonner (toasts) | ^1.7.4 | `frontend/package.json` |
| class-variance-authority | ^0.7.1 | `frontend/package.json` |
| tailwind-merge | ^2.6.0 | `frontend/package.json` |
| @vitejs/plugin-react-swc | ^3.11.0 | `frontend/package.json` |
| Inter + Press Start 2P fonts | — | `frontend/index.html` (Google Fonts link) |

### Backend
| Technology | Version | Source |
|---|---|---|
| Node.js | v18+ (required) | `README.md` line 75 |
| Express | ^5.1.0 | `server/package.json` |
| Mongoose | ^8.20.2 | `server/package.json` |
| Axios | ^1.13.2 | `server/package.json` |
| Cheerio | ^1.1.2 | `server/package.json` |
| Node-cron | ^4.2.1 | `server/package.json` |
| Nodemailer | ^7.0.11 | `server/package.json` |
| cors | ^2.8.5 | `server/package.json` |
| dotenv | ^17.2.3 | `server/package.json` |
| concurrently | ^9.2.1 | `server/package.json` (devDep) |
| nodemon | ^3.1.11 | `server/package.json` (devDep) |

### AI / Scraping (Python)
| Technology | Version | Source |
|---|---|---|
| Python | 3.9+ (required) | `README.md` line 76 |
| Flask | 3.1.2 | `ai/requirements.txt` |
| flask-cors | 6.0.1 | `ai/requirements.txt` |
| PyTorch | 2.9.1 | `ai/requirements.txt` |
| sentence-transformers | 5.1.2 | `ai/requirements.txt` |
| transformers (HuggingFace) | 4.57.1 | `ai/requirements.txt` |
| scikit-learn | 1.7.2 | `ai/requirements.txt` |
| pymongo | 4.15.4 | `ai/requirements.txt` |
| Pillow | 12.0.0 | `ai/requirements.txt` |
| numpy | 2.3.4 | `ai/requirements.txt` |
| Playwright | ^1.56.1 | Root `package.json` |

### Database & Infrastructure
| Technology | Version | Source |
|---|---|---|
| MongoDB | local or Atlas | `README.md` line 77, `.env.example` line 7 |

## External Dependencies & Integrations

### Third-party APIs
| Service | Purpose | Source |
|---|---|---|
| **SerpAPI** | Product search from Amazon India (`engine: amazon`, `amazon_domain: amazon.in`) and Google Shopping (for Flipkart/Nike results) | `server/main_api_server.js` lines 960-967, 1068-1074, 1177-1183 |
| **Google OAuth** | User login via Google identity provider | `frontend/src/App.tsx` line 44 (client ID hardcoded) |
| **Gmail SMTP** | Sending verification and price-drop alert emails via Nodemailer | `server/main_api_server.js` lines 119-134, `server/price_tracker.js` lines 10-16 |
| **Ethereal Email** | Fallback test email service when SMTP credentials aren't configured | `server/main_api_server.js` lines 141-152 |
| **HuggingFace Hub** | Downloads the `clip-ViT-B-32` model for embeddings | `ai/process_embeddings.py` line 21 |

### Scraped Websites (offline Playwright scrapers)
| Site | Data | Source |
|---|---|---|
| **Myntra** | H&M, Nike, Snitch, Mango clothing & shoes | `ai/scraper.py` lines 91-256 |
| **SuperKicks** | Footwear | `ai/scraper.py` lines 262-365 |
| **VegNonVeg** | Footwear | `ai/scraper.py` lines 371-473 |

### Required Environment Variables
Source: `server/.env.example`

| Variable | Purpose |
|---|---|
| `PORT` | Express server port (default: 8000) |
| `MONGO_URI` | MongoDB connection string |
| `COLLECTION_NAME` | Product collection name in MongoDB |
| `AI_API_URL` | URL of the Python Flask AI service |
| `SERPAPI_KEY` | API key for SerpAPI product searches |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASSWORD` | Gmail app password |
| `EMAIL_FROM` | Email "From" header |
| `EMAIL_HOST` | SMTP host (default: smtp.gmail.com) |
| `EMAIL_PORT` | SMTP port (default: 587) |
| `EMAIL_SECURE` | TLS flag for SMTP |
| `FRONTEND_URL` | Frontend URL for verification links |
| `NODE_ENV` | Environment flag |

AI microservice env vars (from `ai/ai_api.py` lines 178-180):
| Variable | Purpose |
|---|---|
| `AI_API_HOST` | Flask bind host (default: 127.0.0.1) |
| `AI_API_PORT` | Flask bind port (default: 5000) |
| `FLASK_DEBUG` | Enable Flask debug mode |

Note: `VITE_HOST` and `BACKEND_PROXY_TARGET` are used by the frontend Vite config (`frontend/vite.config.ts` lines 10, 15).

## Security & Secrets Handling

### Credential Management

Secrets are managed via `.env` files loaded by `dotenv`. The backend calls `dotenv.config()` at `server/main_api_server.js` line 13. The `.env` file is listed in `.gitignore` (line 2). The AI microservice has its own `ai/.env` file (also gitignored).

### Hardcoded Secrets & Credentials Found in Repo

| What | File | Line | Detail |
|---|---|---|---|
| **Gmail app password** | `server/.env.example` | 18 | `EMAIL_PASSWORD=bire mumg gliz bwka` — matches Gmail app password format (4×4 lowercase letters). This file is tracked in git. If this is a real credential, it is exposed in version history. |
| **Google OAuth client ID** | `frontend/src/App.tsx` | 44 | `clientId="813492076332-lf68pl7vn7kfe6m53t0i0u55mgrandhe.apps.googleusercontent.com"` — hardcoded directly in source. Not a secret per se (client IDs are semi-public), but best practice is to use an env var. |
| **MongoDB connection string** | `ai/ai_api.py` | 17 | `MongoClient("mongodb://localhost:27017/")` — hardcoded, not read from env. Same in `ai/scraper.py` line 11, `ai/scraper_v2.py` line 10, `ai/process_embeddings.py` line 15, and multiple utility scripts. |
| **Email address** | `server/.env.example` | 17 | `EMAIL_USER=valuescout6@gmail.com` — email address committed to repo |

### Authentication & Authorization Logic

| Mechanism | What it protects | Implementation | Gaps |
|---|---|---|---|
| **Email/password auth** | User accounts | `POST /api/auth/login` (`main_api_server.js` line 446) — compares plaintext passwords directly (`user.password !== password`, line 472) | No password hashing (TODO at line 209), no bcrypt |
| **Email verification** | Account activation | Token generated at registration (line 203), verified via `GET /api/auth/verify-email` (line 314), 24-hour expiry | Token is `Math.random().toString(36)` — not cryptographically secure |
| **Google OAuth** | Social login | `@react-oauth/google` on frontend, `POST /api/auth/google` on backend (line 497) | Backend trusts client-sent `email` and `googleId` without verifying the Google ID token server-side |
| **Apple OAuth** | Social login | `POST /api/auth/apple` (line 542) | Completely unverified — accepts any `appleId` string, creates/finds user immediately |
| **Route protection** | Frontend pages | `ProtectedRoute` component in `App.tsx` (line 39) redirects to `/login` if `localStorage` has no user | Client-side only; no server-side auth middleware on any API endpoint |
| **API authorization** | None | No middleware checks `userId` ownership on wishlist/alert endpoints | Any user ID can be passed to access/modify another user's data |

### Dependency Lockfiles

- `package-lock.json` exists at root (12KB), `server/package-lock.json` (83KB), and `frontend/package-lock.json` (282KB).
- `ai/requirements.txt` has pinned versions (no ranges).
- No `npm audit` or `pip audit` output exists in the repo. Unconfirmed — run an audit tool to check for known vulnerabilities.

## Core Features

### Implemented and Working (traced to code)

| Feature | Implementation Location |
|---|---|
| **Multi-source product search** | `server/main_api_server.js` `/api/external-search` (line 719) — queries Amazon via SerpAPI `engine: amazon` and Google Shopping for Flipkart/Nike simultaneously |
| **Price comparison** | `server/main_api_server.js` `/api/compare-prices` (line 787) — runs 4 parallel searches (local DB + Amazon + Flipkart + Nike), sorts by price ascending, returns top 4 |
| **Keyword-scoring search relevance** | `searchLocalDBMultiple()` (line 848), `searchAmazonForComparison()` (line 952) — custom scoring with keyword matching, accessory exclusion, and demographic penalties |
| **Product deduplication** | `upsertProductsToMongoDB()` (line 1509) — bulk upsert using `link` as unique key |
| **User registration with email verification** | `/api/auth/register` (line 182) — generates random token, sends HTML verification email with 24-hour expiry |
| **Email verification** | `/api/auth/verify-email` (line 314) — validates token and expiry |
| **Resend verification** | `/api/auth/resend-verification` (line 384) |
| **Email/password login** | `/api/auth/login` (line 446) — plaintext password comparison (see Tech Debt) |
| **Google OAuth login** | `/api/auth/google` (line 497), frontend `App.tsx` line 44 with `GoogleOAuthProvider` |
| **Apple OAuth login** (endpoint exists) | `/api/auth/apple` (line 542) — saves user but no actual Apple ID token verification |
| **Wishlist CRUD** | Add (line 1549), Remove (line 1604), List (line 1654), Check (line 1679), Price alert on wishlist item (line 1707) |
| **Price alerts** | CRUD endpoints at `/api/price-alerts` (lines 590-656) |
| **Automated price tracking** | `server/price_tracker.js` — cron job every 12 hours (line 435), checks Amazon prices via SerpAPI + Cheerio HTML fallback, sends batch email notifications for drops |
| **AI Style Builder** | `ai/ai_api.py` `/api/style-builder/<product_id>` (line 34) — cosine similarity on CLIP embeddings, returns top 5 matching items from compatible outfit categories |
| **Embedding generation** | `ai/process_embeddings.py` — 70% image + 30% text CLIP embedding via `clip-ViT-B-32` model (line 68) |
| **Web scraping pipeline** | `ai/scraper.py` `run_all_scrapers()` (line 479) — scrapes 6 brands from 3 sites with checkpoint/resume, auto-categorizes products |
| **Local product search** | `/api/search` (line 1781) — regex search on productName, brand, category, source; only returns products with embeddings |
| **Batch product fetch** | `/api/products-by-ids` (line 1830) — fetch multiple products by comma-separated IDs |
| **Frontend pages** | Home (`Home.tsx`), Compare (`Compare.tsx`), Wishlist (`Wishlist.tsx`), StyleBuilder (`StyleBuilderSearchPage.tsx`), Auth (`Auth.tsx`), VerifyEmail (`VerifyEmail.tsx`) |
| **Lowest-price feed** | `/api/lowest-this-month` (line 662) — returns 4 cheapest Amazon shoes from DB |
| **Debug test email** | `/api/debug/send-test-email` (line 113) |

### Stubbed / Planned / Incomplete (traced to code or docs)

| Item | Evidence |
|---|---|
| **Password hashing** | Comment at `main_api_server.js` line 209: `password: password, // TODO: Hash with bcrypt in production` |
| **JWT authentication** | Listed as "Short Term (Recommended)" in `server/MIGRATION_SUMMARY.md` line 237: `- [ ] Add JWT authentication` |
| **Rate limiting** | Listed in `server/MIGRATION_SUMMARY.md` line 239: `- [ ] Add rate limiting` |
| **Redis caching** | Listed in `server/MIGRATION_SUMMARY.md` line 246: `- [ ] Add caching (Redis)` |
| **Pagination** | Listed in `server/MIGRATION_SUMMARY.md` line 247: `- [ ] Add pagination for search results` |
| **Apple OAuth verification** | `/api/auth/apple` endpoint exists (line 542) but performs no token validation — accepts any `appleId` string |
| **Product reviews aggregation** | Listed in `server/MIGRATION_SUMMARY.md` line 244: `- [ ] Add product reviews aggregation` |
| **Input validation middleware** | Listed in `server/MIGRATION_SUMMARY.md` line 238: `- [ ] Add input validation middleware` |
| **Logging middleware** | Listed in `server/MIGRATION_SUMMARY.md` line 240: `- [ ] Add logging middleware (Morgan)` |

## Key Modules / Files

| File/Folder | What it does | Why it matters |
|---|---|---|
| `server/main_api_server.js` | Monolithic Express server (1884 lines) with all API endpoints, Mongoose schemas, SerpAPI integration, auth, wishlist, and search logic | The entire backend — all business logic lives here |
| `server/price_tracker.js` | Cron-scheduled price checker (464 lines) with SerpAPI + Cheerio HTML scraping fallback and batch email notifications | Drives the price-drop alert feature end-to-end |
| `ai/ai_api.py` | Flask API serving outfit recommendations via cosine similarity on CLIP embeddings | The AI component — computes style recommendations |
| `ai/process_embeddings.py` | Batch generates 512-dim CLIP embeddings (70% image + 30% text) for all products without one | Must run after scraping to enable AI features |
| `ai/scraper.py` | Playwright-based scraper for Myntra (H&M, Nike, Snitch, Mango), SuperKicks, VegNonVeg with checkpoint/resume | Primary data ingestion — populates the products collection |
| `ai/scraper_v2.py` | Earlier/alternative scraper version targeting Nike, H&M, Zara, Snitch from Myntra | Predecessor to `scraper.py`, still functional |
| `frontend/src/App.tsx` | Root React component with routing (6 routes), Google OAuth provider, auth state via localStorage | Central routing and auth state management |
| `frontend/src/pages/Home.tsx` | Homepage with search, deal cards, lowest-price feed (22KB) | Main user-facing page |
| `frontend/src/pages/Compare.tsx` | Price comparison view across sources | Core comparison feature UI |
| `frontend/src/pages/Wishlist.tsx` | Wishlist management with price alert integration | User's saved products |
| `frontend/src/pages/StyleBuilderSearchPage.tsx` | AI style builder search interface | Entry point for AI recommendations |
| `frontend/src/components/ProductCard.tsx` | Product display card with wishlist toggle, price alert, comparison (18KB) | Most complex UI component |
| `frontend/src/components/Navbar.tsx` | Navigation bar with auth-aware menus (11KB) | Global navigation |
| `frontend/src/hooks/useAuth.ts` | Custom hook for login/register/logout with localStorage persistence | Frontend auth management |
| `frontend/vite.config.ts` | Vite config with API proxy to `:8000` and `@/` alias | Dev server and build configuration |
| `tools/check-imports.js` | Static analysis tool scanning for broken imports across JS/TS/Python files | Build integrity verification |
| `server/.env.example` | Environment variable template with all required config keys | Setup reference |
| `server/MIGRATION_SUMMARY.md` | Documents the Flask → Express migration, including rationale, data flow, and remaining TODO items | Architecture decision record |
| `scraper_checkpoint.json` | Persisted set of scraped product IDs for deduplication (171KB) | Prevents re-scraping previously seen products |

## Data Model

Source: Mongoose schemas in `server/main_api_server.js` lines 50-107, scraper documents in `ai/scraper.py` lines 209-219.

### `products` Collection

```javascript
// Mongoose schema (main_api_server.js lines 50-61)
// Also populated by scrapers with slightly different field names
{
  _id: ObjectId | String,        // ObjectId from SerpAPI upserts, string hash from scrapers
  productName: String,           // required
  brand: String,                 // set by scrapers, not by SerpAPI path
  category: String,              // "shoes", "tshirt", "shirt", "pants", "shorts", "hoodie", "jacket", "dress", "clothing"
  price: Mixed,                  // Can be string ("₹1,299") or number
  source: String,                // required — "Amazon", "Flipkart", "Nike", "myntra_hm", "superkicks", "vegnonveg", etc.
  image: String,                 // SerpAPI path field name
  imageUrl: String,              // Scraper path field name (same data, different key)
  link: String,                  // required, unique — SerpAPI path
  productUrl: String,            // Scraper path (same data, different key)
  asin: String,                  // Amazon ASIN, when available
  rating: Mixed,
  reviews: Mixed,
  styleEmbedding: [Number],      // 512-dim CLIP vector, generated by process_embeddings.py
  scrapedAt: Date,               // Set by scrapers
  createdAt: Date,
  updatedAt: Date
}
// Note: Schema uses { strict: false }, so arbitrary extra fields are allowed
```

### `wishlists` Collection

```javascript
// Mongoose schema (main_api_server.js lines 64-75)
{
  _id: ObjectId,
  userId: String,               // required
  productId: ObjectId,          // ref: 'Product'
  title: String,                // required
  price: Mixed,
  image: String,
  source: String,
  link: String,                 // required
  asin: String,
  targetPrice: Mixed,           // For price tracking alerts
  createdAt: Date
}
```

### `users` Collection

```javascript
// Mongoose schema (main_api_server.js lines 78-86)
{
  _id: ObjectId,
  email: String,                // required, unique, lowercase
  password: String,             // required — STORED IN PLAINTEXT (see Tech Debt)
  name: String,
  isEmailVerified: Boolean,     // default: false
  verificationToken: String,
  verificationTokenExpiry: Date,
  createdAt: Date
}
```

### `pricealerts` Collection

```javascript
// Mongoose schema (main_api_server.js lines 89-101)
{
  _id: ObjectId,
  userId: String,               // required
  productId: String,            // required
  productName: String,          // required
  currentPrice: Mixed,
  targetPrice: Number,          // required
  source: String,
  productUrl: String,
  productImage: String,
  isTriggered: Boolean,         // default: false
  createdAt: Date,
  triggeredAt: Date
}
```

### `notifications` Collection (implicit)

```javascript
// Created by price_tracker.js (line 215), no Mongoose schema defined
{
  _id: ObjectId,
  userId: ObjectId,
  asin: String,
  title: String,
  currentPrice: Number,
  targetPrice: Number,
  isRead: Boolean,              // default: false
  createdAt: Date
}
```

## APIs / Interfaces

### Backend REST API (Express, port 8000)

#### Health & Debug
| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| GET | `/` | — | `{ status, message }` | line 170 |
| GET/POST | `/api/debug/send-test-email` | `?to=` or `{ to }` | `{ status, messageId }` | line 113 |

#### Authentication
| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| POST | `/api/auth/register` | `{ email, password, name? }` | `{ message, user: { id, email, name, isEmailVerified } }` (201) | line 182 |
| GET | `/api/auth/verify-email` | `?token=&email=` | `{ message, user }` | line 314 |
| POST | `/api/auth/resend-verification` | `{ email }` | `{ message }` | line 384 |
| POST | `/api/auth/login` | `{ email, password }` | `{ message, user: { id, email, name } }` | line 446 |
| POST | `/api/auth/google` | `{ email, name, googleId }` | `{ message, user }` | line 497 |
| POST | `/api/auth/apple` | `{ email, name, appleId }` | `{ message, user }` | line 542 |

#### Product Search
| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| GET | `/api/external-search` | `?q=query` | `{ success, count, amazon[], flipkart[], nike[], all[] }` | line 719 |
| GET | `/api/compare-prices` | `?q=query&offset=0` | `{ query, products[], timestamp }` | line 787 |
| GET | `/api/search` | `?q=query` | `Product[]` (only those with embeddings) | line 1781 |
| GET | `/api/products-by-ids` | `?ids=id1,id2,...` | `Product[]` | line 1830 |
| GET | `/api/lowest-this-month` | — | `{ success, count, shoes[] }` | line 662 |

#### Wishlist
| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| POST | `/api/wishlist/add` | `{ userId, title, price?, image?, source?, link, asin?, targetPrice? }` | `{ message, status, item }` (201 or 409) | line 1549 |
| DELETE | `/api/wishlist/remove` | `{ userId, itemId?, link? }` | `{ message, status, item }` | line 1604 |
| GET | `/api/wishlist/:userId` | — | `{ items[] }` | line 1654 |
| GET | `/api/wishlist/check/:userId` | `?link=url` | `{ inWishlist, item }` | line 1679 |
| POST | `/api/wishlist/price-alert` | `{ userId, itemId, targetPrice }` | `{ message, status, item }` | line 1707 |

#### Price Alerts
| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| POST | `/api/price-alerts` | `{ userId, productId, productName, currentPrice?, targetPrice, source?, productUrl?, productImage? }` | `{ message, alert }` (201) | line 590 |
| GET | `/api/price-alerts/:userId` | — | `PriceAlert[]` (active only) | line 632 |
| DELETE | `/api/price-alerts/:alertId` | — | `{ message }` | line 647 |

#### Style Builder (proxy to Python)
| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| GET | `/api/style-builder/:productId` | — | Proxied response from AI service | line 1750 |

### AI Microservice API (Flask, port 5000)

| Method | Endpoint | Input | Output | Source |
|---|---|---|---|---|
| GET | `/` | — | API documentation JSON | `ai/ai_api.py` line 154 |
| GET | `/api/health` | — | `{ status, database, total_products, products_with_embeddings, embedding_coverage }` | line 133 |
| GET | `/api/style-builder/<product_id>` | URL param | `{ input_product_id, input_category, target_categories, total_candidates, recommendations: [{ id, score }] }` | line 34 |

### CLI / Scripts

| Command | What it does | Source |
|---|---|---|
| `npm run dev` (root) | Starts all 3 services concurrently | `package.json` line 12 |
| `npm run start:all` (root) | Same as `dev`, with colored labels | `package.json` line 7 |
| `python ai/scraper.py` | Runs full scraping pipeline (wipes DB first) | `ai/scraper.py` line 557 |
| `python ai/scraper_v2.py` | Alternative scraper (Nike, H&M, Zara, Snitch from Myntra) | `ai/scraper_v2.py` line 329 |
| `python ai/process_embeddings.py` | Generates CLIP embeddings for all products missing them | `ai/process_embeddings.py` line 159 |
| `python ai/ai_api.py` | Starts the Flask AI service | `ai/ai_api.py` line 168 |
| `node tools/check-imports.js` | Checks for broken/unresolved imports across the project | `tools/check-imports.js` line 129 |

## Algorithms & Models

### CLIP-based Style Embedding (`ai/process_embeddings.py`)

- **Model**: `clip-ViT-B-32` loaded via `sentence-transformers` (line 21)
- **Embedding formula**: `combined = (image_embedding × 0.7) + (text_embedding × 0.3)` (line 68)
  - Image embedding: CLIP encodes the product image (downloaded from URL)
  - Text embedding: CLIP encodes the product name string
- **Output**: 512-dimensional float vector stored as `styleEmbedding` array in MongoDB
- **Process**: Iterates all products missing `styleEmbedding`, downloads product image, generates combined embedding, stores in DB

### Outfit Recommendation (`ai/ai_api.py`)

- **Method**: Cosine similarity (`sklearn.metrics.pairwise.cosine_similarity`, line 105) between the input product's embedding and all candidate products' embeddings
- **Category constraints**: Hardcoded `OUTFIT_RULES` dict (lines 23-32) defines which categories can pair together (e.g., shoes → tshirt, shirt, pants, jeans, shorts, hoodie, jacket)
- **Output**: Top 5 products by similarity score from compatible categories

### Product Search Scoring (`server/main_api_server.js`)

- **Keyword scoring**: Custom scoring algorithm used in `searchLocalDBMultiple()` (line 848), `searchAmazonForComparison()` (line 952), and similar functions
- Assigns +2/+3 points per matching keyword, +10/+15 for exact phrase match, +2 for footwear keywords
- Applies penalties (-10/-15) for demographic mismatches (kids/women items when not searched)
- Hard-excludes accessories via blocklist (crease, protector, guard, etc.)
- Minimum score threshold of 2-5 required for inclusion
- **Clothing/footwear filter**: `isClothingOrFootwear()` (line 1279) — context-aware filter that restricts results to footwear when the query contains shoe-related terms, or allows general fashion items otherwise

## Testing & CI/CD

### Test Framework

No test framework is configured. No test runner (jest, mocha, vitest, pytest) appears in any `package.json` `devDependencies` or `requirements.txt`.

### What Exists

- `server/test.js` (14 lines, 477 bytes): Not a test suite. It's a smoke-check script that loads `dotenv`, logs whether `MONGO_URI` is set, and exits. It uses `console.log` assertions, not a test framework. Source: `server/test.js` lines 1-14.
- `ai/test_api.py` (259 bytes): Exists but was not fully read — file size suggests it's similarly minimal.
- `ai/test_product_id.py` (516 bytes): Exists but was not fully read.
- `TESTING_GUIDE.md` in `server/` (13KB): Contains cURL examples for manual endpoint testing, not automated test code.

### What's Not Tested

Everything. No unit tests, integration tests, or end-to-end tests exist. Test coverage is 0% / unmeasured — no coverage tooling is configured.

### CI/CD

No CI/CD configuration exists. No `.github/workflows/`, `.gitlab-ci.yml`, `Dockerfile`, `docker-compose.yml`, `Procfile`, `vercel.json`, `netlify.toml`, `fly.toml`, `render.yaml`, or `railway.json` files were found in the repository.

## Metrics & Performance

### Repo Scale

Source: `git shortlog -sn --all`, `git log --oneline --all`, `Get-ChildItem` / `Measure-Object`

| Metric | Value | Source |
|---|---|---|
| **Total commits** | 79 | `git log --oneline --all \| wc -l` |
| **Contributors** | 2 — Aswin Chettri (71 commits), gpt-engineer-app[bot] (8 commits) | `git shortlog -sn --all` |
| **Repo age** | ~9 months (2025-10-14 → 2026-07-09) | First and last commit dates |
| **Total files** (excl. node_modules, .git, .venv, dist) | 149 | `Get-ChildItem -Recurse` |
| **Lines of source code** (JS/TS/TSX/PY/CSS/HTML/MD, excl. node_modules/dist/.git/.venv) | ~13,398 | `Get-Content \| Measure-Object -Line` across 115 source files |
| **Vendored/generated UI code** | 49 files, ~3,491 lines in `frontend/src/components/ui/` | Shadcn UI generated components (see Confidence Notes) |
| **Lines of original source** (excluding vendored UI) | ~9,907 | 13,398 − 3,491 |

### Needs Measurement

- No benchmark files, test output logs, or performance test results exist in the repository.
- No load testing or response time data found.
- The scraper checkpoint file (`scraper_checkpoint.json`, 171KB) contains approximately 1,400+ scraped product IDs (based on a count of entries from Myntra and SuperKicks sources), but the actual database size depends on which scrapers have been run.
- Scraper targets (from `ai/scraper.py` lines 519-547): H&M 1500+, Nike 500+, Snitch 500+, Mango 500+, shoes (SuperKicks + VegNonVeg) 1000+.
- The `MIGRATION_SUMMARY.md` mentions "15+ test cases provided" (line 312) but the `server/test.js` file is only 477 bytes and appears minimal.

## Setup & Environment

Source: `README.md` lines 72-111, `server/.env.example`

### Prerequisites
- Node.js v18+
- Python 3.9+
- MongoDB (local or Atlas)

### Steps

**1. Clone**
```bash
git clone https://github.com/Skenlrd/value-scout-01.git
cd value-scout
```

**2. Backend**
```bash
cd server
npm install
# Copy .env.example to .env and fill in values (MONGO_URI, SERPAPI_KEY, EMAIL_USER, EMAIL_PASSWORD)
cp .env.example .env
npm run dev
```

**3. Frontend**
```bash
cd frontend
npm install
npm run dev
```

**4. AI Microservice**
```bash
cd ai
python -m venv .venv
# Windows: .venv\Scripts\activate
# Linux/Mac: source .venv/bin/activate
pip install -r requirements.txt
python ai_api.py
```

**5. (Optional) Run scrapers to populate product data**
```bash
python ai/scraper.py           # Scrapes products (wipes DB first)
python ai/process_embeddings.py  # Generates CLIP embeddings
```

**6. (Alternative) Run all services concurrently from root**
```bash
npm install       # root devDependencies (concurrently)
npm run dev       # starts AI, backend, and frontend simultaneously
```

Note: The root `npm run start:ai` script (line 8 in root `package.json`) assumes `.venv\Scripts\python.exe` — Windows-specific path.

## Deployment

No deployment configuration exists in this repository. There are no `Dockerfile`, `docker-compose.yml`, `Procfile`, `vercel.json`, `netlify.toml`, `fly.toml`, `render.yaml`, `railway.json`, or `.github/workflows` files. The Vite config (`frontend/vite.config.ts`) has a `vite build` script but the `dist/` directory is gitignored and no build artifacts are committed.

All evidence indicates this is a **local-development-only** project. The `README.md` setup instructions only describe running locally. The backend hardcodes `localhost` connections (MongoDB at `mongodb://127.0.0.1:27017`, frontend proxy to `http://localhost:8000`). The frontend `useAuth.ts` hardcodes `http://localhost:8000` for API calls.

There is no evidence the application has ever been deployed to a hosted environment.

## Known Limitations / Tech Debt

| Issue | Evidence | Severity |
|---|---|---|
| **Passwords stored in plaintext** | `main_api_server.js` line 209: `password: password, // TODO: Hash with bcrypt in production` and line 472: `if (user.password !== password)` | Critical |
| **Google OAuth client ID hardcoded** | `App.tsx` line 44: client ID directly in source | High |
| **No JWT/session authentication** | Auth state managed entirely via `localStorage` in the browser (`useAuth.ts` line 52). No server-side session validation on API requests. | High |
| **Apple OAuth has no token verification** | `/api/auth/apple` (line 542) accepts any `appleId` string without verifying it against Apple's servers | High |
| **Frontend hardcodes API URL** | `useAuth.ts` lines 38, 64: `fetch('http://localhost:8000/api/auth/...')` bypassing the Vite proxy | Medium |
| **Monolithic backend** | All 1884 lines of backend code in one file — schemas, routes, helper functions, email logic | Medium |
| **Duplicated email sending logic** | Email transporter creation/verification code duplicated across register (line 222), resend-verification (line 407), debug endpoint (line 113), and price_tracker.js | Medium |
| **No input validation middleware** | `MIGRATION_SUMMARY.md` line 238 lists this as TODO | Medium |
| **No rate limiting** | `MIGRATION_SUMMARY.md` line 239 lists this as TODO | Medium |
| **Field name inconsistency** | Scrapers use `imageUrl`/`productUrl`, SerpAPI path uses `image`/`link`. Normalized at query time via mapping in multiple places (lines 690-694, 750-754, 1810-1814) | Medium |
| **Scraper runs headless=False** | `scraper.py` line 68: `headless=False` — requires a visible browser, not suitable for CI/headless servers | Low |
| **import re inside loops** | `scraper.py` lines 176, 325, 433: `import re` inside `for` loops | Low |
| **`strict: false` on Product schema** | Line 61: allows arbitrary fields — reduces data integrity | Low |
| **SERPAPI_KEY in .env.example** | `.env.example` line 18 contains what appears to be a real Gmail app password | Critical (if real) |
| **No automated tests** | `server/test.js` is 477 bytes; no test framework configured | Medium |

## Decisions & Trade-offs

| Decision | Rationale (inferred) | Evidence |
|---|---|---|
| **Flask → Express migration** | "Better Performance: MongoDB + bulk operations", "Cleaner Code: Express.js with async/await", "Modern Stack: Node.js ecosystem" | `server/MIGRATION_SUMMARY.md` lines 307-312 |
| **Kept AI in Python** | PyTorch, sentence-transformers, and scikit-learn don't have viable Node.js equivalents; CLIP model requires Python ecosystem | AI service exists as separate Flask app rather than being integrated into Express |
| **SerpAPI instead of direct scraping for real-time search** | Direct scraping is fragile (commit message: "EVERYHTING IS WORKING EXPECT FOR SCAPPER (IP ADD BLOCKED)") — SerpAPI provides structured data with rate-limited, legal access | `ai/scraper.py` for offline data; `server/main_api_server.js` SerpAPI for live search |
| **MongoDB instead of SQL** | Schema flexibility needed: product data varies widely across sources (different fields from Myntra vs Amazon vs Google Shopping); `strict: false` confirms this intent | `server/main_api_server.js` line 61 |
| **70/30 image/text embedding split** | Image carries more style information than product name text | `ai/process_embeddings.py` line 68, comment: "70% image + 30% text" |
| **Lovable for initial scaffold** | First commit: "[skip lovable] Use tech stack vite_react_shadcn_ts_20250728_minor" | Git history; explains extensive Radix UI / Shadcn component library in frontend |
| **localStorage for auth** | Simplicity over security — no server-side session management needed | `frontend/src/hooks/useAuth.ts` |
| **Proxy /api in Vite** | Avoids CORS issues during development; single-origin for OAuth | `frontend/vite.config.ts` lines 12-18 |
| **Cron every 12h for price checks** | Balance between API call costs (SerpAPI) and notification freshness | `server/price_tracker.js` line 435 |

## Timeline

Source: `git log --format="%ai %s" --all`

| Date | Milestone |
|---|---|
| **2025-10-14** | First commit — project scaffolded with Lovable (Vite+React+Shadcn) and "Convert HTML to React" |
| **2025-10-15 – 2025-10-24** | Iterative commits (mostly unnamed "1") — early development |
| **2025-11-13** | "Major Changes — WEBSITE working properly AI isn't fetching data though" |
| **2025-11-16** | "WORKING" — first fully functional state |
| **2025-11-16** | "EVERYTHING IS WORKING EXCEPT FOR SCRAPPER (IP ADD BLOCKED)" — Myntra IP blocking issue |
| **2025-11-17** | "BEFORE PRESENTATION — WORKING" — presentation milestone |
| **2025-12-12** | "major changes", "working 1:18 1212" |
| **2025-12-14** | "14-12 UPDATES" |
| **2026-06-25** | Activity resumes after ~6 month gap |
| **2026-07-08** | "Update README.md" |
| **2026-07-09** | Latest commit — "docs: add interface screenshot assets for documentation" |

## Code Quality Assessment

| Criterion | Rating | Evidence |
|---|---|---|
| **Test coverage** | None | No test framework configured, no test files with assertions. `server/test.js` is a smoke script, not a test suite. Coverage is 0% / unmeasured. |
| **Error handling** | Consistent but basic | Every Express route handler has a try/catch block (35 catch blocks counted in `main_api_server.js`). Errors are logged with emoji prefixes and return appropriate HTTP status codes (400/404/500). However, error responses leak raw `error.message` strings to clients in several places (e.g., lines 774, 839, 1595). |
| **Secrets management** | Poor | Gmail app password committed in `server/.env.example` line 18. Google OAuth client ID hardcoded in `App.tsx` line 44. MongoDB URIs hardcoded in all Python files. See *Security & Secrets Handling* for full inventory. |
| **Code organization** | Low modularity | Backend is a single 1,884-line file (`main_api_server.js`) containing schemas, routes, helper functions, and email logic. No route separation, no controller/service pattern, no middleware extraction. Frontend is better organized with pages/components/hooks separation. |
| **Authentication** | Insecure | Plaintext passwords (line 209 TODO), no server-side session validation, no auth middleware on API endpoints, `localStorage`-only state. Google OAuth trusts client-sent data. See *Security & Secrets Handling*. |
| **CI/CD** | Absent | No CI config files of any kind (GitHub Actions, GitLab CI, etc.) found in the repository. |
| **Dependency hygiene** | Mixed | Lockfiles exist for all three package managers. However, `frontend/package.json` includes `mongoose` (^8.19.3) and `express` (^5.1.0) as dependencies — these are server-side libraries and should not be in a React SPA. Likely scaffold leftovers. Python dependencies are fully pinned in `requirements.txt`. No audit has been run — unconfirmed whether any packages have known vulnerabilities. |
| **Code duplication** | Notable | Email transporter creation logic is copy-pasted across 4 locations: register (line 222), resend-verification (line 407), debug endpoint (line 113), and `price_tracker.js` (line 18). Search scoring logic is duplicated across `searchLocalDBMultiple`, `searchAmazonForComparison`, `searchFlipkartForComparison`, `searchNikeForComparison` with minor variations. |
| **Documentation** | Above average | README with screenshots, `.env.example`, `MIGRATION_SUMMARY.md`, `API_MIGRATION_GUIDE.md`, `QUICK_START.md`, `TESTING_GUIDE.md`, `DEVELOPER_REFERENCE.md`, `VERIFICATION_CHECKLIST.md` all exist in `server/`. Inline JSDoc comments on most API endpoints. |
| **Git hygiene** | Poor | Most commit messages are "1" or single-word descriptions. Only a few commits have meaningful messages (e.g., "BEFORE PRESENTATION — WORKING", "major changes"). No conventional commits, no branching strategy visible. |

## Interview Talking Points

1. **"How does your search scoring algorithm handle irrelevant results?"** → See *Algorithms & Models > Product Search Scoring* — the keyword-weighted scoring system with accessory exclusion lists and demographic penalty logic in `searchLocalDBMultiple()`.

2. **"Why did you choose a 70/30 image-text embedding ratio for CLIP, and how does the style recommendation system work end-to-end?"** → See *Algorithms & Models > CLIP-based Style Embedding* and *Outfit Recommendation* — the embedding generation pipeline, cosine similarity ranking, and category-constrained outfit rules.

3. **"What were the challenges of migrating from Flask to Express, and how did you maintain feature parity?"** → See *Decisions & Trade-offs* row on Flask → Express and *Architecture* section — the migration summary documents specific endpoint-by-endpoint porting and the decision to keep the AI service in Python.

4. **"How do you handle the dual data ingestion paths (scraper vs. SerpAPI) with different field naming conventions?"** → See *Known Limitations / Tech Debt* row on field name inconsistency and *Data Model > products Collection* — the `imageUrl`/`image` and `productUrl`/`link` normalization pattern.

5. **"What security improvements would you make before deploying this to production?"** → See *Security & Secrets Handling* and *Known Limitations / Tech Debt* — plaintext passwords, hardcoded OAuth client ID, no JWT/sessions, no rate limiting, .env.example containing credentials.

## Resume Bullets

Draft bullets tied to documented features — edit before using. Numbers are only included where derivable from the repo.

1. **Built a multi-source price comparison engine** that queries Amazon India, Flipkart, and Nike in parallel via SerpAPI, applies a custom keyword-scoring algorithm with accessory exclusion and demographic-aware penalties, and returns ranked results sorted by price — implemented across 4 search functions in a single Express server (`server/main_api_server.js`, ~1,884 lines).

2. **Designed and implemented an AI outfit recommendation system** using CLIP (ViT-B-32) embeddings with a 70% image / 30% text weighting formula, cosine similarity ranking, and category-constrained outfit rules, served via a Flask microservice (`ai/ai_api.py`, `ai/process_embeddings.py`).

3. **Built a Playwright-based web scraping pipeline** that collects fashion product data from 3 e-commerce sites (Myntra, SuperKicks, VegNonVeg) across 6 brands, with checkpoint/resume capability, automatic category classification, and deduplication — targeting 3,000+ products per run (`ai/scraper.py`).

4. **Implemented an automated price-drop alert system** using node-cron (12-hour schedule), SerpAPI + Cheerio HTML fallback for price checking, deduplication of notifications, and batch email delivery via Nodemailer with styled HTML templates (`server/price_tracker.js`, 464 lines).

5. **Migrated the backend from Flask to Express** while maintaining feature parity across unconfirmed — verify exact endpoint count manually API endpoints, adding MongoDB bulk upsert for product deduplication and Mongoose schema validation — documented in `server/MIGRATION_SUMMARY.md`.

## Confidence Notes

### Contributor & Authorship Analysis

Source: `git shortlog -sn --all`

- **Aswin Chettri**: 71 commits — primary author of all application code.
- **gpt-engineer-app[bot]**: 8 commits — this is the Lovable (formerly GPT Engineer) bot that generated the initial React scaffold. Its commits are the earliest in the repo (2025-10-14) and include the initial Vite+React+Shadcn setup and "Convert HTML to React" / "Update Navbar and Homepage" refactors.

This is effectively a **single-author project** with AI-assisted scaffolding.

### Vendored / Bootstrapped Code

The following code was **not written by the repository author** and should not be attributed as original work:

| Code | Origin | Scope | Evidence |
|---|---|---|---|
| `frontend/src/components/ui/` (49 files, ~3,491 lines) | **Shadcn UI** — generated component wrappers around Radix UI primitives | All files in this directory are Shadcn CLI output, not hand-written | Standard Shadcn file structure; `frontend/components.json` (434 bytes) is the Shadcn CLI config file |
| Initial project scaffold | **Lovable (GPT Engineer)** | Vite + React + TypeScript + Tailwind + Shadcn boilerplate | First commit: `[skip lovable] Use tech stack vite_react_shadcn_ts_20250728_minor`; `main.tsx` contains `// cite: uploaded:skenlrd/value-scout-01/...` comments; 8 commits from `gpt-engineer-app[bot]` |
| `frontend/src/hooks/use-toast.ts` (re-export) | **Shadcn UI** | 1 file, 1 line | Located in `components/ui/use-toast.ts` (85 bytes) |

The **Tech Stack** section lists Radix UI and Shadcn dependencies — these are consumed via the vendored `components/ui/` directory, not directly authored. The **Repo Scale** section separates vendored lines (~3,491) from original source (~9,907).

### Sampling Disclosure

The following areas were **sampled rather than fully read** due to file size:

| File/Area | Size | What was read | What was skipped |
|---|---|---|---|
| `frontend/src/pages/Home.tsx` | 22,921 bytes | Not read — documented based on file name, size, and directory context | Full contents |
| `frontend/src/pages/Wishlist.tsx` | 15,797 bytes | Not read | Full contents |
| `frontend/src/components/ProductCard.tsx` | 18,535 bytes | Not read | Full contents |
| `frontend/src/components/Navbar.tsx` | 11,233 bytes | Not read | Full contents |
| `frontend/src/pages/Auth.tsx` | 10,967 bytes | Not read | Full contents |
| `frontend/src/pages/Compare.tsx` | 9,586 bytes | Not read | Full contents |
| `scraper_checkpoint.json` | 171,517 bytes | First ~5KB (truncated by viewer) | Remaining ~166KB of product IDs |
| `frontend/src/components/ui/*` | 49 files | Listed via directory listing, not individually read | File contents (known to be Shadcn-generated) |
| `server/MIGRATION_SUMMARY.md` | 8,007 bytes | Fully read | — |
| `ai/test_api.py`, `ai/test_product_id.py` | 259, 516 bytes | Not read | Full contents |

The following areas were **fully read**:
- `server/main_api_server.js` (all 1,884 lines)
- `server/price_tracker.js` (all 464 lines)
- `server/package.json`, `frontend/package.json`, root `package.json`
- `ai/ai_api.py` (all 183 lines)
- `ai/process_embeddings.py` (all 161 lines)
- `ai/scraper.py` (all 559 lines)
- `ai/scraper_v2.py` (all 359 lines)
- `ai/requirements.txt`
- `frontend/src/App.tsx`, `frontend/src/main.tsx`, `frontend/src/hooks/useAuth.ts`
- `frontend/vite.config.ts`, `frontend/index.html`
- `server/.env.example`, `server/test.js`, `server/MIGRATION_SUMMARY.md`
- `tools/check-imports.js`
- `.gitignore`, `README.md`

### Other Uncertainty

| Claim | Confidence | Reason |
|---|---|---|
| Scraper checkpoint has ~1,400+ product IDs | Medium | Estimated by visually scanning the checkpoint JSON; file is 171KB but exact count not programmatically verified |
| The backend was originally Flask | High | Documented in `MIGRATION_SUMMARY.md` with specific endpoint-by-endpoint mapping; file named `MIGRATION_SUMMARY.md` |
| Apple OAuth endpoint is non-functional (no token verification) | High | Code at line 542-580 directly creates a user with any `appleId` string — no Apple token validation API call |
| `.env.example` contains a real Gmail app password | Medium | Line 18 contains `EMAIL_PASSWORD=bire mumg gliz bwka` which matches Gmail app password format (4 groups of 4 lowercase letters), but it could be expired or example-only |
| The project was scaffolded with Lovable | High | First commit message explicitly says "[skip lovable] Use tech stack vite_react_shadcn_ts_20250728_minor"; `main.tsx` has `// cite: uploaded:skenlrd/value-scout-01/...` comments |
| The ~6-month gap (Dec 2025 to Jun 2026) represents a pause | Medium | Based on git log — no commits found between 2025-12-14 and 2026-06-25, but commits may exist in other branches or the history may have been squashed when pushing to this GitHub repo |
| Google OAuth client ID in App.tsx is functional | Unconfirmed — verify manually | Client ID `813492076332-...` is hardcoded but I cannot confirm if the Google Cloud project is still active |
| Frontend `mongoose` and `express` in package.json are unused | High | These are listed as dependencies in `frontend/package.json` (lines 51, 54) but a React SPA should not use them client-side; likely leftover from copy-paste or Lovable scaffold |
| No automated test suite exists | High | `server/test.js` is 477 bytes, no test runner (jest/mocha/vitest) in any `package.json`, no `__tests__` directories found |
| Lines of code count (~13,398) | Medium | Counted via PowerShell `Get-Content | Measure-Object -Line` across .js/.ts/.tsx/.py/.css/.html/.md files excluding node_modules/dist/.git/.venv. Includes markdown documentation files and CSS — not a pure "code only" count. |
