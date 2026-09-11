from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from contextlib import asynccontextmanager

from routers.telematics import router as telematics_router
from routers.market_prices import router as market_prices_router
from routers.orders import router as orders_router
from routers.produce import router as produce_router
from routers.logistics import router as logistics_router
from routers.reviews import router as reviews_router
from routers.reports import router as reports_router
from routers.intelligence import router as intelligence_router
from routers.admin import router as admin_router
from routers.storage import router as storage_router

from database import engine, Base
import models.db_models  # Ensure models are registered with Base metadata
from seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables in Neon PostgreSQL on startup
    try:
        Base.metadata.create_all(bind=engine)
        print("[Neon] PostgreSQL tables verified successfully.")
        # Ensure initial development benchmark records exist in database
        seed_database()
    except Exception as e:
        print(f"Warning: Database initialization or seed error: {e}")
    yield

app = FastAPI(
    title="AgriFlow AI Authoritative Backend",
    description="Neon PostgreSQL API, IoT Telematics, APMC Mandi Auction Feed, Order & Produce Lifecycle",
    version="1.1.0",
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

# Include authoritative database routers
app.include_router(produce_router)
app.include_router(orders_router)
app.include_router(market_prices_router)
app.include_router(logistics_router)
app.include_router(telematics_router)
app.include_router(intelligence_router)
app.include_router(reviews_router)
app.include_router(reports_router)
app.include_router(admin_router)
app.include_router(storage_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "AgriFlow AI Live Backend Core",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S IST"),
        "version": "1.1.0",
        "database": "Neon PostgreSQL"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
