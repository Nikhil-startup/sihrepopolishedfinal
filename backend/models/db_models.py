from datetime import datetime
from sqlalchemy import Column, String, Float, Boolean, DateTime, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    phone = Column(String(20), unique=True, index=True, nullable=True)
    email = Column(String(120), unique=True, index=True, nullable=True)
    name = Column(String(100), nullable=False)
    role = Column(String(20), nullable=False, default="farmer")  # farmer | consumer | logistics | admin
    state = Column(String(50), nullable=True)
    district = Column(String(50), nullable=True)
    location = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    produce_listings = relationship("ProduceListing", back_populates="farmer")

class ProduceListing(Base):
    __tablename__ = "produce_listings"

    id = Column(String(64), primary_key=True, index=True)
    farmer_id = Column(String(64), ForeignKey("users.id"), nullable=False)
    crop = Column(String(80), nullable=False, index=True)
    quantity_kg = Column(Float, nullable=False)
    grade = Column(String(10), nullable=False, default="A")
    harvest_date = Column(String(30), nullable=True)
    expected_price = Column(Float, nullable=False)
    location = Column(String(150), nullable=True)
    status = Column(String(20), default="Active")  # Active | Reserved | Sold
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer = relationship("User", back_populates="produce_listings")

class OrderRecord(Base):
    __tablename__ = "orders"

    id = Column(String(64), primary_key=True, index=True)
    buyer_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    buyer_name = Column(String(100), nullable=False)
    produce_name = Column(String(100), nullable=False)
    quantity_kg = Column(Float, nullable=False)
    total_amount = Column(Float, nullable=False)
    delivery_location = Column(String(200), nullable=False)
    status = Column(String(30), default="CONFIRMED")  # CONFIRMED | IN TRANSIT | DELIVERED
    escrow_status = Column(String(30), default="HELD")  # HELD | RELEASED | REFUNDED
    trip_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ApmcPriceTable(Base):
    __tablename__ = "apmc_prices"

    id = Column(String(64), primary_key=True, index=True)
    commodity = Column(String(80), nullable=False, index=True)
    market_name = Column(String(100), nullable=False, index=True)
    district = Column(String(50), nullable=False)
    state = Column(String(50), nullable=False)
    current_price = Column(Float, nullable=False)
    previous_price = Column(Float, nullable=False)
    change = Column(Float, default=0.0)
    percentage_change = Column(Float, default=0.0)
    bulk_buyer_opportunity_price = Column(Float, nullable=False)
    arrival_date = Column(String(30), nullable=False)
    source = Column(String(100), default="APMC Market Yard")
    updated_at = Column(DateTime, default=datetime.utcnow)

class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    trip_id = Column(String(64), index=True, nullable=False)
    device_id = Column(String(64), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String(150), nullable=True)
    temperature_celsius = Column(Float, nullable=False)
    humidity_percent = Column(Float, nullable=False)
    speed_kmh = Column(Float, default=0.0)
    spoilage_risk = Column(String(10), default="LOW")
    reefer_active = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
