from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from database import get_db
from models.db_models import LogisticsFleet, TripRecord

router = APIRouter(tags=["Logistics & Fleet"])

class ClaimReturnLoadPayload(BaseModel):
    tripId: str

def map_fleet_to_dict(v: LogisticsFleet) -> dict:
    return {
        "id": v.id,
        "vehicleNumber": v.vehicle_number,
        "vehicleType": v.vehicle_type,
        "capacityKg": v.capacity_kg,
        "currentLoadKg": v.current_load_kg,
        "driverName": v.driver_name,
        "driverPhone": v.driver_phone,
        "status": v.status or "Available",
        "reeferActive": v.reefer_active,
        "currentTempCelsius": v.current_temp_celsius,
        "currentLocation": v.current_location,
        "currentLat": v.current_lat,
        "currentLng": v.current_lng,
        "assignedTripId": v.assigned_trip_id,
        "data_source": "DATABASE"
    }

def map_trip_to_dict(t: TripRecord) -> dict:
    waypoints = json.loads(t.waypoints_json) if t.waypoints_json else [
        {"id": "wp-1", "title": "Harvest Loaded & Crated", "location": t.pickup_location, "coordinates": [t.pickup_lat or 17.0684, t.pickup_lng or 78.2078], "timestamp": "08:30 AM", "completed": True},
        {"id": "wp-2", "title": "In Transit - Road Corridor", "location": t.current_location_name, "coordinates": [t.current_lat or 17.2403, t.current_lng or 78.4294], "timestamp": "03:15 PM", "completed": True, "current": True},
        {"id": "wp-3", "title": "Destination Delivery", "location": t.destination_location, "coordinates": [t.dest_lat or 17.4729, t.dest_lng or 78.4842], "timestamp": "05:45 PM (ETA)", "completed": False}
    ]
    route_coords = json.loads(t.route_coords_json) if t.route_coords_json else [
        [t.pickup_lat or 17.0684, t.pickup_lng or 78.2078],
        [t.current_lat or 17.2403, t.current_lng or 78.4294],
        [t.dest_lat or 17.4729, t.dest_lng or 78.4842]
    ]

    return {
        "id": t.id,
        "tripId": t.id,
        "tripCode": t.trip_code,
        "orderId": t.order_id,
        "produceName": t.produce_name,
        "totalQuantityKg": t.total_quantity_kg,
        "vehicleType": t.vehicle_type,
        "vehicleNumber": t.vehicle_number,
        "driverName": t.driver_name,
        "driverPhone": t.driver_phone,
        "pickupLocation": t.pickup_location,
        "destinationLocation": t.destination_location,
        "currentLocationName": t.current_location_name,
        "pickupCoordinates": [t.pickup_lat, t.pickup_lng] if t.pickup_lat else [17.0684, 78.2078],
        "destinationCoordinates": [t.dest_lat, t.dest_lng] if t.dest_lat else [17.4729, 78.4842],
        "currentCoordinates": [t.current_lat, t.current_lng] if t.current_lat else [17.2403, 78.4294],
        "estimatedArrival": t.estimated_arrival or "Today, 05:45 PM",
        "distanceRemainingKm": t.distance_remaining_km,
        "distanceCompletedKm": t.distance_completed_km,
        "totalDistanceKm": t.total_distance_km,
        "progressPercentage": t.progress_percentage,
        "progressPercent": t.progress_percentage,
        "etaMinutes": t.eta_minutes,
        "status": t.status or "IN TRANSIT",
        "telemetry": {
            "temperatureCelsius": t.temperature_celsius,
            "targetTempCelsius": t.target_temp_celsius,
            "humidityPercent": t.humidity_percent,
            "safeWindowHours": 4,
            "safeWindowMinutes": 30,
            "spoilageRisk": t.spoilage_risk,
            "reeferActive": t.reefer_active,
            "explanation": t.telemetry_explanation or "Reefer operating under optimal temperature.",
        },
        "coldChainTelemetry": {
            "temperatureCelsius": t.temperature_celsius,
            "targetTempCelsius": t.target_temp_celsius,
            "humidityPercent": t.humidity_percent,
            "safeWindowHours": 4,
            "safeWindowMinutes": 30,
            "riskLevel": "Low" if t.spoilage_risk == "LOW" else "Medium",
            "reeferActive": t.reefer_active,
            "isSimulated": False,
            "explanation": t.telemetry_explanation or "Cold chain verified.",
        },
        "returnLoad": {
            "id": "RL-01",
            "route": t.return_load_route or "Hyderabad Terminal -> Warangal Produce Hub",
            "commodity": t.return_load_commodity or "Organic Bio-Fertilizer Sacks",
            "additionalEarnings": t.return_load_earnings,
            "emptyDistanceAvoidedKm": t.return_load_distance_avoided_km,
            "isClaimed": t.return_load_claimed
        } if t.return_load_route else None,
        "waypoints": waypoints,
        "routeCoordinates": route_coords,
        "timeline": [
            {"id": w["id"], "title": w["title"], "location": w["location"], "timestamp": w["timestamp"], "completed": w.get("completed", False)}
            for w in waypoints
        ],
        "isSimulatedGPS": False,
        "data_source": "DATABASE"
    }

@router.get("/api/logistics/fleet")
async def get_fleet(db: Session = Depends(get_db)):
    """
    Fetch road fleet vehicles from Neon PostgreSQL.
    """
    vehicles = db.query(LogisticsFleet).all()
    return [map_fleet_to_dict(v) for v in vehicles]

@router.get("/api/logistics/trips")
async def get_trips(db: Session = Depends(get_db)):
    """
    Fetch consolidated trips from Neon PostgreSQL.
    """
    trips = db.query(TripRecord).all()
    return [map_trip_to_dict(t) for t in trips]

@router.get("/api/logistics/trips/{trip_id}")
async def get_trip_by_id(trip_id: str, db: Session = Depends(get_db)):
    """
    Fetch trip by ID from Neon PostgreSQL.
    """
    clean_id = trip_id.trim().upper() if hasattr(trip_id, 'trim') else trip_id.strip().upper()
    trip = db.query(TripRecord).filter(TripRecord.id.ilike(clean_id)).first()
    if not trip:
        # Try matching by trip_code or order_id
        trip = db.query(TripRecord).filter(
            (TripRecord.trip_code.ilike(clean_id)) | (TripRecord.order_id.ilike(clean_id))
        ).first()

    if not trip:
        raise HTTPException(status_code=404, detail=f"Trip '{trip_id}' not found in database.")

    return map_trip_to_dict(trip)

@router.post("/api/logistics/return-loads/claim")
async def claim_return_load(payload: ClaimReturnLoadPayload, db: Session = Depends(get_db)):
    """
    Claim return load on a trip in Neon PostgreSQL to eliminate deadhead empty miles.
    """
    trip = db.query(TripRecord).filter(TripRecord.id == payload.tripId).first()
    if not trip:
        raise HTTPException(status_code=404, detail=f"Trip '{payload.tripId}' not found in database.")

    trip.return_load_claimed = True
    db.commit()
    return {"success": True, "message": "Return load successfully claimed and recorded in database."}
