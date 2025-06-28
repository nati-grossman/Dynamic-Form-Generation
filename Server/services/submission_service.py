from sqlalchemy.orm import Session
import json
from typing import List, Dict, Any
from datetime import datetime
import uuid

from database import FormSubmissionDB, generate_data_hash, check_duplicate_submission

class SubmissionService:
    """Service class for submission-related business logic"""
    
    def create_submission(self, db: Session, form_data: Dict[str, Any], form_title: str = "Dynamic Form") -> Dict[str, Any]:
        """Create a new form submission with duplicate checking"""
        # Check for duplicate submission
        if check_duplicate_submission(form_data, db):
            raise ValueError("קיים דאטה כזה במסד נתונים")
        
        # Generate unique ID and hash
        submission_id = str(uuid.uuid4())
        data_hash = generate_data_hash(form_data)
        submitted_at = datetime.now().isoformat()
        
        # Create new submission
        submission = FormSubmissionDB(
            id=submission_id,
            form_title=form_title,
            data=form_data,
            submitted_at=submitted_at,
            data_hash=data_hash
        )
        
        db.add(submission)
        db.commit()
        db.refresh(submission)
        
        return {
            "id": submission.id,
            "form_title": submission.form_title,
            "data": submission.data,
            "submitted_at": submission.submitted_at,
            "message": "הטפס נשמר בהצלחה"
        }
    
    def get_all_submissions(self, db: Session) -> List[Dict[str, Any]]:
        """Get all form submissions from database"""
        submissions = db.query(FormSubmissionDB).all()
        
        result = []
        for submission in submissions:
            result.append({
                "id": submission.id,
                "form_title": submission.form_title,
                "data": submission.data,
                "submitted_at": submission.submitted_at,
                "fields_mapping": submission.fields_mapping
            })
        
        return result
    
    def delete_all_submissions(self, db: Session) -> Dict[str, str]:
        """Delete all form submissions from database"""
        db.query(FormSubmissionDB).delete()
        db.commit()
        return {"message": "כל הטפסים נמחקו בהצלחה"}

# Global instance
submission_service = SubmissionService() 