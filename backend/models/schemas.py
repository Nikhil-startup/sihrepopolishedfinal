from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class TelemetryIngestPayload(BaseModel):
    trip_id: str = Field(..., description="Trip code e.g. TRK-CONS-ROAD-9021")
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    temperature_celsius: float = Field(..., description="Cold-chain container temperature")
    humidity_percent: float = Field(..., ge=0.0, le=100.0)
    speed_kmh: Optional[float] = 0.0
    location_name: Optional[str] = "Live Highway Ingestion Point"
    device_id: Optional[str] = "OBD2-IOT-SENSOR-01"
    timestamp: Optional[str] = None

class TelemetryBroadcastPacket(BaseModel):
    trip_id: str
    latitude: float
    longitude: float
    location_name: str
    temperature_celsius: float
    target_temp_celsius: float = 6.0
    humidity_percent: float
    spoilage_risk: str
    reefer_active: bool
    speed_kmh: float
    is_live: bool = True
    device_id: str
    last_updated: str

class ApmcPriceRecord(BaseModel):
    id: str
    commodity: str
    market_name: str
    district: str
    state: str
    current_price: float
    previous_price: float
    change: float
    percentage_change: float
    bulk_buyer_opportunity_price: float
    arrival_date: str
    source: str = "Agmarknet / APMC Market Yard"

class PriceUpdatePayload(BaseModel):
    price_id: str
    new_price: float

class OrderItem(BaseModel):
    id: str
    name: str
    quantity_kg: float
    price_per_kg: float

class OrderCreateRequest(BaseModel):
    items: Optional[List[Dict[str, Any]]] = []
    total_quantity_kg: float
    subtotal: Optional[float] = 0.0
    total_amount: float
    buyer_name: str
    delivery_location: str
    buyer_id: Optional[str] = None
    produce_name: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
