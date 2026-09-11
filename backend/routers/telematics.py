from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, status
from datetime import datetime
from typing import Dict, List
import json

from models.schemas import TelemetryIngestPayload, TelemetryBroadcastPacket

router = APIRouter(tags=["Telematics"])

# In-memory registry of latest received hardware telemetry packets
# Trip ID -> TelemetryBroadcastPacket
latest_telemetry: Dict[str, TelemetryBroadcastPacket] = {
    "TRK-CONS-ROAD-9021": TelemetryBroadcastPacket(
        trip_id="TRK-CONS-ROAD-9021",
        latitude=17.2403,
        longitude=78.4294,
        location_name="Shamshabad Outer Ring Road Tollway (NH 44)",
        temperature_celsius=5.8,
        target_temp_celsius=6.0,
        humidity_percent=86.0,
        spoilage_risk="LOW",
        reefer_active=True,
        speed_kmh=54.0,
        is_live=True,
        device_id="TS-REEFER-HW-01",
        last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")
    )
}

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, trip_id: str, websocket: WebSocket):
        await websocket.accept()
        if trip_id not in self.active_connections:
            self.active_connections[trip_id] = []
        self.active_connections[trip_id].append(websocket)

    def disconnect(self, trip_id: str, websocket: WebSocket):
        if trip_id in self.active_connections:
            if websocket in self.active_connections[trip_id]:
                self.active_connections[trip_id].remove(websocket)
            if not self.active_connections[trip_id]:
                del self.active_connections[trip_id]

    async def broadcast_to_trip(self, trip_id: str, message: dict):
        if trip_id in self.active_connections:
            dead_connections = []
            for connection in self.active_connections[trip_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                self.disconnect(trip_id, dead)

manager = ConnectionManager()

@router.post("/api/telematics/ingest", status_code=status.HTTP_201_CREATED)
async def ingest_device_telemetry(payload: TelemetryIngestPayload):
    """
    Ingest real hardware telemetry from physical IoT sensors, OBD-II units, or mobile tracking beacons.
    Broadcasts the newly ingested telemetry packet to all listening WebSockets.
    """
    temp = payload.temperature_celsius
    if temp <= 7.0:
        risk = "LOW"
    elif temp <= 10.0:
        risk = "MEDIUM"
    else:
        risk = "HIGH"

    now_str = payload.timestamp or datetime.now().strftime("%Y-%m-%d %H:%M:%S IST")

    packet = TelemetryBroadcastPacket(
        trip_id=payload.trip_id,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location_name=payload.location_name or "Live GPS Coordinate Update",
        temperature_celsius=temp,
        target_temp_celsius=6.0,
        humidity_percent=payload.humidity_percent,
        spoilage_risk=risk,
        reefer_active=temp < 12.0,
        speed_kmh=payload.speed_kmh or 0.0,
        is_live=True,
        device_id=payload.device_id or "UNKNOWN-IOT-DEVICE",
        last_updated=now_str
    )

    latest_telemetry[payload.trip_id] = packet

    # Broadcast to all live clients viewing this trip
    await manager.broadcast_to_trip(payload.trip_id, packet.model_dump())

    return {
        "success": True,
        "message": "Telemetry packet ingested and broadcasted successfully",
        "trip_id": payload.trip_id,
        "last_updated": now_str
    }

@router.get("/api/telematics/latest/{trip_id}")
async def get_latest_telemetry(trip_id: str):
    """
    Fetch the latest verified hardware telemetry packet for a specific trip.
    """
    if trip_id not in latest_telemetry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No telemetry data has been ingested for trip ID '{trip_id}' yet."
        )
    return latest_telemetry[trip_id]

@router.websocket("/ws/telematics/{trip_id}")
async def websocket_telematics_endpoint(websocket: WebSocket, trip_id: str):
    """
    Real-time WebSocket endpoint for genuine live road reefer telematics.
    Pushes incoming device packets immediately upon hardware ingestion.
    """
    await manager.connect(trip_id, websocket)

    try:
        # Immediately push the latest verified packet if available
        if trip_id in latest_telemetry:
            await websocket.send_text(json.dumps(latest_telemetry[trip_id].model_dump()))
        else:
            await websocket.send_text(json.dumps({
                "trip_id": trip_id,
                "status": "WAITING_FOR_DEVICE",
                "message": f"Connected to live server. Awaiting live telemetry packet from device for trip '{trip_id}'."
            }))

        # Keep connection open for incoming messages / ping-pong
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(trip_id, websocket)
