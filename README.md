# AgriFlow AI — Frontend Only

AgriFlow AI is a multimodal, multilingual agricultural supply chain and logistics **frontend prototype** bridging Farmers, Consumers/Buyers, and Logistics Operators with dynamic pricing algorithms, route optimization, and real-time cold chain tracking.

This is a **100% frontend-only Next.js application** built with demo data stored in `localStorage`. No backend servers or database connections required for local development.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Library**: React 19, Tailwind CSS
- **Language**: TypeScript
- **Icons & Charts**: Lucide React, Recharts
- **Mapping**: Leaflet & React-Leaflet
- **Data & Storage**: Centralized Demo Layer (`src/data/`), `localStorage`, `sessionStorage`

---

## 📁 Project Structure

```text
agriflow-ai-frontend/
├── public/                    # Static assets and icons
├── docs/                      # Project presentation documentation
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin Command Center
│   │   ├── consumer/          # Consumer Portal (Marketplace, Cart, Orders, Tracking)
│   │   ├── farmer/            # Farmer Portal (Produce, Market Prices, AI Decision Center)
│   │   ├── logistics/         # Logistics Portal (Fleet, Trips, Reefer Telemetry)
│   │   ├── traceability/      # Universal Lot Cryptographic Provenance Ledger
│   │   ├── layout.tsx         # Root Layout with Context Providers
│   │   └── page.tsx           # Platform Portal Hub & Gateway
│   ├── components/            # Reusable UI Components
│   ├── config/                # Pricing, scoring, and UI configuration
│   ├── context/               # React Contexts (Auth, Cart, Theme, Bandwidth, Tracking)
│   ├── data/                  # Centralized Demo Data Layer & localStorage helpers
│   ├── lib/                   # Utility helpers and form validators
│   ├── services/              # Pure TypeScript business logic
│   └── types/                 # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🌐 Languages

AgriFlow uses **English only** in this frontend-only version. All UI text is hardcoded in English.

Previous language support (Telugu, Tamil, Malayalam, Hindi, Bengali, Marathi) has been removed. The `src/i18n/` directory is no longer present.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Personas

One-click pitch logins are available on all login screens:

- **Farmer Portal**: Ramesh Reddy (Shadnagar FPO)
- **Consumer Portal**: Priya Sharma (Hyderabad Wholesale)
- **Logistics Portal**: Gurdeep Singh (Tata Reefer Fleet)
- **Admin Command Center**: Accessible directly at `/admin`

---

## 🏗️ Production Build

```bash
npm run build
npm start
```

---

## ✅ What's Removed

- ❌ `backend/` — FastAPI Python server
- ❌ `src/i18n/` — Language translation files (en.ts, te.ts, ta.ts, ml.ts, hi.ts, bn.ts, mr.ts)
- ❌ `.env.local` — Backend environment configuration
- ❌ Neon PostgreSQL dependencies

---

## 📝 Notes

- All data is **demo data** stored in `src/data/demoData.ts` and `localStorage`
- UI is English-only
- No backend API calls — fully self-contained
- Perfect for prototyping, demos, and UI testing

