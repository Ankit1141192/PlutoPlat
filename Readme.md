# PlutoPlat — Ultra-Luxury Architectural Real Estate Platform

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2B%20React%2018-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind%20CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2020%2B-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![Cloudflare Workers](https://img.shields.io/badge/Edge%20Deploy-Cloudflare%20Workers-F38020?style=flat&logo=cloudflare)](https://workers.cloudflare.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)

PlutoPlat is an enterprise-grade real estate platform designed for ultra-luxury architectural portfolios, private client acquisitions, verified broker representation, and institutional governance.

---

## 1. MVP Role-Based Access Control (RBAC) Matrix

PlutoPlat strictly segregates platform capabilities across three user roles: **Buyer (`user`)**, **Seller / Broker (`admin`)**, and **Website Owner (`super_admin`)**.

| # | Feature Capability | User (Buyer) | Admin (Seller / Agent) | SuperAdmin (Website Owner) |
|---|---|:---:|:---:|:---:|
| **1.** | **Search, Browse & Filter Properties** | **Yes** | **Yes** | **Yes** |
| **2.** | **Submit Enquiry / Lead Form** | **Yes** | **No** | **Yes** |
| **3.** | **Manage Profile & Saved Properties** | **Yes** | **Yes** | **Yes** |
| **4.** | **Property Listing CRUD** | **No** | **Yes** *(Draft / Pending Review)* | **Yes** *(Full CRUD & Direct Approval)* |
| **5.** | **View Leads / Enquiries on Own Properties**| **No** | **Yes** *(Only Assigned Listings)* | **Yes** *(Global Platform-wide Leads)* |
| **6.** | **Approve / Reject Property Listings** | **No** | **Add (Pending Review)** | **Yes** *(1-Click Approve / Reject)* |
| **7.** | **Manage Admins, Users, Roles & Subscriptions**| **No** | **No** | **Yes** *(Full Governance)* |
| **8.** | **Platform Analytics & Audit Logs** | **No** | **No** | **Yes** *(Live Security Telemetry)* |

---

## 2. Platform Architecture & Portals

### 🌟 1. Consumer Website & Buyer Portal
- **Public Showroom (`/`, `/properties`, `/property/:id`):** Full-screen video hero, curated categories, interactive city carousel, and detailed property specifications.
- **Search & Discovery (`/search`):** Search by location, architectural style, price ranges, and verified status.
- **Client Account (`/profile`, `/my-enquiries`, `/favorites`):** Confidential portfolio tracker, viewing requests, and saved residences.
- **Authentication (`/login`, `/register`, `/forgot-password`, `/reset-password`):** Clean standalone authentication flow without distracting public navbars or footers. Includes real-time validation and eye toggle for password visibility.

### 👔 2. Admin Portal — Seller & Agent Desk (`/admin`)
- **Dashboard (`/admin`):** Listing performance, active live inventory, pending moderation count, and incoming inquiries.
- **My Properties (`/admin/properties`):** Submit new estates (automatically held in `Pending Review` status awaiting SuperAdmin approval), edit own listings, or delete obsolete records.
- **Leads on Own Properties (`/admin/leads`):** Inquiries submitted by prospective purchasers on the agent's properties with stage update controls (`New`, `Contacted`, `In Progress`, `Scheduled Viewing`, `Closed`).
- **Notifications (`/admin/notifications`):** Immediate alerts when listings are approved by SuperAdmin or new inquiries arrive.
- **Agent Profile (`/admin/profile`):** Broker licensing, RERA accreditation numbers, agency details, and contact coordinates.

### 👑 3. SuperAdmin HQ — Website Owner Command Station (`/superadmin`)
- **Platform Overview (`/superadmin`):** Comprehensive KPIs (Catalog health, conversion rates, registered users, and security lockout protection).
- **Property Moderation & Approvals (`/superadmin/properties`):** 1-Click Approve (`isVerified: true`) or Reject listings submitted by sellers and agents, toggle featured placement, or create verified listings directly.
- **Global Leads Pipeline (`/superadmin/leads`):** Panoramic view of all buyer inquiries across all properties with real-time status transitions and CSV export.
- **User & Role Governance (`/superadmin/users`):** Promote users to `admin` or `super_admin`, toggle account suspension, and unlock credentials locked after 5 consecutive failed logins.
- **Subscription Tiers (`/superadmin/subscriptions`):** Plan management (Free Buyer, Pro Premier Agent ₹4,999/mo, Sovereign VIP Concierge ₹19,999/mo).
- **Security & Audit Logs (`/superadmin/audits`):** Live immutable audit ledger tracking all actor actions across `AUTH`, `PROPERTY`, `USER`, `ENQUIRY`, and `ADMIN` modules.

---

## 3. Technology Stack

- **Frontend:** React 18, Vite 8, Tailwind CSS, Lucide Icons, React Router v7.
- **Backend Runtime:** Dual Mode:
  - **Edge Mode:** Cloudflare Workers (`worker.mjs` + `wrangler.jsonc`) using `nodejs_compat`.
  - **Server Mode:** Node.js 20+ with Express 4 (`server.js`).
- **Database:** MongoDB Atlas with Mongoose ODM (Connection Pooling & 2dsphere Geospatial Indexing).
- **Security:**
  - 12-round salted `bcryptjs` password encryption.
  - 5-attempt failed login threshold with 30-minute automatic account lockout.
  - JWT Bearer tokens with 7-day expiration.
  - Helmet security headers and strict domain/origin whitelist enforcement.
  - Immutable audit logging for governance and regulatory compliance.

---

## 4. Project Directory Structure

```
PlutoPlat/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/
│   │   ├── auditController.js     # Audit log queries
│   │   ├── authController.js      # Auth & 5-attempt lockout logic
│   │   ├── enquiryController.js   # Lead submission & query
│   │   ├── propertyController.js  # Property CRUD & verification
│   │   ├── testimonialController.js # Client reviews
│   │   └── userController.js      # Profile, role updates & status
│   ├── middlewares/
│   │   ├── auth.js                # JWT verification & RBAC authorize()
│   │   ├── domainSecurity.js      # Strict origin and host validation
│   │   ├── errorHandler.js        # Centralized exception formatter
│   │   └── rateLimiter.js         # API & auth rate limiters
│   ├── models/
│   │   ├── AuditLog.js            # Immutable audit ledger schema
│   │   ├── Enquiry.js             # Lead pipeline schema
│   │   ├── Notifications.js       # System notifications schema
│   │   ├── Property.js            # Listing schema (isVerified flag)
│   │   ├── Testimonial.js         # Client feedback schema
│   │   └── User.js                # User schema (3 roles + lockout)
│   ├── routes/v1/                 # REST API routing layer
│   ├── app.js                     # Express application configuration
│   ├── server.js                  # Node.js HTTP server entry point
│   ├── worker.mjs                 # Cloudflare Worker edge entry point
│   └── wrangler.jsonc             # Cloudflare Workers configuration
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── PropertyContext.jsx# Core state, CRUD & role switching
│   │   ├── PlutoPlat/
│   │   │   ├── Admin/             # Agent & Seller Portal
│   │   │   │   ├── Components/    # AdminLayout, Navigation
│   │   │   │   └── Pages/         # Dashboard, PropertyList, Leads, Profile
│   │   │   ├── SuperAdmin/        # Website Owner Command Station
│   │   │   │   ├── Components/    # SuperAdminLayout, Master Navigation
│   │   │   │   └── Pages/         # Dashboard, Properties, Leads, Users, Audits, Subscriptions
│   │   │   ├── Components/        # Consumer UI (Hero, Location, Featured, Navbar, Footer)
│   │   │   ├── Pages/             # Home, Properties, Details, Auth, Profile
│   │   │   └── Services/          # Central API service client (Api.js)
│   │   ├── App.jsx                # Layout router with route guards
│   │   └── main.jsx               # React DOM bootstrap
│   └── package.json
├── ARCHITECTURE.md                # In-depth system specification blueprint
└── Readme.md                      # Project manual & deployment guide
```

---

## 5. Local Development Setup

### Prerequisites
- Node.js version 18.0.0 or higher
- npm or pnpm
- MongoDB Atlas cluster connection string

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables (.env)
cp .dev.vars .env   # Or create .env with variables below

# Run local development server
npm run dev
# Server will start on http://localhost:5000 (API: http://localhost:5000/api/v1)
```

**Required `.env` Variables:**
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/plutoplat?retryWrites=true&w=majority
JWT_SECRET=PlutoPlatSecureSecretKey2026
JWT_EXPIRES_IN=7d
ALLOWED_ORIGIN=http://localhost:5173,http://localhost:3000
ENFORCE_ORIGIN_CHECK=false
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME_MINUTES=30
```

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
# Frontend will start on http://localhost:5173
```

---

## 6. Testing the Three Portals

The frontend includes a built-in **Testing Persona Switcher** in both the Admin and SuperAdmin top headers, allowing you to instantly switch between all three personas:

1. **Buyer Experience (`/`):** Browse luxury estates, save to favorites, or register a new client account at `/register`.
2. **Seller / Agent Desk (`/admin`):** Access the partner workstation, submit new property listings (which appear with the `In Review` badge), and review buyer leads.
3. **SuperAdmin HQ (`/superadmin`):** Review pending submissions in the moderation queue, approve or reject listings with 1 click, inspect global leads, and review live security audit telemetry.

---

## 7. Cloudflare Workers Deployment

PlutoPlat backend is pre-configured for Cloudflare Workers deployment:

```bash
cd backend

# Authenticate with Cloudflare
npx wrangler login

# Set production secrets on Cloudflare Workers
npx wrangler secret put MONGO_URI
npx wrangler secret put JWT_SECRET

# Deploy to Cloudflare Edge
npx wrangler deploy
```

Once deployed, update the `BASE_URL` in `frontend/src/PlutoPlat/Services/Api.js` to point to your live Worker URL (e.g., `https://my-node-backend.<account>.workers.dev/api/v1`).

---

## 8. License & Proprietary Notice

© 2026 PlutoPlat. All Rights Reserved. Proprietary software for private estate brokerage and digital asset provenance.
