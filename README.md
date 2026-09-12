# 🌾 AgriFlow AI — Smart India Hackathon (SIH 2026)

> **Next-Generation Multimodal Agricultural Logistics & Intelligence Platform**  
> Bridging Farmers, Institutional Buyers, and Cold-Chain Logistics with Real-Time Price Arbitrage, Spoilage Prevention, Deadhead Mile Elimination, and Cryptographic Farm-to-Fork Traceability.

[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Zero Backend Required](https://img.shields.io/badge/Backend-100%25%20Frontend%20Self--Contained-emerald?style=flat-square)]()
[![Languages](https://img.shields.io/badge/Languages-7%20Indian%20Languages-orange?style=flat-square)]()

---

## 📌 Executive Summary

India is the world's second-largest producer of fruits and vegetables, yet over **₹1.5 lakh crore ($18B) of fresh produce is lost annually** between farm gates and consumers due to fragmented market access, lack of cold-chain monitoring, opaque mandi middlemen markups, and empty return-freight hauls (deadhead miles).

**AgriFlow AI** solves this with an end-to-end digital ecosystem:
1. **Direct Farmer Realization**: Eliminates middleman commissions by connecting Farmer Producer Organizations (FPOs) directly with wholesale bulk buyers.
2. **AI Mandi Price Discovery & Arbitrage**: Compares daily APMC mandi benchmarks across regional yards against direct bulk buyer procurement contracts.
3. **IoT Cold-Chain Telemetry**: Live highway tracking of reefer trucks monitoring temperature, humidity, and remaining safe window before spoilage.
4. **Return-Load Optimization**: Matches returning refrigerated trucks with nearby return cargo to avoid empty haulage, cutting transport costs by up to 35%.
5. **Farm-to-Fork Cryptographic Traceability**: Generates tamper-evident lot ledger certificates with harvesting timestamps, cold-chain custody, and QR validation.
6. **Zero-Backend Client Architecture**: Fully self-contained Next.js application that runs 100% in the browser with `localStorage` persistence, enabling instant offline-resilient demos and zero-config cloud deployments.

---

## 🚀 Key Innovation Highlights

| Feature | Description | Impact |
| :--- | :--- | :--- |
| **Google Authentication + Profile** | Google Identity Services (GIS) login + mandatory 8-field verified Indian profile creation | Instant onboarding with zero external auth server |
| **Multilingual UI (7 Languages)** | English, Telugu, Tamil, Malayalam, Hindi, Bengali, Marathi | Inclusive accessibility for diverse Indian farming clusters |
| **Low-Bandwidth Mode** | 2G/3G optimized data-table interface toggle for low-connectivity rural belts | Rapid load times under severe connectivity constraints |
| **Weather-Shock Simulator** | Monte-Carlo What-If simulation for unseasonal rains, heatwaves, and road blocks | Quantifies salvage value and alternative dispatch channels |
| **Demand Intelligence Map** | Interactive regional GIS map displaying state-level supply deficits and buyer density | Empowers farmers to route produce toward highest-price markets |
| **FPO Group Selling** | Automated freight-pooling for smallholder farmers targeting shared truckloads | Saves up to 40% in logistics freight per kilogram |
| **Reciprocal Trust System** | Two-way verified rating and incident report system for farmers, buyers, and carriers | Builds high-trust peer accountability across transactions |

---

## 👥 Portals & User Personas

### 👨‍🌾 1. Farmer Portal
- **Dashboard (`/farmer/dashboard`)**: Active harvest listings, live buyer purchase orders, and realization metrics.
- **My Produce Inventory (`/farmer/produce`)**: Add, manage, and price produce lots with quality grades (Grade A, A-, B, Organic).
- **Mandi Market Prices (`/farmer/market-prices`)**: APMC price yard benchmarks vs. direct buyer procurement rates with 7-day trend forecasts.
- **Demand Intelligence Map (`/farmer/demand-map`)**: Interactive regional map showing real-time supply deficits and buyer concentrations.
- **AI Decision Center (`/farmer/intelligence`)**: Crop quality inspection, salvage recommendations, and harvest timing guidance.
- **Weather Shock Simulator (`/farmer/weather-shock`)**: Real-time financial risk modeling against extreme rainfall, cold snaps, or transport strikes.
- **Orders & Delivery (`/farmer/orders`)**: Manage buyer contracts, dispatch road tracking, and submit reciprocal ratings.

### 🛒 2. Consumer & Institutional Buyer Portal
- **Marketplace (`/consumer/marketplace`)**: Browse verified farm produce with category filters, quality grades, and cold-chain flags.
- **Transparent Price Breakdown**: Visualizes exact farmer share (75-80%), road logistics share, and platform fee.
- **Multi-Farmer Consolidation**: Automatically aggregates bulk demand orders across local partner farms for single-shipment delivery.
- **Escrow Smart Checkout (`/consumer/checkout`)**: Locks funds in escrow, disbursing automatically upon verified delivery.
- **Procurement Orders & Road Tracking (`/consumer/orders`)**: Live order pipeline with delivery status, impact receipts, and carrier ratings.

### 🚚 3. Logistics & Fleet Operator Portal
- **Fleet Control Hub (`/logistics`)**: Monitor vehicle fleets, active transit trips, and real-time cargo capacity utilization.
- **Live Reefer Telemetry (`/logistics/telemetry`)**: Continuous temperature (°C) and humidity (%) tracking with spoilage risk alerts.
- **Smart Return-Loads (`/logistics/return-loads`)**: Matches empty return hauls with backhaul cargo, increasing operator revenue.
- **Proof of Delivery (POD)**: Geo-verified delivery timestamps and inspection notes.

### 🔍 4. Universal Lot Traceability Ledger (`/traceability/[lotId]`)
- Cryptographically verifiable provenance certificates (e.g. `LOT-2026-7842`).
- Complete custody chain: Farm origin, harvest date, cold seal verification, highway GPS route, and mandi delivery terminal.

---

## 🛠️ Technology Stack

```text
Frontend Framework   : Next.js 16.3.4 (App Router, Turbopack/Webpack)
Core Library         : React 19.2.8 & TypeScript 5
Styling & UI Design  : Tailwind CSS 3.4 & Lucide React Icons
Data Visualization   : Recharts 3.10
Geospatial Mapping   : Leaflet 1.9 & React-Leaflet 5
State & Persistence  : React Contexts (Auth, I18n, Theme, Bandwidth, Tracking) + localStorage
Authentication       : Google Identity Services (GIS) + Client-Side Profile Storage
Image Hosting        : Cloudinary (Direct Unsigned Upload Preset)
Deployment Target    : Vercel / Netlify / Cloudflare Pages (Zero-config static/serverless)
```

---

## 📁 Repository Structure

```text
AgriFlow AI
├── public/                    # Static assets, SVG icons, and fallback imagery
├── docs/                      # Presentation slides (AgriFlow_AI_SIH_2026_Presentation.pptx)
├── src/
│   ├── app/                   # Next.js App Router (42 Compiled Pages)
│   │   ├── consumer/          # Consumer Portal (Marketplace, Cart, Checkout, Orders, Tracking)
│   │   ├── farmer/            # Farmer Portal (Produce, Prices, Demand Map, AI Center, Orders)
│   │   ├── logistics/         # Logistics Portal (Fleet, Reefer Telemetry, Return Loads, Trips)
│   │   ├── profile/           # User Profile Management & Mandatory Profile Creation
│   │   ├── traceability/      # Universal Lot Cryptographic Provenance Ledger
│   │   ├── layout.tsx         # Global Root Layout with Multi-Context Providers
│   │   └── page.tsx           # Platform Portal Hub & Gateway
│   ├── components/            # Reusable UI Components
│   │   ├── common/            # Buttons, Cards, Badges, Modals, LowBandwidthToggle
│   │   ├── consumer/          # CartDrawer, PriceBreakdownCard, MultiFarmerConsolidationCard
│   │   ├── farmer/            # GroupSellingCard, FarmerImpactCard, AddProduceModal
│   │   ├── intelligence/      # CropQualityModal, WhatIfSimulator, DecisionSummaryHero
│   │   ├── reviews/           # RateAndReviewModal, StarRating, CategoryRatings
│   │   └── reports/           # ReportModal (User, Produce, Logistics Incident Reporting)
│   ├── context/               # React Contexts
│   │   ├── AuthContext.tsx    # Google GIS & Demo Session Management + Profile Routing
│   │   ├── I18nContext.tsx    # 7-Language Multilingual Context with Persistent Storage
│   │   ├── CartContext.tsx    # Consumer Shopping Cart & Tiered Bulk Volume Discounts
│   │   ├── BandwidthContext.tsx # High-Speed / Low-Bandwidth 2G-3G Mode Toggle
│   │   └── ThemeContext.tsx   # Dark / Light Theme Toggle
│   ├── data/                  # Centralized Demo Data Layer & localStorage helpers
│   ├── i18n/                  # Complete translation dictionaries:
│   │   ├── en.ts              # English
│   │   ├── te.ts              # Telugu (తెలుగు)
│   │   ├── ta.ts              # Tamil (தமிழ்)
│   │   ├── ml.ts              # Malayalam (മലയാളം)
│   │   ├── hi.ts              # Hindi (हिन्दी)
│   │   ├── bn.ts              # Bengali (বাংলা)
│   │   └── mr.ts              # Marathi (मराठी)
│   ├── lib/                   # Utility helpers, location data (Indian States & Districts), utils
│   ├── services/              # Pure TypeScript business logic with localStorage persistence:
│   │   ├── authService.ts     # Profile CRUD & Google Session Persistence
│   │   ├── farmerService.ts   # Produce Listing CRUD
│   │   ├── consumerService.ts # Marketplace, Sourcing Orders & Bulk Demand Matching
│   │   ├── logisticsService.ts# Fleet & Trip Management
│   │   ├── marketPriceService.ts # APMC Benchmarks & Price Trends
│   │   ├── trackingService.ts # Road Freight Telemetry
│   │   ├── ratingService.ts   # Reciprocal Peer Reviews
│   │   └── reportService.ts   # Incident Reporting Registry
│   └── types/                 # TypeScript type definitions (Farmer, Consumer, Logistics, Review)
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🌐 Supported Languages (7 Indian Languages)

AgriFlow supports 7 Indian languages across all user interfaces:

| Code | Language | Native Script | Primary Target States |
| :--- | :--- | :--- | :--- |
| `en` | **English** | English | Pan-India / Corporates / Institutional Buyers |
| `te` | **Telugu** | తెలుగు | Telangana, Andhra Pradesh |
| `ta` | **Tamil** | தமிழ் | Tamil Nadu |
| `ml` | **Malayalam**| മലയാളം | Kerala |
| `hi` | **Hindi** | हिन्दी | Uttar Pradesh, Madhya Pradesh, Bihar, Rajasthan, Haryana |
| `bn` | **Bengali** | বাংলা | West Bengal |
| `mr` | **Marathi** | मराठी | Maharashtra |

Language preference is persisted in browser storage (`agriflow_cached_lang`) and maintained across all portals without unexpected resets.

---

## 🔐 Authentication & Mandatory Profile Flow

```text
User clicks "Continue with Google"
                │
     Google Identity Services (GIS)
                │
    Google Verification Successful
                │
     Check Stored User Profile
       ┌────────┴────────┐
       ▼                 ▼
   Complete          Incomplete / New User
       │                 │
       │                 ▼
       │      Mandatory Profile Creation Page
       │      • Full Name (pre-filled from Google)
       │      • Mobile Number (10 digits starting 6-9)
       │      • State & District (cascading selector)
       │      • Area / Village
       │      • Pincode (6 digits)
       │      • Full Address
       │      • User Role (Farmer / Buyer / Logistics)
       │                 │
       │                 ▼
       │         Save to localStorage
       │                 │
       └────────┬────────┘
                │
                ▼
      Role-Based Dashboard
      • Farmer     -> /farmer/dashboard
      • Buyer      -> /consumer/dashboard
      • Logistics  -> /logistics
```

---

## 🔑 Instant Demo Personas

For evaluators and judges, one-click pitch logins are available on all login screens:

- **Farmer Persona**: Ramesh Reddy (Shadnagar FPO, Telangana) — 5 Acres, Tomato & Onion
- **Buyer Persona**: Priya Sharma (Hyderabad Wholesale Terminal) — Bulk Procurement
- **Logistics Persona**: Gurdeep Singh (Tata Reefer Fleet) — Reefer TS 08 UB 4192

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.18.0 or higher
- npm (Node Package Manager)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Nikhil-startup/sihrepopolishedfinal.git
cd sihrepopolishedfinal
npm install
```

### 2. Configure Environment (Optional)
Create a `.env.local` file in the root directory (optional for image uploads):
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tm4unkuu
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=agriflow_uploads
```

### 3. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Production Build & Verification

To verify full compilation with zero TypeScript errors:

```bash
npm run build
```

This compiles all 42 static and dynamic routes into production-ready standalone artifacts ready for immediate Vercel, Netlify, or AWS Amplify deployment.

---

## 📜 License

Developed for the **Smart India Hackathon (SIH 2026)**.  
MIT License — see [`LICENSE`](LICENSE) for details.
