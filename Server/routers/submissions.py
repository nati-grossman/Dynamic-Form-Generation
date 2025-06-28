from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
from pydantic import BaseModel

from database import get_db
from services.submission_service import submission_service

class SubmissionRequest(BaseModel):
    form_data: Dict[str, Any]
    form_title: str = "Dynamic Form"

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.post("/")
def create_submission(request: SubmissionRequest, db: Session = Depends(get_db)):
    """Create a new form submission"""
    try:
        return submission_service.create_submission(db, request.form_data, request.form_title)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"שגיאה בשמירת הטפס: {str(e)}")

@router.get("/")
def get_submissions(db: Session = Depends(get_db)):
    """Get all form submissions"""
    try:
        return submission_service.get_all_submissions(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"שגיאה בקבלת הטפסים: {str(e)}")

@router.delete("/")
def delete_all_submissions(db: Session = Depends(get_db)):
    """Delete all form submissions"""
    try:
        return submission_service.delete_all_submissions(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"שגיאה במחיקת הטפסים: {str(e)}") 