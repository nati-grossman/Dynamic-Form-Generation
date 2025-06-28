"""
Form submission models

This module contains models related to form submissions including
the submission data structure and response models.
"""

from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class FormSubmission(BaseModel):
    """
    Model for form submission data
    
    Represents the data submitted by a user through a dynamic form.
    
    Attributes:
        data: Dictionary containing the submitted field values
        submitted_at: Timestamp when the submission was created
    """
    data: Dict[str, Any]
    submitted_at: datetime = Field(default_factory=datetime.now)

class FormSubmissionResponse(BaseModel):
    """
    Response model for form submission operations
    
    Used to return success/failure status and any validation errors
    when processing form submissions.
    
    Attributes:
        success: Whether the submission was successful
        errors: Dictionary of field names to error messages (if any)
        message: General response message
    """
    success: bool
    errors: Optional[Dict[str, List[str]]] = None
    message: str 