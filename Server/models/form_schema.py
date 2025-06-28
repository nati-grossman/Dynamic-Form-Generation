"""
Form schema model

This module contains the FormSchema model which represents the complete
structure of a dynamic form including all its fields.
"""

from pydantic import BaseModel
from typing import List

from .form_field import FormField

class FormSchema(BaseModel):
    """
    Complete form schema definition
    
    This model represents the entire structure of a dynamic form,
    including its title and all field definitions.
    
    Attributes:
        title: The form's display title
        fields: List of form fields with their configurations
    """
    title: str
    fields: List[FormField] 