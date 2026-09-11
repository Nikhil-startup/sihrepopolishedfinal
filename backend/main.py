from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from contextlib import asynccontextmanager

from routers.telematics import router as telematics_router
from routers.market_prices import router as market_prices_router
from routers.orders import router as orders_router
from routers.storage import router as storage_router
from database import engine, Base
import models.db_models  # Ensure models are registered with Base metadata

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables in Neon PostgreSQL on startup
    try:
        Base.metadata.create_all(bind=engine)
        print("Neon PostgreSQL tables verified and created successfully.")
    except Exception as e:
        print(f"Warning: Database initialization error: {e}")
    yield

app = FastAPI(
    title="AgriFlow AI Live Backend",
    description="Real-time IoT Telematics, APMC Mandi Auction Feed, Order Lifecycle, and Neon Database API",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include real-time and storage routers
app.include_router(telematics_router)
app.include_router(market_prices_router)
app.include_router(orders_router)
app.include_router(storage_router)

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

