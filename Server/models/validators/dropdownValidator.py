"""
Dropdown Field Validator

This module contains validation logic specifically for dropdown fields.
"""

from typing import Any, Optional


def validate_dropdown_field(v: Any, options: Optional[list], error_messages: Optional[Any]) -> str:
    """Validates dropdown field against available options"""
    if not isinstance(v, str):
        raise ValueError("Value must be a string")
    
    valid_options = [option.value for option in options] if options else []
    if v not in valid_options:
        error_msg = error_messages.invalidOption if error_messages and error_messages.invalidOption else "Invalid option"
        raise ValueError(error_msg)
    
    return v 