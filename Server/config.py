"""
Configuration file for Dynamic Form Generation API

This module contains all configuration settings for the application.
Settings can be overridden using environment variables or .env file.

Environment Variables:
- DATABASE_URL: PostgreSQL connection string
- HOST: Server host address (default: 0.0.0.0)
- PORT: Server port (default: 8000)
- DEBUG: Enable debug mode (default: false)
- ALLOWED_ORIGINS: Comma-separated list of allowed CORS origins
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
try:
    load_dotenv(verbose=False)
except Exception:
    pass  # Ignore errors if .env file doesn't exist or is corrupted

# Database Configuration
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://postgres:password@localhost/dynamic_forms")
"""
PostgreSQL database connection URL.
Format: postgresql+psycopg://username:password@host:port/database_name
Default: postgresql+psycopg://postgres:password@localhost/dynamic_forms
Note: Uses psycopg3 driver for Python 3.13 compatibility
"""

# Server Configuration
HOST = os.getenv("HOST", "0.0.0.0")
"""
Server host address to bind to.
- 0.0.0.0: Accept connections from any IP
- 127.0.0.1: Only accept local connections
Default: 0.0.0.0
"""

PORT = int(os.getenv("PORT", 8000))
"""
Server port number.
Default: 8000
"""

DEBUG = os.getenv("DEBUG", "false").lower() == "true"
"""
Enable debug mode for development.
- true: Enable debug logging, auto-reload, detailed error messages
- false: Production mode with minimal logging
Default: false
"""

# CORS Configuration
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
"""
List of allowed origins for CORS (Cross-Origin Resource Sharing).
Comma-separated list of URLs that can access the API.
Default: http://localhost:3000 (React development server)
""" 