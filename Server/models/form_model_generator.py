"""
Dynamic form submission model generator

This module contains the DynamicFormSubmissionGenerator class which creates
Pydantic models dynamically based on form schemas for validation purposes.
"""

from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any, Union, Optional, Type

from .form_schema import FormSchema
from .validators import (
    validate_text_field,
    validate_email_field,
    validate_password_field,
    validate_date_field,
    validate_number_field,
    validate_dropdown_field
)

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
                        return validate_text_field(v, field_validation, field_error_messages)
                    
                    elif field_type == "email":
                        return validate_email_field(v, field_error_messages)
                    
                    elif field_type == "password":
                        return validate_password_field(v, field_validation, field_error_messages)
                    
                    elif field_type == "date":
                        return validate_date_field(v, field_validation, field_error_messages)
                    
                    elif field_type == "number":
                        return validate_number_field(v, field_validation, field_error_messages)
                    
                    elif field_type == "dropdown":
                        return validate_dropdown_field(v, field_info['options'], field_error_messages)
                    
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