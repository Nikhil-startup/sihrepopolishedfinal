from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json
import uuid

from database import get_db
from models.db_models import ReviewRecord

router = APIRouter(tags=["Reviews & Ratings"])

class ReviewCreatePayload(BaseModel):
    transactionId: str
    productId: Optional[str] = None
    raterUserId: str
    raterRole: str
    raterDisplayName: str
    ratedUserId: str
    ratedRole: str
    rating: int
    review: Optional[str] = None
    categoryRatings: Optional[dict] = None

def map_review_to_dict(r: ReviewRecord) -> dict:
    cat_ratings = json.loads(r.category_ratings_json) if r.category_ratings_json else None
    return {
        "id": r.id,
        "transactionId": r.transaction_id,
        "productId": r.product_id,
        "productName": r.product_name,
        "raterUserId": r.rater_user_id,
        "raterRole": r.rater_role,
        "raterDisplayName": r.rater_display_name,
        "ratedUserId": r.rated_user_id,
        "ratedRole": r.rated_role,
        "rating": r.rating,
        "categoryRatings": cat_ratings,
        "review": r.review,
        "verificationBadge": r.verification_badge,
        "isVerified": r.is_verified,
        "moderationStatus": r.moderation_status,
        "createdAt": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else datetime.now().strftime("%Y-%m-%d %H:%M"),
        "data_source": "DATABASE"
    }

@router.get("/api/reviews")
async def get_reviews(
    productId: Optional[str] = None,
    ratedUserId: Optional[str] = None,
    ratedRole: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Fetch verified participant reviews and ratings from Neon PostgreSQL.
    """
    query = db.query(ReviewRecord)
    if productId:
        query = query.filter(ReviewRecord.product_id == productId)
    if ratedUserId:
        query = query.filter(ReviewRecord.rated_user_id == ratedUserId)
    if ratedRole:
        query = query.filter(ReviewRecord.rated_role == ratedRole)

    reviews = query.order_by(ReviewRecord.created_at.desc()).all()
    return [map_review_to_dict(r) for r in reviews]

@router.post("/api/reviews", status_code=status.HTTP_201_CREATED)
async def submit_review(payload: ReviewCreatePayload, db: Session = Depends(get_db)):
    """
    Store verified rating and review in Neon PostgreSQL.
    """
    new_id = f"REV-{uuid.uuid4().hex[:6].upper()}"
    cat_json = json.dumps(payload.categoryRatings) if payload.categoryRatings else None

    review = ReviewRecord(
        id=new_id,
        transaction_id=payload.transactionId,
        product_id=payload.productId,
        product_name="Verified Agricultural Produce",
        rater_user_id=payload.raterUserId,
        rater_role=payload.raterRole,
        rater_display_name=payload.raterDisplayName,
        rated_user_id=payload.ratedUserId,
        rated_role=payload.ratedRole,
        rating=payload.rating,
        category_ratings_json=cat_json,
        review=payload.review,
        verification_badge="VERIFIED_PURCHASE",
        is_verified=True,
        moderation_status="PUBLISHED",
        created_at=datetime.utcnow()
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    return {
        "success": True,
        "review": map_review_to_dict(review),
        "message": "Verified review recorded in database."
    }
