"""
Password Field Validator

This module contains validation logic specifically for password fields.
"""

import re
from typing import Any, Optional


def validate_password_field(v: Any, validation: Optional[Any], error_messages: Optional[Any]) -> str:
    """Validates password field with length and pattern constraints"""
    if not isinstance(v, str):
        raise ValueError("Value must be a string")
    
    if validation:
        if validation.minLength and len(v) < validation.minLength:
            error_msg = error_messages.minLength if error_messages and error_messages.minLength else f"Minimum {validation.minLength} characters"
            raise ValueError(error_msg)
        
        if validation.maxLength and len(v) > validation.maxLength:
            error_msg = error_messages.maxLength if error_messages and error_messages.maxLength else f"Maximum {validation.maxLength} characters"
            raise ValueError(error_msg)
        
        if validation.pattern:
            if not re.match(validation.pattern, v):
                error_msg = error_messages.pattern if error_messages and error_messages.pattern else "Password does not meet requirements"
                raise ValueError(error_msg)
    
    return v 