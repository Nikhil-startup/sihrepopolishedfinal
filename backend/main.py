from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from routers.telematics import router as telematics_router
from routers.market_prices import router as market_prices_router
from routers.orders import router as orders_router

app = FastAPI(
    title="AgriFlow AI Live Backend",
    description="Real-time IoT Telematics, APMC Mandi Auction Feed, and Order Lifecycle API",
    version="1.0.0"
)

# Enable CORS for Next.js frontend (localhost:3000 and production ports)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include real-time routers
app.include_router(telematics_router)
app.include_router(market_prices_router)
app.include_router(orders_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AgriFlow AI Live Backend Core",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
