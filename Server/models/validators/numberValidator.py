"""
Number Field Validator

This module contains validation logic specifically for number fields.
"""

from typing import Any, Optional, Union


def validate_number_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> Union[int, float]:
    """Validates number field with range constraints"""
    try:
        num_value = float(v) if v is not None else None
        if num_value is None:
            raise ValueError("Value must be a number")
        
        if validation:
            if validation.min is not None and num_value < validation.min:
                error_msg = error_messages.min if error_messages and error_messages.min else f"Minimum value: {validation.min}"
                raise ValueError(error_msg)
            
            if validation.max is not None and num_value > validation.max:
                error_msg = error_messages.max if error_messages and error_messages.max else f"Maximum value: {validation.max}"
                raise ValueError(error_msg)
    
    except (ValueError, TypeError) as e:
        if "Minimum value:" in str(e) or "Maximum value:" in str(e):
            raise e
        raise ValueError("Value must be a valid number")
    
    return num_value 