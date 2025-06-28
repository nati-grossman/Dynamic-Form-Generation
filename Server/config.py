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
- SECRET_KEY: Secret key for JWT tokens
- ALGORITHM: JWT algorithm (default: HS256)
- ACCESS_TOKEN_EXPIRE_MINUTES: JWT token expiration time
- MAX_FILE_SIZE: Maximum file upload size in bytes
- UPLOAD_DIR: Directory for file uploads
- LOG_LEVEL: Logging level (INFO, DEBUG, WARNING, ERROR)
- LOG_FILE: Path to log file
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

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
"""
Secret key used for JWT token signing.
IMPORTANT: Change this in production!
Default: your-secret-key-here-change-in-production
"""

ALGORITHM = os.getenv("ALGORITHM", "HS256")
"""
JWT algorithm for token signing.
Options: HS256, HS384, HS512, RS256, etc.
Default: HS256
"""

ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
"""
JWT access token expiration time in minutes.
Default: 30 minutes
"""

# File Upload
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 10485760))  # 10MB
"""
Maximum file size for uploads in bytes.
Default: 10MB (10485760 bytes)
"""

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
"""
Directory path for storing uploaded files.
Default: uploads
"""

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
"""
Logging level for the application.
Options: DEBUG, INFO, WARNING, ERROR, CRITICAL
Default: INFO
"""

LOG_FILE = os.getenv("LOG_FILE", "logs/app.log")
"""
Path to the log file.
Default: logs/app.log
""" 