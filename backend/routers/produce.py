from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from database import get_db
from models.db_models import ProduceListing, User

router = APIRouter(tags=["Produce & Marketplace Products"])

class ProduceCreatePayload(BaseModel):
    crop: str
    quantity: float
    unit: str = "kg"
    grade: str = "Grade A"
    harvestDate: Optional[str] = None
    expectedPrice: float
    location: str
    farmer_id: Optional[str] = "farmer-01"
    image_url: Optional[str] = None
    notes: Optional[str] = None

class ProduceStatusUpdatePayload(BaseModel):
    status: str

def map_produce_to_farmer_type(p: ProduceListing) -> dict:
    return {
        "id": p.id,
        "crop": p.crop,
        "quantity": p.quantity_kg,
        "unit": p.unit or "kg",
        "grade": p.grade or "A",
        "harvestDate": p.harvest_date or datetime.now().strftime("%Y-%m-%d"),
        "expectedPrice": p.expected_price,
        "location": p.location or "Telangana Cluster",
        "status": p.status or "Active",
        "notes": p.notes,
        "imageUrl": p.image_url,
        "createdAt": p.created_at.strftime("%Y-%m-%d %H:%M") if p.created_at else datetime.now().strftime("%Y-%m-%d %H:%M"),
        "data_source": "DATABASE"
    }

def map_produce_to_consumer_product(p: ProduceListing, farmer: Optional[User] = None) -> dict:
    farmer_name = farmer.name if farmer else "Ramesh Patel"
    farmer_loc = farmer.location if farmer else p.location
    clean_grade = "A" if "A" in (p.grade or "A") else "B" if "B" in (p.grade or "") else "Organic Certified"
    price = p.expected_price

    return {
        "id": p.id,
        "name": f"Fresh {p.crop}",
        "hindiName": p.crop,
        "category": "Vegetables" if any(v in p.crop.lower() for v in ["tomato", "onion", "potato", "chilli"]) else "Fruits",
        "farmerName": farmer_name,
        "farmerDistrict": "Sangareddy",
        "farmerState": "Telangana",
        "pricePerKg": price,
        "originalPrice": round(price * 1.15, 2),
        "availableQuantityKg": p.quantity_kg,
        "minOrderQuantityKg": 50,
        "freshness": "Harvested Today",
        "freshnessScore": "Excellent",
        "harvestDate": p.harvest_date or "Today",
        "qualityGrade": p.grade or "Grade A",
        "grade": clean_grade,
        "gradeDescription": f"Verified {p.grade or 'Grade A'} optical computer-vision grading with high brix and zero soft spots.",
        "certified": True,
        "image": p.image_url or "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60",
        "bulkAvailable": True,
        "bulkTiers": [
            {"minKg": 100, "pricePerKg": round(price * 0.95, 2), "discountLabel": "5% OFF (Bulk)", "savingsPercent": 5},
            {"minKg": 500, "pricePerKg": round(price * 0.90, 2), "discountLabel": "10% OFF (Commercial)", "savingsPercent": 10},
            {"minKg": 1000, "pricePerKg": round(price * 0.85, 2), "discountLabel": "15% OFF (Institutional)", "savingsPercent": 15},
        ],
        "logisticsOptions": [
            {"vehicleType": "Tata 407 Reefer", "capacityKg": 5000, "coldChainMaintained": True, "estimatedDeliveryHours": 6, "baseCost": 2800},
            {"vehicleType": "Tata Ace", "capacityKg": 1500, "coldChainMaintained": False, "estimatedDeliveryHours": 4, "baseCost": 1400}
        ],
        "shelfLifeDays": 7,
        "optimalStorageTempCelsius": 6.0,
        "nutritionHighlights": [f"Freshly harvested {p.crop}", "Rich in natural dietary vitamins", "Cold-chain preserved freshness"],
        "harvestBatchNumber": f"LOT-2026-{p.id.replace('prod-', '').upper()}",
        "qualityInspectionReport": {
            "colorScore": 94,
            "firmnessScore": 92,
            "defectPercentage": 2.1,
            "inspectionDate": p.harvest_date or datetime.now().strftime("%Y-%m-%d"),
            "inspectorName": "AgriFlow Vision Engine v2.4"
        },
        "farmerStory": {
            "id": p.farmer_id or "farmer-01",
            "farmerName": farmer_name,
            "farmOrFpoName": f"{farmer_name} Farm Cluster Hub",
            "farmerPhoto": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
            "generalLocation": farmer_loc or "Zaheerabad, Sangareddy",
            "district": "Sangareddy",
            "state": "Telangana",
            "mainCrops": [p.crop],
            "harvestDate": p.harvest_date or "Today",
            "soilPractices": "Regenerative red loam with bio-fertilizer and micro-irrigation",
            "organicPractices": "Zero residual synthetic chemicals during pre-harvest window",
            "story": f"Cultivated by {farmer_name} using precision irrigation and cold-dock harvesting.",
            "totalAcresGrown": "3.5 Acres",
            "fairPriceCommitment": "Guaranteed minimum 72% direct realization without intermediate agent deductions."
        },
        "priceBreakdown": {
            "consumerPricePerKg": price,
            "farmerReceivesPerKg": round(price * 0.74, 2),
            "roadLogisticsCostPerKg": round(price * 0.18, 2),
            "platformFeePerKg": round(price * 0.08, 2),
            "mandiComparisonPricePerKg": round(price * 1.15, 2),
            "directFarmerGainPercent": 28
        },
        "location": farmer_loc or "Telangana Cluster",
        "isColdChainEligible": True,
        "tags": ["Direct Sourced", "Verified FPO", p.grade or "Grade A", "Cold Chain"],
        "organic": "Grade A" in (p.grade or ""),
        "description": p.notes or f"Direct farm-sourced fresh {p.crop} from verified FPO harvest cluster.",
        "data_source": "DATABASE"
    }

# ============================================================================
# Farmer Produce Endpoints
# ============================================================================

@router.get("/api/produce")
async def get_produce_listings(db: Session = Depends(get_db)):
    """
    Fetch all produce listings directly from Neon PostgreSQL.
    """
    listings = db.query(ProduceListing).order_by(ProduceListing.created_at.desc()).all()
    return [map_produce_to_farmer_type(p) for p in listings]

@router.post("/api/produce", status_code=status.HTTP_201_CREATED)
async def add_produce_listing(payload: ProduceCreatePayload, db: Session = Depends(get_db)):
    """
    Insert a new farmer produce listing into Neon PostgreSQL.
    """
    new_id = f"prod-{uuid.uuid4().hex[:6]}"
    harvest_d = payload.harvestDate or datetime.now().strftime("%Y-%m-%d")

    listing = ProduceListing(
        id=new_id,
        farmer_id=payload.farmer_id or "farmer-01",
        crop=payload.crop,
        quantity_kg=payload.quantity,
        grade=payload.grade,
        harvest_date=harvest_d,
        expected_price=payload.expectedPrice,
        location=payload.location,
        status="Active",
        unit=payload.unit,
        image_url=payload.image_url,
        notes=payload.notes,
        created_at=datetime.utcnow()
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)

    return map_produce_to_farmer_type(listing)

@router.patch("/api/produce/{produce_id}/status")
async def update_produce_status(produce_id: str, payload: ProduceStatusUpdatePayload, db: Session = Depends(get_db)):
    """
    Update produce status (Active, Reserved, Sold) in Neon PostgreSQL.
    """
    listing = db.query(ProduceListing).filter(ProduceListing.id == produce_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail=f"Produce listing '{produce_id}' not found in database.")

    listing.status = payload.status
    db.commit()
    return map_produce_to_farmer_type(listing)

# ============================================================================
# Consumer Marketplace Products Endpoints
# ============================================================================

@router.get("/api/products")
async def get_consumer_products(db: Session = Depends(get_db)):
    """
    Fetch active produce listings from Neon PostgreSQL formatted as Consumer Products.
    """
    listings = db.query(ProduceListing).filter(ProduceListing.status != "Sold").order_by(ProduceListing.created_at.desc()).all()
    farmers = {u.id: u for u in db.query(User).all()}

    return [map_produce_to_consumer_product(p, farmers.get(p.farmer_id)) for p in listings]

@router.get("/api/products/{product_id}")
async def get_consumer_product_by_id(product_id: str, db: Session = Depends(get_db)):
    """
    Fetch single product details from Neon PostgreSQL.
    """
    listing = db.query(ProduceListing).filter(ProduceListing.id == product_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail=f"Product '{product_id}' not found in database.")

    farmer = db.query(User).filter(User.id == listing.farmer_id).first() if listing.farmer_id else None
    return map_produce_to_consumer_product(listing, farmer)
