from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any

from database import get_db
from services.statistics_service import statistics_service

router = APIRouter()

@router.get("/statistics", response_model=Dict[str, Any])
def get_statistics(db: Session = Depends(get_db)):
    """
    Get form submission statistics
    
    Returns statistics about all form submissions including:
    - Total number of submissions
    - Number of different forms
    - Submission count per form
    - Field information for each form
    """
    return statistics_service.get_statistics(db) 