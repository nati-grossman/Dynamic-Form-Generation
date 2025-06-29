"""
Date Field Validator

This module contains validation logic specifically for date fields.
"""

from datetime import datetime
from typing import Any, Optional


def validate_date_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> str:
    """Validates date field with range constraints"""
    if not isinstance(v, str):
        raise ValueError("Value must be a string")
    
    # Validate date format
    try:
        date_obj = datetime.strptime(v, "%Y-%m-%d").date()
    except ValueError:
        raise ValueError("Invalid date format. Use YYYY-MM-DD")
    
    if validation:
        if validation.minDate:
            try:
                min_date = datetime.strptime(validation.minDate, "%Y-%m-%d").date()
                if date_obj < min_date:
                    error_msg = error_messages.minDate if error_messages and error_messages.minDate else f"Date must be after {validation.minDate}"
                    raise ValueError(error_msg)
            except ValueError as e:
                if "Invalid date format" not in str(e):
                    raise e
        
        if validation.maxDate:
            try:
                max_date = datetime.strptime(validation.maxDate, "%Y-%m-%d").date()
                if date_obj > max_date:
                    error_msg = error_messages.maxDate if error_messages and error_messages.maxDate else f"Date must be before {validation.maxDate}"
                    raise ValueError(error_msg)
            except ValueError as e:
                if "Invalid date format" not in str(e):
                    raise e
    
    return v 