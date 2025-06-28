"""
Models module - Main entry point for all form-related models

This module provides convenient imports for all the form models that have been
split into separate modules for better organization and maintainability.

Imports:
- All base models (DropdownOption, FieldValidation, FieldErrorMessages)
- Form field and schema models (FormField, FormSchema)
- Submission models (FormSubmission, FormSubmissionResponse)
- Dynamic validation generator (DynamicFormSubmissionGenerator)
"""

# Import all models from their respective modules
from models.base import DropdownOption, FieldValidation, FieldErrorMessages
from models.form_field import FormField
from models.form_schema import FormSchema
from models.submission import FormSubmission, FormSubmissionResponse
from models.dynamic_validator import DynamicFormSubmissionGenerator

# Re-export all models for backward compatibility
__all__ = [
    'DropdownOption',
    'FieldValidation', 
    'FieldErrorMessages',
    'FormField',
    'FormSchema',
    'FormSubmission',
    'FormSubmissionResponse',
    'DynamicFormSubmissionGenerator'
] 