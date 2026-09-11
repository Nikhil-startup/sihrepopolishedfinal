from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, status
from datetime import datetime
from typing import Dict, List
import json
import uuid

from models.schemas import OrderCreateRequest, OrderStatusUpdate

router = APIRouter(tags=["Orders"])

# In-memory orders registry
orders_db: Dict[str, dict] = {
    "ORD-HYD-5000": {
        "id": "ORD-HYD-5000",
        "orderDate": "2026-09-08 10:30",
        "status": "In Transit",
        "totalQuantityKg": 5000,
        "totalAmount": 190000,
        "subtotal": 175000,
        "roadLogisticsFee": 12000,
        "platformFee": 3000,
        "buyerName": "Priya Sharma (Retail Buyer)",
        "deliveryLocation": "Bowenpally Wholesale Terminal, Hyderabad",
        "logisticsId": "TRK-CONS-ROAD-9021"
    }
}

order_subscribers: Dict[str, List[WebSocket]] = {}

@router.get("/api/orders")
async def get_orders():
    return list(orders_db.values())

@router.get("/api/orders/{order_id}")
async def get_order_by_id(order_id: str):
    if order_id not in orders_db:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found.")
    return orders_db[order_id]

@router.post("/api/orders", status_code=status.HTTP_201_CREATED)
async def create_order(req: OrderCreateRequest):
    new_id = f"ORD-CONS-{uuid.uuid4().hex[:6].upper()}"
    new_order = {
        "id": new_id,
        "orderDate": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "status": "Confirmed",
        "totalQuantityKg": req.total_quantity_kg,
        "totalAmount": req.total_amount,
        "subtotal": req.subtotal,
        "roadLogisticsFee": 2800,
        "platformFee": 400,
        "buyerName": req.buyer_name,
        "deliveryLocation": req.delivery_location,
        "logisticsId": "TRK-CONS-ROAD-9021"
    }
    orders_db[new_id] = new_order
    return new_order

@router.patch("/api/orders/{order_id}/status")
async def update_order_status(order_id: str, update: OrderStatusUpdate):
    if order_id not in orders_db:
        raise HTTPException(status_code=404, detail=f"Order '{order_id}' not found.")
    orders_db[order_id]["status"] = update.status
    if update.notes:
        orders_db[order_id]["notes"] = update.notes

    # Broadcast on WebSocket
    if order_id in order_subscribers:
        dead = []
        payload = json.dumps({"order_id": order_id, "status": update.status, "timestamp": datetime.now().strftime("%H:%M:%S")})
        for ws in order_subscribers[order_id]:
            try:
                await ws.send_text(payload)
            except Exception:
                dead.append(ws)
        for d in dead:
            order_subscribers[order_id].remove(d)

    return orders_db[order_id]

@router.websocket("/ws/orders/{order_id}")
async def websocket_order_endpoint(websocket: WebSocket, order_id: str):
    await websocket.accept()
    if order_id not in order_subscribers:
        order_subscribers[order_id] = []
    order_subscribers[order_id].append(websocket)

    try:
        if order_id in orders_db:
            await websocket.send_text(json.dumps(orders_db[order_id]))
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        if order_id in order_subscribers and websocket in order_subscribers[order_id]:
            order_subscribers[order_id].remove(websocket)
