from sqlalchemy.orm import Session
from typing import Dict, Any
from collections import defaultdict

from database import FormSubmissionDB


class StatisticsService:
    """Service class for statistics-related business logic"""
    
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
                            "label": field_label
                        })
                # Handle old direct dict format
                elif isinstance(fields_data, dict):
                    for field_name, field_label in fields_data.items():
                        form_stat["fields"].append({
                            "label": field_label
                        })
                # Handle old list format
                elif isinstance(fields_data, list):
                    for field in fields_data:
                        if isinstance(field, dict) and "name" in field and "label" in field:
                            form_stat["fields"].append({
                                "label": field["label"]
                            })
            
            statistics["forms"].append(form_stat)
        
        return statistics


# Global instance
statistics_service = StatisticsService() 