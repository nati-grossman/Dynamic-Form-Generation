from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import ALLOWED_ORIGINS, HOST, PORT, DEBUG
from routers import forms, submissions
from database import create_tables

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for the application"""
    # Startup
    try:
        create_tables()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Warning: Could not create database tables: {e}")
        print("Server will run without database functionality")
    
    yield
    
    # Shutdown
    print("Shutting down server...")

app = FastAPI(
    title="Dynamic Form Generator API",
    description="API for generating and managing dynamic forms",
    version="1.0.0",
    debug=DEBUG,
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forms.router)
app.include_router(submissions.router)

@app.get("/")
def read_root():
    return {
        "message": "Dynamic Form Generator API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=HOST, port=PORT, reload=DEBUG) 