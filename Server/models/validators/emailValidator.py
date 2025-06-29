"""
Email Field Validator

This module contains validation logic specifically for email fields.
"""

import re
from typing import Any, Optional


def validate_email_field(v: Any, error_messages: Optional[Any]) -> str:
    """Validates email field format"""
    if not isinstance(v, str):
        raise ValueError("Value must be a string")
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, v):
        error_msg = error_messages.email if error_messages and error_messages.email else "Invalid email format"
        raise ValueError(error_msg)
    
    return v 