import os
from sqlalchemy import create_engine, Column, String, Integer, Float, Boolean, DateTime, Text, JSON
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

POSTGRES_USER = os.getenv("POSTGRES_USER", "eeris_user")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "eeris_password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "eeris")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")

DATABASE_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:5432/{POSTGRES_DB}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ----------------- Models -----------------

class Application(Base):
    __tablename__ = "applications"
    id = Column(String, primary_key=True, index=True)
    applicant_name = Column(String, nullable=False)
    pan = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    device_id = Column(String, nullable=False)
    dealer = Column(String, nullable=False)
    guarantor = Column(String, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, nullable=False)
    ecosystem_pattern = Column(String, nullable=False)
    individual_risk = Column(Integer, nullable=False)
    individual_risk_level = Column(String, nullable=False)
    ecosystem_risk = Column(Integer, nullable=False)
    ecosystem_risk_level = Column(String, nullable=False)
    novelty = Column(Float, nullable=False)
    ecosystem_id = Column(String, nullable=False)
    applied_amount = Column(String, nullable=False)
    submitted_time = Column(String, nullable=False)
    case_id = Column(String, nullable=False)
    rail = Column(String, nullable=False)
    maturity_state = Column(String, nullable=False)
    coordinated_pattern = Column(String, nullable=False)
    decision_path = Column(String, nullable=False)
    decision_reason = Column(String, nullable=False)
    target_entities = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Ecosystem(Base):
    __tablename__ = "ecosystems"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    status = Column(String, nullable=False)
    risk_score = Column(Integer, nullable=False)
    novelty = Column(Float, nullable=False)
    maturity = Column(String, nullable=False)
    growth = Column(String, nullable=False)
    nodes_count = Column(Integer, nullable=False)
    edges_count = Column(Integer, nullable=False)
    detected_pattern = Column(String, nullable=False)
    is_legitimate = Column(Boolean, default=False)

class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, nullable=False, index=True)
    individual_risk = Column(Integer, nullable=False)
    ecosystem_risk = Column(Integer, nullable=False)
    divergence = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    missing_data = Column(JSON, nullable=True)
    model_version = Column(String, nullable=False)
    evaluated_at = Column(DateTime, default=datetime.utcnow)

class RiskDriver(Base):
    __tablename__ = "risk_drivers"
    id = Column(String, primary_key=True, index=True)
    application_id = Column(String, nullable=False, index=True)
    feature = Column(String, nullable=False)
    raw_value = Column(Float, nullable=False)
    normalized_value = Column(Float, nullable=False)
    contribution = Column(Float, nullable=False)
    direction = Column(String, nullable=False)
    evidence = Column(Text, nullable=False)
    supporting_entities = Column(JSON, nullable=False)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, index=True)
    ecosystem_id = Column(String, nullable=False)
    application_id = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    type = Column(String, nullable=False)
    risk = Column(Integer, nullable=False)
    evidence = Column(Text, nullable=False)
    status = Column(String, default="OPEN")
    created_at = Column(DateTime, default=datetime.utcnow)

class Investigation(Base):
    __tablename__ = "investigations"
    id = Column(String, primary_key=True, index=True)
    case_id = Column(String, nullable=False)
    application_id = Column(String, nullable=False)
    borrower_name = Column(String, nullable=False)
    ecosystem_id = Column(String, nullable=False)
    individual_risk = Column(Integer, nullable=False)
    ecosystem_risk = Column(Integer, nullable=False)
    status = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    assignee = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(String, primary_key=True, index=True)
    case_id = Column(String, nullable=False)
    ecosystem_id = Column(String, nullable=False)
    outcome = Column(String, nullable=False)
    analyst = Column(String, nullable=False)
    notes = Column(Text, nullable=True)
    evidence = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String, primary_key=True, index=True)
    user = Column(String, nullable=False)
    action = Column(String, nullable=False)
    case_id = Column(String, nullable=True)
    reason = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

class ModelVersion(Base):
    __tablename__ = "model_versions"
    id = Column(String, primary_key=True, index=True)
    version = Column(String, nullable=False)
    training_date = Column(DateTime, default=datetime.utcnow)
    training_samples = Column(Integer, nullable=False)
    validation_set = Column(Integer, nullable=False)
    approval_status = Column(String, nullable=False)

def init_db():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialized successfully.")
    except Exception as e:
        logger.error(f"Error initializing database: {e}")
