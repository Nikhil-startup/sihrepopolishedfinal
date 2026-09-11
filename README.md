# AgriFlow — AI-Powered Agricultural Supply Chain Platform

AgriFlow is a multimodal, multilingual end-to-end platform bridging Farmers, Consumers/Buyers, and Logistics Operators with real-time dynamic pricing, route optimization, backend-persisted localization, and transparent farm-to-fork tracking.

---

## 📁 Repository Structure

```text
├── docs/                      # Documentation and presentations
│   ├── AgriFlow_AI_SIH_2026_Presentation.pptx
│   └── FIREBASE_SETUP_GUIDE.md
├── functions/                 # Firebase Cloud Functions
├── public/                    # Static assets, icons, and public media
├── scripts/                   # Setup, build, and generator helper scripts
├── servers/                   # Backend microservices (Express + SQLite/Python)
│   ├── agriflow.db
│   ├── buyer-server.js
│   ├── db.js
│   ├── farmer-server.js
│   ├── logistics-server.js
│   ├── server.py
│   └── start-all.js
├── standalone/                # Standalone preview & offline HTML demos
├── src/                       # Frontend Next.js Application
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/            # Auth routes & public gateways
│   │   ├── farmer/            # Farmer Portal (Produce, Mandi, Orders, etc.)
│   │   ├── consumer/          # Consumer Portal (Marketplace, Cart, Orders, etc.)
│   │   ├── logistics/         # Logistics Portal (Jobs, Trips, Tracking, etc.)
│   │   └── api/               # API Routes & proxy endpoints
│   ├── components/            # Reusable UI Components
│   │   ├── common/            # Shared components (LanguageSelector, Headers, etc.)
│   │   ├── consumer/          # Consumer-specific components
│   │   ├── farmer/            # Farmer-specific components
│   │   └── logistics/         # Logistics-specific components
│   ├── context/               # React Context Providers (AuthContext, I18nContext, etc.)
│   ├── i18n/                  # Multilingual translation dictionaries (7 Indian languages)
│   ├── lib/                   # Utility libraries & Firebase client
│   ├── services/              # API and backend service integrations
│   └── types/                 # TypeScript type definitions
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
└── package.json               # Dependencies and scripts
```

---

## 🌐 Supported Languages (Backend-Persisted)

AgriFlow supports 7 Indian languages across all portals:
- **English** (`en`)
- **Telugu** (`te` - తెలుగు)
- **Tamil** (`ta` - தமிழ்)
- **Malayalam** (`ml` - മലയാളം)
- **Hindi** (`hi` - हिन्दी)
- **Bengali** (`bn` - বাংলা)
- **Marathi** (`mr` - मराठी)

Language preferences belong to the authenticated user account and synchronize across all devices.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend Microservices
```bash
node servers/start-all.js
```

### 3. Start Next.js Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🏗️ Production Build

```bash
npm run build
```
