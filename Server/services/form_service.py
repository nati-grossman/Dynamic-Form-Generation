import json
import uuid
import os
from datetime import datetime
from fastapi import HTTPException
from pydantic import ValidationError
from sqlalchemy.orm import Session

from models import FormSchema, FormSubmission, FormSubmissionResponse, DynamicFormSubmissionGenerator
from database import FormSubmissionDB, generate_data_hash, check_duplicate_submission

class FormService:
    """Service class for form-related business logic"""
    
    def __init__(self):
        # Store current form schema and dynamic model in memory (in production, use database)
        self.current_form_schema = None
        self.current_dynamic_model = None
        self.current_form_id = None
        
        # New folders - updated paths to be relative to Server directory
        self.base_dir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))  # Go up one level to Server
        self.examples_dir = os.path.join(self.base_dir, 'files', 'example_file')
        self.user_file_dir = os.path.join(self.base_dir, 'files', 'user_file')
        os.makedirs(self.examples_dir, exist_ok=True)
        os.makedirs(self.user_file_dir, exist_ok=True)
    
    def get_example_file_path(self) -> str:
        """Get the path to the example JSON file"""
        return os.path.join(self.examples_dir, 'example1.json')
    
    def validate_and_store_schema(self, file_content: bytes) -> dict:
        """Validate and store form schema"""
        try:
            schema_data = json.loads(file_content)
            
            # Validate schema using Pydantic
            form_schema = FormSchema(**schema_data)
            
            # Create dynamic Pydantic model for form submission validation
            dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
            
            # Generate unique form ID
            form_id = str(uuid.uuid4())
            
            # Remove previous user file if exists
            file_path = os.path.join(self.user_file_dir, "current_form.json")
            if os.path.exists(file_path):
                os.remove(file_path)
            # Save file locally with fixed name
            with open(file_path, 'wb') as f:
                f.write(file_content)
            
            # Store in memory for current session
            self.current_form_schema = form_schema
            self.current_dynamic_model = dynamic_model
            self.current_form_id = form_id
            
            return {
                "message": "הקובץ נשמר במערכת", 
                "form_id": form_id,
                "schema": form_schema.dict()
            }
        
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="הקובץ לא נתמך במערכת - JSON לא תקין")
        except ValidationError as e:
            raise HTTPException(status_code=400, detail=f"הקובץ לא נתמך במערכת - שגיאות וולידציה: {e}")
        except Exception as e:
            raise HTTPException(status_code=400, detail="הקובץ לא נתמך במערכת")
    
    def get_current_schema(self) -> dict:
        """Get current form schema (always from file)"""
        return self.load_schema_from_file()
    
    def get_current_form_id(self) -> str:
        """Get current form ID"""
        if self.current_form_id is None:
            raise HTTPException(status_code=404, detail="No form loaded")
        
        return self.current_form_id
    
    def load_schema_from_file(self) -> dict:
        """Load schema from saved file"""
        file_path = os.path.join(self.user_file_dir, "current_form.json")
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="No form schema file found")
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                schema_data = json.load(f)
            
            # Validate schema using Pydantic
            form_schema = FormSchema(**schema_data)
            
            # Create dynamic Pydantic model for form submission validation
            dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
            
            # Store in memory for current session
            self.current_form_schema = form_schema
            self.current_dynamic_model = dynamic_model
            self.current_form_id = "current_form"  # Fixed ID for current form
            
            return form_schema.dict()
            
        except json.JSONDecodeError:
            raise HTTPException(status_code=400, detail="Invalid JSON in saved form file")
        except ValidationError as e:
            raise HTTPException(status_code=400, detail=f"Invalid form schema in saved file: {e}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error loading form schema: {e}")
    
    def submit_form_data(self, submission_data: dict, db: Session) -> FormSubmissionResponse:
        """Submit and validate form data"""
        if self.current_form_schema is None or self.current_dynamic_model is None:
            raise HTTPException(status_code=404, detail="No form schema loaded")
        
        try:
            # Validate submission using Pydantic dynamic model
            validated_data = self.current_dynamic_model(**submission_data)
            
            # Check for duplicate submission
            if check_duplicate_submission(validated_data.dict(), db):
                return FormSubmissionResponse(
                    success=False,
                    errors={"general": ["טופס זהה כבר הוגש קודם לכן"]},
                    message="טופס זהה כבר הוגש קודם לכן"
                )
            
            # Save to database
            db_submission = FormSubmissionDB(
                form_title=self.current_form_schema.title,
                data=json.dumps(validated_data.dict()),
                submitted_at=datetime.now().isoformat(),
                data_hash=generate_data_hash(validated_data.dict()),
                fields_mapping=[{"name": f.name, "label": f.label} for f in self.current_form_schema.fields]
            )
            db.add(db_submission)
            db.commit()
            
            return FormSubmissionResponse(
                success=True,
                message="הטופס נשלח בהצלחה"
            )
        
        except ValidationError as e:
            # Convert Pydantic validation errors to our format
            errors = {}
            for error in e.errors():
                field_name = error['loc'][0] if error['loc'] else 'unknown'
                error_message = error['msg']
                
                if field_name not in errors:
                    errors[field_name] = []
                errors[field_name].append(error_message)
            return FormSubmissionResponse(
                success=False,
                errors=errors,
                message="יש שגיאות בטופס"
            )
        
        except Exception as e:
            return FormSubmissionResponse(
                success=False,
                errors={"general": [str(e)]},
                message="שגיאה כללית בטופס"
            )

# Global instance
form_service = FormService() 