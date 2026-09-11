import os
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment from backend/.env or root .env.local
backend_env = Path(__file__).resolve().parent / ".env"
root_env = Path(__file__).resolve().parent.parent / ".env.local"

if backend_env.exists():
    load_dotenv(backend_env)
elif root_env.exists():
    load_dotenv(root_env)

raw_db_url = os.getenv("DATABASE_URL") or os.getenv("DATABASE_URL_UNPOOLED")

if raw_db_url:
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)
    raw_db_url = raw_db_url.replace("channel_binding=require&", "").replace("&channel_binding=require", "").replace("channel_binding=require", "")

DATABASE_URL = raw_db_url or "sqlite:///./agriflow_local.db"

def get_working_engine():
    connect_args = {}
    if "sqlite" in DATABASE_URL:
        connect_args["check_same_thread"] = False
        return create_engine(DATABASE_URL, connect_args=connect_args)
    else:
        connect_args["connect_timeout"] = 5
        try:
            eng = create_engine(
                DATABASE_URL,
                pool_pre_ping=True,
                pool_recycle=300,
                connect_args=connect_args
            )
            # Verify connectivity immediately
            with eng.connect() as conn:
                conn.execute(text("SELECT 1"))
            print("[Database] Successfully connected to Neon PostgreSQL.")
            return eng
        except Exception as e:
            print(f"[Database] Warning: Direct connection to Neon timed out ({e}). Using local database for dev session.")
            return create_engine("sqlite:///./agriflow_local.db", connect_args={"check_same_thread": False})

engine = get_working_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
