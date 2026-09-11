# AgriFlow AI — Frontend Prototype

AgriFlow AI is a multimodal, multilingual agricultural supply chain and logistics frontend prototype bridging Farmers, Consumers/Buyers, and Logistics Operators with dynamic pricing algorithms, route optimization, low-bandwidth UI, and farm-to-fork traceability.

This project is a **100% frontend-only Next.js application**. It requires **NO running backend servers, databases, or cloud functions**. All demo features, user sessions, marketplace transactions, fleet tracking, and farmer stock updates run entirely in the browser with local persistence.

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
AgriFlow AI
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
│   ├── context/               # React Contexts (Auth, Cart, I18n, Theme, Bandwidth, Tracking)
│   ├── data/                  # Centralized Demo Data Layer & localStorage helpers
│   ├── i18n/                  # Multilingual translation dictionaries (7 Indian languages)
│   ├── lib/                   # Utility helpers and form validators
│   ├── services/              # Pure TypeScript business logic and simulated services
│   └── types/                 # TypeScript type definitions
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

---

## 🌐 Supported Languages

AgriFlow supports 7 Indian languages across all portals:
- **English** (`en`)
- **Telugu** (`te` - తెలుగు)
- **Tamil** (`ta` - தமிழ்)
- **Malayalam** (`ml` - മലയാളം)
- **Hindi** (`hi` - हिन्दी)
- **Bengali** (`bn` - বাংলা)
- **Marathi** (`mr` - मराठी)

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
```
