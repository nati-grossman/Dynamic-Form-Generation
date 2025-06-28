"""
Dynamic form submission model generator

This module contains the DynamicFormSubmissionGenerator class which creates
Pydantic models dynamically based on form schemas for validation purposes.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any, Union, Optional, Type
import re
from datetime import date, datetime

from .form_schema import FormSchema

class DynamicFormSubmissionGenerator:
    """
    Generates Pydantic models dynamically based on form schema
    
    This class creates validation models on-the-fly based on the form
    schema definition, allowing for type-safe validation of form submissions.
    """
    
    @staticmethod
    def create_submission_model(form_schema: FormSchema) -> Type[BaseModel]:
        """
        Create a Pydantic model for form submission validation
        
        This method dynamically generates a Pydantic model class based on
        the form schema, including field types, validators, and error messages.
        
        Args:
            form_schema: The form schema defining the form structure
            
        Returns:
            A Pydantic model class for validating form submissions
            
        Example:
            >>> schema = FormSchema(title="Test", fields=[...])
            >>> model_class = DynamicFormSubmissionGenerator.create_submission_model(schema)
            >>> validated_data = model_class(**submission_data)
        """
        
        field_validators = {}
        annotations = {}
        defaults = {}
        
        for field in form_schema.fields:
            field_name = field.name
            field_type = field.type
            field_required = field.required
            field_validation = field.validation
            field_error_messages = field.errorMessages
            
            # Create validator function for this field
            def create_field_validator(field_info):
                """
                Creates a validator function for a specific field
                
                Args:
                    field_info: Dictionary containing field configuration
                    
                Returns:
                    A validator function for the field
                """
                @field_validator(field_info['name'], mode='before')
                def validate_field(cls, v):
                    """
                    Validates a field value according to its type and rules
                    
                    Args:
                        cls: The model class (unused)
                        v: The value to validate
                        
                    Returns:
                        The validated value
                        
                    Raises:
                        ValueError: If validation fails
                    """
                    field_name = field_info['name']
                    field_type = field_info['type']
                    field_required = field_info['required']
                    field_validation = field_info['validation']
                    field_error_messages = field_info['error_messages']
                    
                    # Skip validation for empty optional fields
                    if not field_required and (v is None or v == ""):
                        return v
                    
                    # Type-specific validation
                    if field_type == "text":
                        return DynamicFormSubmissionGenerator._validate_text_field(
                            v, field_validation, field_error_messages
                        )
                    
                    elif field_type == "email":
                        return DynamicFormSubmissionGenerator._validate_email_field(
                            v, field_error_messages
                        )
                    
                    elif field_type == "password":
                        return DynamicFormSubmissionGenerator._validate_password_field(
                            v, field_validation, field_error_messages
                        )
                    
                    elif field_type == "date":
                        return DynamicFormSubmissionGenerator._validate_date_field(
                            v, field_validation, field_error_messages
                        )
                    
                    elif field_type == "number":
                        return DynamicFormSubmissionGenerator._validate_number_field(
                            v, field_validation, field_error_messages
                        )
                    
                    elif field_type == "dropdown":
                        return DynamicFormSubmissionGenerator._validate_dropdown_field(
                            v, field_info['options'], field_error_messages
                        )
                    
                    return v
                
                return validate_field
            
            # Create field info for the validator
            field_info = {
                'name': field_name,
                'type': field_type,
                'required': field_required,
                'validation': field_validation,
                'error_messages': field_error_messages,
                'options': field.options
            }
            
            # Add validator to the class
            field_validators[f'validate_{field_name}'] = create_field_validator(field_info)
            
            # Set type annotation and default
            if field.type in ['text', 'email', 'password', 'dropdown']:
                ann_type = str
            elif field.type == 'date':
                ann_type = str  # We'll validate as string and convert
            elif field.type == 'number':
                ann_type = Union[int, float, str]  # Accept multiple types
            else:
                ann_type = Any
            
            # Add field to model
            annotations[field_name] = ann_type if field_required else Optional[ann_type]
            if field_required:
                defaults[field_name] = Field(..., description=field.label)
            else:
                defaults[field_name] = Field(None, description=field.label)
        
        # Create the dynamic model
        model_name = f"DynamicFormSubmission_{form_schema.title.replace(' ', '_')}"
        
        # Create the model class
        model_class = type(
            model_name,
            (BaseModel,),
            {
                '__annotations__': annotations,
                **defaults,
                **field_validators,
                '__doc__': f"Dynamic form submission model for: {form_schema.title}"
            }
        )
        
        return model_class
    
    @staticmethod
    def _validate_text_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> str:
        """Validates text field with length and pattern constraints"""
        if not isinstance(v, str):
            raise ValueError("ערך חייב להיות מחרוזת")
        
        if validation:
            if validation.minLength and len(v) < validation.minLength:
                error_msg = error_messages.minLength if error_messages and error_messages.minLength else f"מינימום {validation.minLength} תווים"
                raise ValueError(error_msg)
            
            if validation.maxLength and len(v) > validation.maxLength:
                error_msg = error_messages.maxLength if error_messages and error_messages.maxLength else f"מקסימום {validation.maxLength} תווים"
                raise ValueError(error_msg)
            
            if validation.pattern:
                if not re.match(validation.pattern, v):
                    error_msg = error_messages.pattern if error_messages and error_messages.pattern else "ערך לא עומד בתבנית הנדרשת"
                    raise ValueError(error_msg)
        
        return v
    
    @staticmethod
    def _validate_email_field(v: Any, error_messages: Optional[Any]) -> str:
        """Validates email field format"""
        if not isinstance(v, str):
            raise ValueError("ערך חייב להיות מחרוזת")
        
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, v):
            error_msg = error_messages.email if error_messages and error_messages.email else "כתובת אימייל לא תקינה"
            raise ValueError(error_msg)
        
        return v
    
    @staticmethod
    def _validate_password_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> str:
        """Validates password field with length and pattern constraints"""
        if not isinstance(v, str):
            raise ValueError("ערך חייב להיות מחרוזת")
        
        if validation:
            if validation.minLength and len(v) < validation.minLength:
                error_msg = error_messages.minLength if error_messages and error_messages.minLength else f"מינימום {validation.minLength} תווים"
                raise ValueError(error_msg)
            
            if validation.pattern:
                if not re.match(validation.pattern, v):
                    error_msg = error_messages.pattern if error_messages and error_messages.pattern else "סיסמה לא עומדת בדרישות"
                    raise ValueError(error_msg)
        
        return v
    
    @staticmethod
    def _validate_date_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> str:
        """Validates date field with range constraints"""
        try:
            if isinstance(v, str):
                date_value = datetime.strptime(v, "%Y-%m-%d").date()
            elif isinstance(v, date):
                date_value = v
                v = date_value.strftime("%Y-%m-%d")
            else:
                raise ValueError("ערך חייב להיות תאריך תקין")
            
            if validation:
                if validation.minDate:
                    min_date = datetime.strptime(validation.minDate, "%Y-%m-%d").date()
                    if date_value < min_date:
                        error_msg = error_messages.minDate if error_messages and error_messages.minDate else f"תאריך מוקדם מדי (מינימום: {validation.minDate})"
                        raise ValueError(error_msg)
                
                if validation.maxDate:
                    max_date = datetime.strptime(validation.maxDate, "%Y-%m-%d").date()
                    if date_value > max_date:
                        error_msg = error_messages.maxDate if error_messages and error_messages.maxDate else f"תאריך מאוחר מדי (מקסימום: {validation.maxDate})"
                        raise ValueError(error_msg)
        
        except ValueError as e:
            if "תאריך מוקדם מדי" in str(e) or "תאריך מאוחר מדי" in str(e):
                raise e
            raise ValueError("פורמט תאריך לא תקין. השתמש בפורמט YYYY-MM-DD")
        
        return v
    
    @staticmethod
    def _validate_number_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> Union[int, float]:
        """Validates number field with range constraints"""
        try:
            num_value = float(v) if v is not None else None
            if num_value is None:
                raise ValueError("ערך חייב להיות מספר")
            
            if validation:
                if validation.min is not None and num_value < validation.min:
                    error_msg = error_messages.min if error_messages and error_messages.min else f"ערך מינימלי: {validation.min}"
                    raise ValueError(error_msg)
                
                if validation.max is not None and num_value > validation.max:
                    error_msg = error_messages.max if error_messages and error_messages.max else f"ערך מקסימלי: {validation.max}"
                    raise ValueError(error_msg)
        
        except (ValueError, TypeError) as e:
            if "ערך מינימלי" in str(e) or "ערך מקסימלי" in str(e):
                raise e
            raise ValueError("ערך חייב להיות מספר תקין")
        
        return num_value
    
    @staticmethod
    def _validate_dropdown_field(v: Any, options: Optional[list], error_messages: Optional[Any]) -> str:
        """Validates dropdown field against available options"""
        if not isinstance(v, str):
            raise ValueError("ערך חייב להיות מחרוזת")
        
        valid_options = [option.value for option in options] if options else []
        if v not in valid_options:
            error_msg = error_messages.invalidOption if error_messages and error_messages.invalidOption else "אפשרות לא תקינה"
            raise ValueError(error_msg)
        
        return v 