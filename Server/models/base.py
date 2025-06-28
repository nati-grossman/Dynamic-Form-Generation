"""
Base models for form schema components

This module contains the foundational Pydantic models used for defining
form schemas and their components.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union
from datetime import date, datetime

class DropdownOption(BaseModel):
    """
    Represents a single option in a dropdown field
    
    Attributes:
        value: The actual value that will be stored
        label: The display text shown to the user
    """
    value: str
    label: str

class FieldValidation(BaseModel):
    """
    Validation rules for form fields
    
    This model defines various validation constraints that can be applied
    to different field types.
    """
    minLength: Optional[int] = None
    maxLength: Optional[int] = None
    min: Optional[Union[int, float]] = None
    max: Optional[Union[int, float]] = None
    minDate: Optional[str] = None
    maxDate: Optional[str] = None
    email: Optional[bool] = None
    pattern: Optional[str] = None

class FieldErrorMessages(BaseModel):
    """
    Custom error messages for field validation
    
    Provides Hebrew error messages for different validation failures.
    """
    required: Optional[str] = None
    minLength: Optional[str] = None
    maxLength: Optional[str] = None
    min: Optional[str] = None
    max: Optional[str] = None
    minDate: Optional[str] = None
    maxDate: Optional[str] = None
    email: Optional[str] = None
    pattern: Optional[str] = None
    invalidOption: Optional[str] = None 