from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, status, Depends
from datetime import datetime
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
import json
import uuid

from database import get_db, SessionLocal
from models.db_models import OrderRecord
from models.schemas import OrderCreateRequest, OrderStatusUpdate

router = APIRouter(tags=["Orders"])

order_subscribers: Dict[str, List[WebSocket]] = {}

def map_order_to_dict(o: OrderRecord) -> dict:
    return {
        "id": o.id,
        "orderDate": o.created_at.strftime("%Y-%m-%d %H:%M") if o.created_at else datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": o.status or "Confirmed",
        "totalQuantityKg": o.quantity_kg,
        "totalAmount": o.total_amount,
        "subtotal": o.subtotal or (o.total_amount - (o.road_logistics_fee or 0) - (o.platform_fee or 0)),
        "roadLogisticsFee": o.road_logistics_fee or 2800.0,
        "platformFee": o.platform_fee or 400.0,
        "buyerName": o.buyer_name,
        "deliveryLocation": o.delivery_location,
        "logisticsId": o.trip_id or "TRK-CONS-ROAD-9021",
        "escrowStatus": o.escrow_status or "HELD",
        "data_source": "DATABASE"
    }

@router.get("/api/orders")
async def get_orders(db: Session = Depends(get_db)):
    """
    Fetch all purchase orders directly from Neon PostgreSQL.
    """
    orders = db.query(OrderRecord).order_by(OrderRecord.created_at.desc()).all()
    return [map_order_to_dict(o) for o in orders]

@router.get("/api/orders/{order_id}")
async def get_order_by_id(order_id: str, db: Session = Depends(get_db)):
    """
    Fetch single purchase order from Neon PostgreSQL.
    """
    order = db.query(OrderRecord).filter(OrderRecord.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found in database.")
    return map_order_to_dict(order)

@router.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def create_order(req: OrderCreateRequest, db: Session = Depends(get_db)):
    """
    Create a real purchase order and commit it to Neon PostgreSQL.
    """
    new_id = f"ORD-CONS-{uuid.uuid4().hex[:6].upper()}"
    logistics_fee = 2800.0
    plat_fee = 400.0
    subtotal = req.subtotal if req.subtotal > 0 else (req.total_amount - logistics_fee - plat_fee)

    order_record = OrderRecord(
        id=new_id,
        buyer_id=req.buyer_id if hasattr(req, 'buyer_id') else None,
        buyer_name=req.buyer_name,
        produce_name=getattr(req, 'produce_name', 'Fresh Produce Sourcing Lot'),
        quantity_kg=req.total_quantity_kg,
        total_amount=req.total_amount,
        subtotal=subtotal,
        road_logistics_fee=logistics_fee,
        platform_fee=plat_fee,
        delivery_location=req.delivery_location,
        status="Confirmed",
        escrow_status="HELD",
        trip_id="TRK-CONS-ROAD-9021",
        created_at=datetime.utcnow()
    )
    db.add(order_record)
    db.commit()
    db.refresh(order_record)

    return map_order_to_dict(order_record)

@router.patch("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, update: OrderStatusUpdate, db: Session = Depends(get_db)):
    """
    Update order status in Neon PostgreSQL and broadcast on WebSocket.
    """
    order = db.query(OrderRecord).filter(OrderRecord.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found in database.")

    order.status = update.status
    db.commit()

    order_dict = map_order_to_dict(order)

    # Broadcast on WebSocket
    if order_id in order_subscribers:
        dead = []
        payload = json.dumps({
            "order_id": order_id,
            "status": update.status,
            "timestamp": datetime.now().strftime("%H:%M:%S IST")
        })
        for ws in order_subscribers[order_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)
        for d in dead:
            order_subscribers[order_id].remove(d)

    return order_dict

@router.websocket("/ws/orders/{order_id}")
async def websocket_order_endpoint(websocket: WebSocket, order_id: str):
    await websocket.accept()
    if order_id not in order_subscribers:
        order_subscribers[order_id] = []
    order_subscribers[order_id].append(websocket)

    db = SessionLocal()
    try:
        order = db.query(OrderRecord).filter(OrderRecord.id == order_id).first()
        if order:
            await websocket.send_text(json.dumps(map_order_to_dict(order)))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if order_id in order_subscribers and websocket in order_subscribers[order_id]:
            order_subscribers[order_id].remove(websocket)
    finally:
        db.close()
