from sqlalchemy import create_engine, Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json
import hashlib

from config import DATABASE_URL

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class FormSubmissionDB(Base):
    """Database model for form submissions"""
    __tablename__ = "form_submissions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    form_title = Column(String, nullable=False)  # Title of the form for display
    data = Column(JSON, nullable=False)  # JSON data of submitted form
    submitted_at = Column(String, nullable=False)  # Submission timestamp as string
    data_hash = Column(String, unique=True, index=True, nullable=False)  # Hash to prevent duplicates
    fields_mapping = Column(JSON, nullable=True)  # חדש: mapping name→label

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    """Create database tables"""
    Base.metadata.create_all(bind=engine)

def generate_data_hash(data: dict) -> str:
    """Generate a hash from form data to prevent duplicates"""
    # Sort the data to ensure consistent hashing regardless of field order
    sorted_data = json.dumps(data, sort_keys=True)
    return hashlib.sha256(sorted_data.encode()).hexdigest()

def check_duplicate_submission(data: dict, db) -> bool:
    """Check if a submission with the same data already exists"""
    data_hash = generate_data_hash(data)
    existing = db.query(FormSubmissionDB).filter(FormSubmissionDB.data_hash == data_hash).first()
    return existing is not None 