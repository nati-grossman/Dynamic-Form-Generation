from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os

from models import FormSubmission
from database import get_db
from services.form_service import form_service

router = APIRouter(prefix="/forms", tags=["forms"])

@router.get("/download-example")
def download_example():
    """Download example JSON file"""
    example_file = form_service.get_example_file_path()
    if os.path.exists(example_file):
        return FileResponse(example_file, filename="example_form.json")
    else:
        raise HTTPException(status_code=404, detail="Example file not found")

@router.post("/upload-schema")
def upload_schema(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and validate form schema JSON file"""
    if not file.filename or not file.filename.endswith('.json'):
        raise HTTPException(status_code=400, detail="File must be a JSON file")
    
    content = file.file.read()
    return form_service.validate_and_store_schema(content)

@router.get("/current-schema")
def get_current_schema():
    """Get current form schema"""
    return form_service.get_current_schema()

@router.get("/load-schema")
def load_schema():
    """Load form schema from saved file"""
    return form_service.load_schema_from_file()

@router.get("/current-form-id")
def get_current_form_id():
    """Get current form ID"""
    return {"form_id": form_service.get_current_form_id()}

@router.post("/submit")
def submit_form(submission: FormSubmission, db: Session = Depends(get_db)):
    """Submit form data for validation and storage using Pydantic"""
    return form_service.submit_form_data(submission.data, db) 