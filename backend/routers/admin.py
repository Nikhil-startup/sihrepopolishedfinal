from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import get_db
from models.db_models import User, ProduceListing, OrderRecord, LogisticsFleet, TripRecord, ApmcPriceTable, ReviewRecord

router = APIRouter(tags=["Admin Governance"])

@router.get("/api/admin/metrics")
async def get_admin_metrics(db: Session = Depends(get_db)):
    """
    Real SQL aggregated metrics across Neon PostgreSQL tables.
    Zero hardcoded numbers.
    """
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_produce = db.query(func.count(ProduceListing.id)).scalar() or 0
    total_orders = db.query(func.count(OrderRecord.id)).scalar() or 0
    gross_volume = db.query(func.sum(OrderRecord.total_amount)).scalar() or 0.0
    escrow_held = db.query(func.sum(OrderRecord.total_amount)).filter(OrderRecord.escrow_status == "HELD").scalar() or 0.0
    active_fleet = db.query(func.count(LogisticsFleet.id)).scalar() or 0
    active_trips = db.query(func.count(TripRecord.id)).filter(TripRecord.status == "IN TRANSIT").scalar() or 0
    total_mandi_feeds = db.query(func.count(ApmcPriceTable.id)).scalar() or 0
    total_reviews = db.query(func.count(ReviewRecord.id)).scalar() or 0

    return {
        "totalUsers": total_users,
        "totalProduceListings": total_produce,
        "totalOrders": total_orders,
        "grossTransactionValue": float(gross_volume),
        "escrowLockedValue": float(escrow_held),
        "activeFleetVehicles": active_fleet,
        "activeDispatchedTrips": active_trips,
        "apmcTrackedFeeds": total_mandi_feeds,
        "verifiedReviews": total_reviews,
        "data_source": "DATABASE_SQL_AGGREGATE"
    }
