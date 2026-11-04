# PlutoPlat Enterprise Architecture & System Blueprint

> **System Blueprint & Technical Specification**  
> **Platform Version:** 2.0.0 Enterprise  
> **Last Verified:** November 2026  
> **Target Production Environment:** Cloudflare Workers Edge + MongoDB Atlas + React Vite SPA

---

## 1. Executive Summary & MVP Matrix

PlutoPlat is an ultra-luxury, institutional-grade real estate ecosystem catering to high-net-worth individuals (HNWIs), family offices, accredited broker agencies, and platform governors.

The platform implements a strict **Three-Tier Role-Based Access Control (RBAC)** architecture directly aligned with the system MVP matrix:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       PLUTOPLAT MVP RBAC MATRIX                                        │
├────┬────────────────────────────────────────────┬──────────────┬──────────────────┬────────────────┤
│ #  │ Feature Capability                         │ User (Buyer) │ Admin (Agent)    │ SuperAdmin     │
├────┼────────────────────────────────────────────┼──────────────┼──────────────────┼────────────────┤
│ 1. │ Search, Browse & Filter Properties         │ YES          │ YES              │ YES            │
│ 2. │ Submit Enquiry / Lead Form                 │ YES          │ NO               │ YES            │
│ 3. │ Manage Profile & Saved Properties          │ YES          │ YES              │ YES            │
│ 4. │ Property Listing CRUD                      │ NO           │ YES (Draft/Pend) │ YES (Full/Appr)│
│ 5. │ View Leads on Own Properties               │ NO           │ YES              │ YES (All Leads)│
│ 6. │ Approve / Reject Property Listings         │ NO           │ NO (Add Pending) │ YES (Moderator)│
│ 7. │ Manage Admins, Users, Roles & Subs         │ NO           │ NO               │ YES (Master)   │
│ 8. │ Platform Analytics & Audit Telemetry       │ NO           │ NO               │ YES (Master)   │
└────┴────────────────────────────────────────────┴──────────────┴──────────────────┴────────────────┘
```

---

## 2. High-Level Architecture Diagram

```
                              ┌──────────────────────────────────┐
                              │        DNS / Cloudflare Edge     │
                              │    (DDoS Guard, SSL/TLS, CDN)    │
                              └─────────────────┬────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 │                                                             │
                 ▼                                                             ▼
   ┌───────────────────────────┐                                 ┌───────────────────────────┐
   │    Frontend SPA (Vite)    │                                 │   Backend Runtime Layer   │
   │  React 18 + Tailwind CSS  │                                 │   Cloudflare Workers /    │
   ├───────────────────────────┤                                 │   Node.js 20+ Express     │
   │ • Consumer Website (Buyer)│                                 ├───────────────────────────┤
   │ • Private Client Portal   │                                 │ • Helmet Security Headers │
   │ • Admin Desk (Agent/Seller│                                 │ • Strict Domain CORS Guard│
   │ • SuperAdmin HQ (Owner)   │                                 │ • Rate Limit & 5-Lockout  │
   │ • Context State Store     │                                 │ • JWT Authenticator (7d)  │
   └─────────────┬─────────────┘                                 │ • RBAC Authorizer Guard   │
                 │                                               └─────────────┬─────────────┘
                 │ (REST API Fetch / JWT Bearer)                               │
                 └─────────────────────────────────────────────────────────────┤
                                                                               ▼
                                                                 ┌───────────────────────────┐
                                                                 │   Data Persistence Tier   │
                                                                 │      (MongoDB Atlas)      │
                                                                 ├───────────────────────────┤
                                                                 │ • users (3 roles + lockout)│
                                                                 │ • properties (geo + verif)│
                                                                 │ • enquiries (leads pipeline│
                                                                 │ • auditlogs (immutable)   │
                                                                 │ • testimonials & alerts   │
                                                                 └───────────────────────────┘
```

---

## 3. Frontend Architecture

### 3.1 Portal Segregation

The frontend application is structured into four distinct presentation domains:

1. **Public Marketplace (`/`, `/properties`, `/property/:id`, `/search`):**
   - Editorial video hero section, dynamic category browser, interactive location carousel, curated featured collection with pagination, testimonials, and brand footer.
2. **Client Portal (`/profile`, `/my-enquiries`, `/favorites`, `/notifications`):**
   - Private dossier for prospective purchasers to track scheduled physical viewings and saved architectural assets.
3. **Agent & Partner Desk (`/admin`, `/admin/properties`, `/admin/leads`, `/admin/profile`):**
   - Dedicated workspace for accredited sellers and brokerages.
   - **Properties CRUD (Draft/Pending):** Agents submit new properties. All submissions are automatically flagged with `isVerified: false` and `status: 'pending'`, awaiting SuperAdmin governance review.
   - **Leads on Own Properties:** Agents exclusively view client acquisition enquiries referencing their own listings.
4. **SuperAdmin HQ (`/superadmin`, `/superadmin/properties`, `/superadmin/leads`, `/superadmin/users`, `/superadmin/audits`, `/superadmin/subscriptions`):**
   - Master platform command station for the Website Owner.
   - **Moderation Queue:** 1-click Approve (`isVerified: true`) or Reject with audit reasons.
   - **Global Leads Matrix:** Panoramic view of all buyer leads across every property with pipeline stage transitions and CSV export.
   - **User & Role Governance:** Direct role escalation (`user` ↔ `admin` ↔ `super_admin`), 5-attempt security lockout releases, and subscription tier allocation.
   - **Immutable Audit Telemetry:** Live search, filtering, and export of actor actions across the entire cluster.

### 3.2 Responsive Layout Hierarchy

```
App.jsx
 ├── PropertyProvider (Global State, CRUD, Leads, Audits, User Store)
 └── BrowserRouter
      ├── GlobalNavbar (Hidden on Auth, Admin & SuperAdmin routes)
      ├── Routes Viewport
      │    ├── Public Consumer Pages
      │    ├── Admin Layout -> Agent Sidebar & Topbar -> Child Views
      │    └── SuperAdmin Layout -> Master Sidebar & Topbar -> Child Views
      └── GlobalFooter (Hidden on Homepage, Auth, Admin & SuperAdmin routes)
```

---

## 4. Backend Architecture & Security Subsystems

### 4.1 Dual Runtime Architecture

The backend supports dual-mode deployment:
- **Cloudflare Workers (`worker.mjs` + `wrangler.jsonc`):** Runs on Cloudflare's global edge network using `nodejs_compat` and `@cloudflare/workers` with zero cold-starts.
- **Traditional Node.js Server (`server.js`):** Standard Express HTTP server with cluster support, graceful shutdown (`SIGTERM`/`SIGINT`), and environment variable autoloading.

### 4.2 Security Pillars

1. **5-Attempt Account Lockout Protection:**
   - Tracks consecutive failed authentication attempts in `User.loginAttempts`.
   - On the 5th failed attempt, the account is locked for 30 minutes (`User.lockUntil = Date.now() + 30 * 60 * 1000`).
   - SuperAdmin has one-click remote override via `PATCH /api/v1/users/:id/status { unlockAccount: true }`.
2. **Cryptographic Password Hashing:**
   - 12-round salted `bcryptjs` hashing applied automatically via Mongoose `pre('save')` hooks.
   - Sensitive password and lockout fields default to `select: false`.
3. **Strict Domain & Origin Verification:**
   - `domainSecurity.js` validates `Origin` and `Host` headers against whitelist (`ALLOWED_ORIGIN`).
   - Rejects unauthorized cross-origin requests with RFC 7807 compliant error payloads.
4. **Immutable Audit Ledger (`auditLogger.js`):**
   - Automatically records every `CREATE`, `UPDATE`, `DELETE`, `LOGIN`, `LOCKOUT`, and `UNBLOCK` action across `AUTH`, `PROPERTY`, `USER`, and `ENQUIRY` modules with actor ID, IP address, user agent, and timestamp.

---

## 5. Data Models Specification

### 5.1 User Model (`models/User.js`)

| Field | Type | Rules & Defaults | Purpose |
|---|---|---|---|
| `name` | String | Required, min: 2, max: 100, trimmed | Legal Representative Name |
| `email` | String | Required, unique, lowercase, regex match | Primary Auth Credential |
| `phone` | String | Required, unique, regex: `^\+?[1-9]\d{9,14}$` | Direct Mobile Number |
| `password` | String | Required, min: 8, `select: false` | Bcrypt Encrypted Passcode |
| `role` | String | Enum: `['user', 'admin', 'super_admin']`, default: `'user'` | RBAC Permission Tier |
| `isActive` | Boolean | Default: `true` | Account State |
| `loginAttempts` | Number | Default: 0, `select: false` | Failed Logins Counter |
| `lockUntil` | Date | Default: `null`, `select: false` | 30-min Lockout Timestamp |
| `savedProperties`| ObjectId[] | Ref: `'Property'` | Buyer Private Favorites |
| `location` | Object | `address`, `city`, `state`, `country`, `pincode` | Primary Residence |

### 5.2 Property Model (`models/Property.js`)

| Field | Type | Rules & Defaults | Purpose |
|---|---|---|---|
| `title` | String | Required, min: 5, max: 150 | Estate Marketing Title |
| `propertyType` | String | Enum: `['villa', 'penthouse', 'apartment', 'townhouse', ...]` | Architectural Type |
| `listingType` | String | Enum: `['sale', 'rent']`, required | Transaction Purpose |
| `price` | Number | Required, min: 1, indexed | Numeric Base Price |
| `owner` | ObjectId | Ref: `'User'`, required, indexed | Seller/Agent Creator |
| `isVerified` | Boolean | Default: `false`, indexed | **SuperAdmin Approval Flag** |
| `isFeatured` | Boolean | Default: `false` | Featured Homepage Hero |
| `location` | Object | `address`, `city`, `coordinates (2dsphere)` | Spatial Geocoding |
| `images` | String[] | Min length: 1, required | High-Resolution Imagery |

### 5.3 Enquiry / Lead Model (`models/Enquiry.js`)

| Field | Type | Rules & Defaults | Purpose |
|---|---|---|---|
| `property` | ObjectId | Ref: `'Property'`, required | Inquired Estate |
| `buyer` | ObjectId | Ref: `'User'`, required | Prospective Purchaser |
| `seller` | ObjectId | Ref: `'User'`, required | Assigned Agent / Owner |
| `status` | String | Enum: `['New', 'Contacted', 'In Progress', 'Scheduled Viewing', 'Closed']` | CRM Pipeline State |
| `message` | String | Required, trimmed | Confidential Brief |

---

## 6. Complete API Catalog

### 6.1 Authentication API (`/api/v1/auth`)

| Method | Endpoint | Access | Rate Limit | Description |
|---|---|---|---|---|
| `POST` | `/auth/register` | Public | 15 req / 15m | Register default user account (`role: 'user'`). |
| `POST` | `/auth/login` | Public | 5 req / 15m | Authenticate credentials. 5-lockout applies. |
| `GET` | `/auth/me` | JWT Bearer | Normal | Retrieve current authenticated session dossier. |

### 6.2 Properties API (`/api/v1/properties`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/properties` | Public | Query verified active properties with pagination. |
| `GET` | `/properties/:id` | Public | Retrieve single property detail; increments views. |
| `POST` | `/properties` | Auth (Agent/SuperAdmin)| Create property. Agent posts `pending`; SuperAdmin posts `approved`. |
| `PUT` | `/properties/:id` | Owner / SuperAdmin | Update listing specs, pricing, or status. |
| `DELETE` | `/properties/:id` | Owner / SuperAdmin | Permanently remove listing from database. |

### 6.3 Users & Admin API (`/api/v1/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users` | `admin`, `super_admin` | Paginated list of all accounts. |
| `GET` | `/users/profile/:id`| Public | Fetch public broker/seller card. |
| `PUT` | `/users/profile/:id`| Owner / SuperAdmin | Update personal profile details. |
| `PATCH`| `/users/:id/status` | `admin`, `super_admin` | Activate/suspend user or reset security lockout. |

### 6.4 Enquiries & Leads API (`/api/v1/enquiries`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/enquiries` | Auth (Buyer) | Submit lead request on property. |
| `GET` | `/enquiries` | Auth (Buyer/Agent/SuperAdmin)| Retrieve enquiries (filtered by actor participation). |

### 6.5 Security & Audit API (`/api/v1/audits`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/audits` | `super_admin`, `admin` | Search and filter immutable security audit logs. |

---

## 7. Cloudflare Deployment Architecture

### 7.1 Wrangler Configuration (`backend/wrangler.jsonc`)

```json
{
  "$schema": "./node_modules/wrangler/config-schema.json",
  "name": "my-node-backend",
  "main": "worker.mjs",
  "compatibility_date": "2026-11-02",
  "compatibility_flags": ["nodejs_compat"],
  "observability": { "enabled": true },
  "vars": {
    "NODE_ENV": "production",
    "ALLOWED_ORIGIN": "http://localhost:5173,https://plutoplat.com",
    "ENFORCE_ORIGIN_CHECK": "false",
    "JWT_EXPIRES_IN": "7d",
    "MAX_LOGIN_ATTEMPTS": "5",
    "LOCK_TIME_MINUTES": "30"
  }
}
```

### 7.2 Secret Provisioning Commands

```bash
# Set MongoDB Atlas URI on Cloudflare Workers
wrangler secret put MONGO_URI

# Set JWT Encryption Key on Cloudflare Workers
wrangler secret put JWT_SECRET

# Deploy Worker to Cloudflare Global Edge
wrangler deploy
```

---

## 8. Verification & Test Confirmation

- **Frontend Compilation:** Vite v8.3.5 production build verified: `2,429 modules transformed` into production assets with **0 errors**.
- **Role Switching:** Built-in Persona Switcher in SuperAdmin & Admin headers facilitates immediate live functional validation between `Buyer (user)`, `Seller/Agent (admin)`, and `Website Owner (super_admin)`.
- **UI Integrity:** All consumer pages (Homepage, Property Detail, Search, Contact, About, FAQ, Login, Register) remain preserved, with public Navbar and Footer omitted on authentication and dashboard routes.
