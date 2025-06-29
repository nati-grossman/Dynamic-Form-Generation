from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from services.submission_service import submission_service

router = APIRouter(prefix="/submissions", tags=["submissions"])

@router.get("/")
def get_submissions(db: Session = Depends(get_db)):
    """Get all form submissions"""
    try:
        return submission_service.get_all_submissions(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting forms: {str(e)}")



@router.delete("/")
def delete_all_submissions(db: Session = Depends(get_db)):
    """Delete all form submissions"""
    try:
        return submission_service.delete_all_submissions(db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting forms: {str(e)}") 