from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid

from database import get_db
from models.db_models import ReportRecord

router = APIRouter(tags=["Reports & Safety"])

class ReportCreatePayload(BaseModel):
    reporterUserId: str
    reporterRole: str
    reporterDisplayName: str
    reportedUserId: str
    reportedRole: str
    reportType: str
    reason: str
    description: Optional[str] = None
    transactionId: Optional[str] = None
    productId: Optional[str] = None
    orderItemId: Optional[str] = None
    reviewId: Optional[str] = None

def map_report_to_dict(r: ReportRecord) -> dict:
    return {
        "id": r.id,
        "reporterUserId": r.reporter_user_id,
        "reporterRole": r.reporter_role,
        "reporterDisplayName": r.reporter_display_name,
        "reportedUserId": r.reported_user_id,
        "reportedRole": r.reported_role,
        "reportType": r.report_type,
        "reason": r.reason,
        "description": r.description,
        "transactionId": r.transaction_id,
        "productId": r.product_id,
        "orderItemId": r.order_item_id,
        "reviewId": r.review_id,
        "status": r.status or "UNDER_REVIEW",
        "createdAt": r.created_at.strftime("%Y-%m-%d %H:%M") if r.created_at else datetime.now().strftime("%Y-%m-%d %H:%M"),
        "data_source": "DATABASE"
    }

@router.get("/api/reports")
async def get_reports(userId: Optional[str] = None, db: Session = Depends(get_db)):
    """
    Fetch incident reports from Neon PostgreSQL.
    """
    query = db.query(ReportRecord)
    if userId:
        query = query.filter(ReportRecord.reporter_user_id == userId)
    reports = query.order_by(ReportRecord.created_at.desc()).all()
    return [map_report_to_dict(r) for r in reports]

@router.post("/api/reports", status_code=status.HTTP_201_CREATED)
async def submit_report(payload: ReportCreatePayload, db: Session = Depends(get_db)):
    """
    Store an incident or violation report in Neon PostgreSQL.
    """
    new_id = f"REP-{uuid.uuid4().hex[:6].upper()}"
    report = ReportRecord(
        id=new_id,
        reporter_user_id=payload.reporterUserId,
        reporter_role=payload.reporterRole,
        reporter_display_name=payload.reporterDisplayName,
        reported_user_id=payload.reportedUserId,
        reported_role=payload.reportedRole,
        report_type=payload.reportType,
        reason=payload.reason,
        description=payload.description,
        transaction_id=payload.transactionId,
        product_id=payload.productId,
        order_item_id=payload.orderItemId,
        review_id=payload.reviewId,
        status="UNDER_REVIEW",
        created_at=datetime.utcnow()
    )
    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "success": True,
        "reportId": report.id,
        "status": report.status,
        "message": "Incident report successfully recorded in PostgreSQL safety registry."
    }
