# AgriFlow AI — FastAPI Real Live Backend

This directory contains the standalone **FastAPI (Python)** backend core providing genuine real-time data streams for AgriFlow AI.

---

## ⚡ Features

1. **IoT Telematics Ingestion & Real-Time Broadcast**:
   - `POST /api/telematics/ingest`: Accepts physical GPS & reefer temperature packets from hardware sensors.
   - `WebSocket /ws/telematics/{trip_id}`: Streams genuine live hardware telemetry to viewing screens.
2. **APMC Mandi Auction Real Data Feed**:
   - `GET /api/prices`: Returns verified APMC mandi records with arrival dates and market yard sources.
   - `WebSocket /ws/prices`: Broadcasts live auction updates and price changes.
3. **Order Lifecycle Gateway**:
   - `GET /api/orders` & `POST /api/orders`: Order creation and retrieval.
   - `WebSocket /ws/orders/{order_id}`: Real-time order progress updates.

---

## 🚀 Setup and Run

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the Server
```bash
uvicorn main:app --reload --port 8000
```

The API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## 🛰️ How to Send Real Hardware Telemetry

You can test pushing real sensor packets to the server:

```bash
curl -X POST http://localhost:8000/api/telematics/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "trip_id": "TRK-CONS-ROAD-9021",
    "latitude": 17.2403,
    "longitude": 78.4294,
    "temperature_celsius": 5.8,
    "humidity_percent": 86.0,
    "speed_kmh": 58.0,
    "location_name": "NH 44 Expressway Toll Plaza",
    "device_id": "TS-OBD2-TRACKER-01"
  }'
```

All connected dashboards will immediately update with the real telemetry packet.
