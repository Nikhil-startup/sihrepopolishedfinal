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
    farmer_id = Column(String(64), ForeignKey("users.id"), nullable=True)
    crop = Column(String(80), nullable=False, index=True)
    quantity_kg = Column(Float, nullable=False)
    grade = Column(String(20), nullable=False, default="Grade A")
    harvest_date = Column(String(30), nullable=True)
    expected_price = Column(Float, nullable=False)
    location = Column(String(150), nullable=True)
    status = Column(String(20), default="Active")  # Active | Reserved | Sold
    unit = Column(String(20), default="kg")
    image_url = Column(String(300), nullable=True)
    notes = Column(Text, nullable=True)
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
    subtotal = Column(Float, default=0.0)
    road_logistics_fee = Column(Float, default=0.0)
    platform_fee = Column(Float, default=0.0)
    delivery_location = Column(String(200), nullable=False)
    status = Column(String(30), default="Confirmed")  # Confirmed | In Transit | Delivered | Cancelled
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
    spoilage_risk = Column(String(20), default="LOW")
    reefer_active = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

class LogisticsFleet(Base):
    __tablename__ = "logistics_fleet"

    id = Column(String(64), primary_key=True, index=True)
    vehicle_number = Column(String(30), nullable=False)
    vehicle_type = Column(String(50), nullable=False)
    capacity_kg = Column(Float, nullable=False)
    current_load_kg = Column(Float, default=0.0)
    driver_name = Column(String(100), nullable=False)
    driver_phone = Column(String(30), nullable=False)
    status = Column(String(30), default="Available")  # Available | In Transit | Maintenance | Loading
    reefer_active = Column(Boolean, default=True)
    current_temp_celsius = Column(Float, default=6.0)
    current_location = Column(String(150), default="Hyderabad Hub")
    current_lat = Column(Float, default=17.3850)
    current_lng = Column(Float, default=78.4867)
    assigned_trip_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class TripRecord(Base):
    __tablename__ = "trips"

    id = Column(String(64), primary_key=True, index=True)
    trip_code = Column(String(30), nullable=False)
    vehicle_id = Column(String(64), nullable=True)
    order_id = Column(String(64), nullable=True)
    produce_name = Column(String(100), nullable=True)
    total_quantity_kg = Column(Float, default=0.0)
    vehicle_type = Column(String(50), nullable=True)
    vehicle_number = Column(String(30), nullable=True)
    driver_name = Column(String(100), nullable=True)
    driver_phone = Column(String(30), nullable=True)
    pickup_location = Column(String(200), nullable=True)
    destination_location = Column(String(200), nullable=True)
    current_location_name = Column(String(200), nullable=True)
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)
    pickup_lat = Column(Float, nullable=True)
    pickup_lng = Column(Float, nullable=True)
    dest_lat = Column(Float, nullable=True)
    dest_lng = Column(Float, nullable=True)
    estimated_arrival = Column(String(50), nullable=True)
    distance_remaining_km = Column(Float, default=0.0)
    distance_completed_km = Column(Float, default=0.0)
    total_distance_km = Column(Float, default=0.0)
    progress_percentage = Column(Float, default=0.0)
    eta_minutes = Column(Integer, default=0)
    temperature_celsius = Column(Float, default=6.0)
    target_temp_celsius = Column(Float, default=6.0)
    humidity_percent = Column(Float, default=85.0)
    spoilage_risk = Column(String(20), default="LOW")
    reefer_active = Column(Boolean, default=True)
    telemetry_explanation = Column(Text, nullable=True)
    return_load_route = Column(String(200), nullable=True)
    return_load_commodity = Column(String(100), nullable=True)
    return_load_earnings = Column(Float, default=0.0)
    return_load_distance_avoided_km = Column(Float, default=0.0)
    return_load_claimed = Column(Boolean, default=False)
    waypoints_json = Column(Text, nullable=True)
    route_coords_json = Column(Text, nullable=True)
    status = Column(String(30), default="IN TRANSIT")  # IN TRANSIT | DELIVERED | SCHEDULED | LOADING
    created_at = Column(DateTime, default=datetime.utcnow)

class ReviewRecord(Base):
    __tablename__ = "reviews"

    id = Column(String(64), primary_key=True, index=True)
    transaction_id = Column(String(64), nullable=False)
    product_id = Column(String(64), nullable=True)
    product_name = Column(String(100), nullable=True)
    rater_user_id = Column(String(64), nullable=False)
    rater_role = Column(String(30), nullable=False)
    rater_display_name = Column(String(100), nullable=False)
    rated_user_id = Column(String(64), nullable=False)
    rated_role = Column(String(30), nullable=False)
    rating = Column(Integer, nullable=False)
    category_ratings_json = Column(Text, nullable=True)
    review = Column(Text, nullable=True)
    verification_badge = Column(String(50), default="VERIFIED_PURCHASE")
    is_verified = Column(Boolean, default=True)
    moderation_status = Column(String(30), default="PUBLISHED")
    created_at = Column(DateTime, default=datetime.utcnow)

class ReportRecord(Base):
    __tablename__ = "reports"

    id = Column(String(64), primary_key=True, index=True)
    reporter_user_id = Column(String(64), nullable=False)
    reporter_role = Column(String(30), nullable=False)
    reporter_display_name = Column(String(100), nullable=False)
    reported_user_id = Column(String(64), nullable=False)
    reported_role = Column(String(30), nullable=False)
    report_type = Column(String(50), nullable=False)
    reason = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    transaction_id = Column(String(64), nullable=True)
    product_id = Column(String(64), nullable=True)
    order_item_id = Column(String(64), nullable=True)
    review_id = Column(String(64), nullable=True)
    status = Column(String(30), default="UNDER_REVIEW")
    created_at = Column(DateTime, default=datetime.utcnow)
