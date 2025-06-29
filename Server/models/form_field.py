"""
Form field model with validation

This module contains the FormField model which represents a single field
in a dynamic form with its validation rules and error messages.
"""

from pydantic import BaseModel, field_validator
from typing import List, Optional

from .field_models import FieldValidation, FieldErrorMessages, DropdownOption

class FormField(BaseModel):
    """
    Represents a single field in a dynamic form
    
    This model defines the structure and validation rules for form fields.
    Each field has a type, validation rules, and custom error messages.
    
    Attributes:
        name: Unique identifier for the field
        label: Display name shown to users
        type: Field type (text, email, password, date, number, dropdown)
        required: Whether the field is mandatory
        validation: Validation rules for the field
        errorMessages: Custom error messages in Hebrew
        options: Available options for dropdown fields
    """
    name: str
    label: str
    type: str
    required: bool = False
    validation: Optional[FieldValidation] = None
    errorMessages: Optional[FieldErrorMessages] = None
    options: Optional[List[DropdownOption]] = None

    @field_validator('type')
    @classmethod
    def validate_field_type(cls, v):
        """
        Validates that the field type is supported
        
        Args:
            v: The field type value
            
        Returns:
            The validated field type
            
        Raises:
            ValueError: If the field type is not supported
        """
        allowed_types = ['text', 'email', 'password', 'date', 'number', 'dropdown']
        if v not in allowed_types:
            raise ValueError(f'Field type must be one of: {allowed_types}')
        return v

    @field_validator('options')
    @classmethod
    def validate_dropdown_options(cls, v, info):
        """
        Validates that dropdown fields have options defined
        
        Args:
            v: The options list
            info: Field info including other field values
            
        Returns:
            The validated options list
            
        Raises:
            ValueError: If dropdown field has no options
        """
        if info.data.get('type') == 'dropdown' and not v:
            raise ValueError('Dropdown fields must have options')
        return v 