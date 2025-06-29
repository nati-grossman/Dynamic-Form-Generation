from sqlalchemy.orm import Session
import json
from typing import List, Dict, Any
from datetime import datetime
import uuid
from collections import defaultdict

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
    
    def get_statistics(self, db: Session) -> Dict[str, Any]:
        """Get form submission statistics"""
        submissions = db.query(FormSubmissionDB).all()
        
        # Count submissions by form title
        form_counts = defaultdict(int)
        form_fields = {}  # Store fields for each form
        
        for submission in submissions:
            form_title = submission.form_title
            form_counts[form_title] += 1
            
            # Store fields mapping for this form (take the latest one)
            if submission.fields_mapping is not None:
                form_fields[form_title] = submission.fields_mapping
        
        # Build statistics
        statistics = {
            "total_submissions": len(submissions),
            "total_forms": len(form_counts),
            "forms": []
        }
        
        # Sort forms by count (descending)
        sorted_forms = sorted(form_counts.items(), key=lambda x: x[1], reverse=True)
        
        for form_title, count in sorted_forms:
            form_stat = {
                "title": form_title,
                "count": count,
                "fields": []
            }
            
            # Add field labels if available
            if form_title in form_fields and form_fields[form_title]:
                fields_data = form_fields[form_title]
                
                # Handle new nested format with fields_mapping
                if isinstance(fields_data, dict) and "fields_mapping" in fields_data:
                    # New format: {"fields_mapping": {...}, "selected_options_labels": {...}}
                    for field_name, field_label in fields_data["fields_mapping"].items():
                        form_stat["fields"].append({
                            "name": field_name,
                            "label": field_label
                        })
                # Handle old direct dict format
                elif isinstance(fields_data, dict):
                    for field_name, field_label in fields_data.items():
                        form_stat["fields"].append({
                            "name": field_name,
                            "label": field_label
                        })
                # Handle old list format
                elif isinstance(fields_data, list):
                    for field in fields_data:
                        if isinstance(field, dict) and "name" in field and "label" in field:
                            form_stat["fields"].append({
                                "name": field["name"],
                                "label": field["label"]
                            })
            
            statistics["forms"].append(form_stat)
        
        return statistics
    
    def delete_all_submissions(self, db: Session) -> Dict[str, str]:
        """Delete all form submissions from database"""
        db.query(FormSubmissionDB).delete()
        db.commit()
        return {"message": "כל הטפסים נמחקו בהצלחה"}

# Global instance
submission_service = SubmissionService() 