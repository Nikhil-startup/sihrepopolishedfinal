import json
from datetime import datetime
from database import SessionLocal, engine, Base
from models.db_models import (
    User, ProduceListing, OrderRecord, ApmcPriceTable, 
    TelemetryLog, LogisticsFleet, TripRecord, ReviewRecord, ReportRecord
)

def seed_database():
    """
    Populates initial development/testing benchmark records in Neon PostgreSQL
    if tables are currently empty.
    NOTE: These are DATABASE/SEEDED records, NOT live sensor feeds.
    """
    db = SessionLocal()
    try:
        # 1. Users
        if db.query(User).count() == 0:
            users = [
                User(id="farmer-01", name="Ramesh Patel", role="farmer", phone="+91 98480 11223", state="Telangana", district="Sangareddy", location="Zaheerabad Farm Cluster"),
                User(id="consumer-01", name="Priya Sharma (Retail Buyer)", role="consumer", phone="+91 98480 33445", state="Telangana", district="Hyderabad", location="Bowenpally Wholesale Terminal"),
                User(id="logistics-01", name="Mohammed Ismail (Reefer Fleet)", role="logistics", phone="+91 98480 22341", state="Telangana", district="Rangareddy", location="Shamshabad Cold Corridor"),
            ]
            db.add_all(users)
            db.commit()
            print("[Seed] Inserted initial users into PostgreSQL.")

        # 2. APMC Mandi Benchmark Prices
        if db.query(ApmcPriceTable).count() == 0:
            prices = [
                ApmcPriceTable(id="mp-001", commodity="Tomato (Hybrid Desi)", market_name="Hyderabad (Bowenpally)", district="Hyderabad", state="Telangana", current_price=38.00, previous_price=35.50, change=2.50, percentage_change=7.04, bulk_buyer_opportunity_price=42.00, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Bowenpally APMC Market Yard"),
                ApmcPriceTable(id="mp-002", commodity="Tomato (Local)", market_name="Gaddiannaram Mandi", district="Rangareddy", state="Telangana", current_price=36.50, previous_price=36.00, change=0.50, percentage_change=1.39, bulk_buyer_opportunity_price=41.50, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Gaddiannaram APMC Yard"),
                ApmcPriceTable(id="mp-003", commodity="Onion (Nashik Red)", market_name="Mahabubnagar Mandi", district="Mahabubnagar", state="Telangana", current_price=28.00, previous_price=26.50, change=1.50, percentage_change=5.66, bulk_buyer_opportunity_price=32.00, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Mahabubnagar Market Yard"),
                ApmcPriceTable(id="mp-004", commodity="Potato (Jyoti)", market_name="Kolar Cold Terminal", district="Kolar", state="Karnataka", current_price=24.00, previous_price=23.00, change=1.00, percentage_change=4.35, bulk_buyer_opportunity_price=27.50, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Kolar APMC Mandi"),
                ApmcPriceTable(id="mp-005", commodity="Green Chilli (G4)", market_name="Warangal Mandi", district="Warangal", state="Telangana", current_price=52.00, previous_price=49.00, change=3.00, percentage_change=6.12, bulk_buyer_opportunity_price=58.00, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Warangal Commercial APMC"),
                ApmcPriceTable(id="mp-006", commodity="Mango (Banganapalli)", market_name="Srinivaspur Mango Mandi", district="Kolar", state="Karnataka", current_price=85.00, previous_price=80.00, change=5.00, percentage_change=6.25, bulk_buyer_opportunity_price=96.00, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Srinivaspur Fruit Mandi"),
                ApmcPriceTable(id="mp-007", commodity="Banana (Robusta)", market_name="Solapur Fruit APMC", district="Solapur", state="Maharashtra", current_price=26.00, previous_price=24.50, change=1.50, percentage_change=6.12, bulk_buyer_opportunity_price=30.00, arrival_date=datetime.now().strftime("%Y-%m-%d"), source="Solapur Fruit Yard"),
            ]
            db.add_all(prices)
            db.commit()
            print("[Seed] Inserted APMC mandi price benchmarks into PostgreSQL.")

        # 3. Farmer Produce Listings
        if db.query(ProduceListing).count() == 0:
            listings = [
                ProduceListing(id="prod-101", farmer_id="farmer-01", crop="Tomato (Hybrid Desi)", quantity_kg=1200.0, grade="Grade A", harvest_date=datetime.now().strftime("%Y-%m-%d"), expected_price=42.0, location="Zaheerabad Farm Packhouse, Telangana", status="Active", unit="kg", image_url="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60", notes="Firm skin, high brix, ideal for retail shelf."),
                ProduceListing(id="prod-102", farmer_id="farmer-01", crop="Onion (Nashik Red)", quantity_kg=3000.0, grade="Grade B", harvest_date=datetime.now().strftime("%Y-%m-%d"), expected_price=28.0, location="Medak Aggregation Hub, Telangana", status="Active", unit="kg", image_url="https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=60", notes="Well-cured outer skin, uniform 45-55mm bulb diameter."),
                ProduceListing(id="prod-103", farmer_id="farmer-01", crop="Green Chilli (G4 Spicy)", quantity_kg=800.0, grade="Grade A", harvest_date=datetime.now().strftime("%Y-%m-%d"), expected_price=52.0, location="Warangal Packhouse, Telangana", status="Active", unit="kg", image_url="https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=60", notes="Bright green, firm snap, premium export grade."),
                ProduceListing(id="prod-104", farmer_id="farmer-01", crop="Potato (Jyoti Cold Storage)", quantity_kg=5000.0, grade="Grade A", harvest_date=datetime.now().strftime("%Y-%m-%d"), expected_price=24.0, location="Kolar Cold Terminal, Karnataka", status="Active", unit="kg", image_url="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60", notes="Stored at 4C with humidity control. Zero sprouting."),
                ProduceListing(id="prod-105", farmer_id="farmer-01", crop="Mango (Banganapalli)", quantity_kg=1500.0, grade="Grade A", harvest_date=datetime.now().strftime("%Y-%m-%d"), expected_price=85.0, location="Srinivaspur Fruit Mandi, Karnataka", status="Active", unit="kg", image_url="https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60", notes="Naturally tree-ripened, carbide-free guarantee."),
                ProduceListing(id="prod-106", farmer_id="farmer-01", crop="Banana (Robusta)", quantity_kg=2500.0, grade="Grade B", harvest_date=datetime.now().strftime("%Y-%m-%d"), expected_price=26.0, location="Solapur Fruit Yard, Maharashtra", status="Active", unit="kg", image_url="https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60", notes="Clean hands, uniform caliber, cold-stored."),
            ]
            db.add_all(listings)
            db.commit()
            print("[Seed] Inserted initial produce listings into PostgreSQL.")

        # 4. Initial Order
        if db.query(OrderRecord).count() == 0:
            initial_order = OrderRecord(
                id="ORD-HYD-5000",
                buyer_id="consumer-01",
                buyer_name="Priya Sharma (Retail Buyer)",
                produce_name="Tomato (Hybrid Desi)",
                quantity_kg=5000.0,
                total_amount=190000.0,
                subtotal=175000.0,
                road_logistics_fee=12000.0,
                platform_fee=3000.0,
                delivery_location="Bowenpally Wholesale Terminal, Hyderabad",
                status="In Transit",
                escrow_status="HELD",
                trip_id="TRK-CONS-ROAD-9021",
                created_at=datetime.utcnow()
            )
            db.add(initial_order)
            db.commit()
            print("[Seed] Inserted initial order into PostgreSQL.")

        # 5. Logistics Fleet
        if db.query(LogisticsFleet).count() == 0:
            fleet = [
                LogisticsFleet(id="VEH-01", vehicle_number="TS 08 UB 4192", vehicle_type="Tata 407 Reefer", capacity_kg=5000.0, current_load_kg=5000.0, driver_name="Mohammed Ismail", driver_phone="+91 98480 22341", status="In Transit", reefer_active=True, current_temp_celsius=5.8, current_location="Shamshabad Outer Ring Road Tollway (NH 44)", current_lat=17.2403, current_lng=78.4294, assigned_trip_id="TRK-CONS-ROAD-9021"),
                LogisticsFleet(id="VEH-02", vehicle_number="TS 09 QC 8821", vehicle_type="Tata Ace", capacity_kg=1500.0, current_load_kg=0.0, driver_name="Rajesh Kumar", driver_phone="+91 98480 44556", status="Available", reefer_active=False, current_temp_celsius=24.0, current_location="Bowenpally Logistics Hub", current_lat=17.4729, current_lng=78.4842, assigned_trip_id=None),
                LogisticsFleet(id="VEH-03", vehicle_number="TS 07 ED 5512", vehicle_type="Mahindra Bolero Maxi Truck", capacity_kg=2500.0, current_load_kg=0.0, driver_name="Suresh Naik", driver_phone="+91 98480 77889", status="Available", reefer_active=False, current_temp_celsius=22.0, current_location="Medchal Cargo Terminal", current_lat=17.6294, current_lng=78.4812, assigned_trip_id=None),
            ]
            db.add_all(fleet)
            db.commit()
            print("[Seed] Inserted logistics fleet into PostgreSQL.")

        # 6. Active Trip
        if db.query(TripRecord).count() == 0:
            waypoints = [
                {"id": "wp-1", "title": "Harvest Loaded & Crated (3 Farmer Clusters)", "location": "Shadnagar FPO Hub", "coordinates": [17.0684, 78.2078], "timestamp": "08:30 AM", "completed": True},
                {"id": "wp-2", "title": "IoT Cold Seal & QR Verified", "location": "Reefer Pre-Cool Gate", "coordinates": [17.0800, 78.2200], "timestamp": "09:15 AM", "completed": True},
                {"id": "wp-3", "title": "Departed on NH 44 Expressway", "location": "Kothur Toll Plaza", "coordinates": [17.1500, 78.3000], "timestamp": "10:00 AM", "completed": True},
                {"id": "wp-4", "title": "In Transit - ORR Highway Corridor", "location": "Shamshabad (Speed: 54 km/h | GPS Active)", "coordinates": [17.2403, 78.4294], "timestamp": "03:15 PM", "completed": True, "current": True},
                {"id": "wp-5", "title": "Entry into City Wholesale Hub", "location": "Bowenpally Terminal Gate 4", "coordinates": [17.4729, 78.4842], "timestamp": "05:45 PM (ETA)", "completed": False}
            ]
            route_coords = [
                [17.0684, 78.2078], [17.1120, 78.2540], [17.1500, 78.3000],
                [17.1950, 78.3650], [17.2403, 78.4294], [17.3100, 78.4600],
                [17.3850, 78.4867], [17.4729, 78.4842]
            ]
            trip = TripRecord(
                id="TRK-CONS-ROAD-9021",
                trip_code="TRIP-HYD-7821",
                vehicle_id="VEH-01",
                order_id="ORD-HYD-5000",
                produce_name="Fresh Hybrid Tomatoes (Grade A - 5000kg Bulk)",
                total_quantity_kg=5000.0,
                vehicle_type="Tata 407 Reefer",
                vehicle_number="TS 08 UB 4192",
                driver_name="Mohammed Ismail",
                driver_phone="+91 98480 22341",
                pickup_location="Shadnagar FPO Hub, Rangareddy, Telangana",
                destination_location="Bowenpally Central Wholesale Yard, Hyderabad",
                current_location_name="Shamshabad Outer Ring Road Tollway (NH 44)",
                pickup_lat=17.0684,
                pickup_lng=78.2078,
                dest_lat=17.4729,
                dest_lng=78.4842,
                current_lat=17.2403,
                current_lng=78.4294,
                estimated_arrival="Today, 05:45 PM",
                distance_remaining_km=28.0,
                distance_completed_km=46.0,
                total_distance_km=74.0,
                progress_percentage=68.0,
                eta_minutes=45,
                temperature_celsius=5.8,
                target_temp_celsius=6.0,
                humidity_percent=86.0,
                spoilage_risk="LOW",
                reefer_active=True,
                telemetry_explanation="Reefer active at optimal 5.8°C. Relative humidity calibrated at 86% to preserve produce freshness.",
                return_load_route="Hyderabad Terminal -> Warangal Produce Hub",
                return_load_commodity="Organic Bio-Fertilizer Sacks & Seedlings",
                return_load_earnings=2800.0,
                return_load_distance_avoided_km=142.0,
                return_load_claimed=False,
                waypoints_json=json.dumps(waypoints),
                route_coords_json=json.dumps(route_coords),
                status="IN TRANSIT"
            )
            db.add(trip)
            db.commit()
            print("[Seed] Inserted initial road trip into PostgreSQL.")

        # 7. Reviews
        if db.query(ReviewRecord).count() == 0:
            review = ReviewRecord(
                id="REV-10001",
                transaction_id="ORD-HYD-5000",
                product_id="prod-101",
                product_name="Tomato (Hybrid Desi)",
                rater_user_id="consumer-01",
                rater_role="BUYER",
                rater_display_name="Priya Sharma (Retail Buyer)",
                rated_user_id="farmer-01",
                rated_role="FARMER",
                rating=5,
                category_ratings_json=json.dumps({"freshness": 5, "accuracy": 5, "packaging": 4}),
                review="Outstanding produce quality! Grade A Desi tomatoes arrived crisp with verified 5.8C cold chain seal intact.",
                verification_badge="VERIFIED_PURCHASE",
                is_verified=True,
                moderation_status="PUBLISHED"
            )
            db.add(review)
            db.commit()
            print("[Seed] Inserted initial verified reviews into PostgreSQL.")

    except Exception as e:
        db.rollback()
        print(f"[Seed] Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
