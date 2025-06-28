import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from main import app
from database import Base, get_db, generate_data_hash, check_duplicate_submission

# Create in-memory database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def setup_database():
    """Setup database before each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

class TestSubmissions:
    """Test cases for submission functionality"""
    
    def test_create_submission_success(self):
        """Test successful submission creation"""
        client = TestClient(app)
        
        form_data = {
            "name": "John Doe",
            "email": "john@example.com",
            "age": 30
        }
        
        request_data = {
            "form_data": form_data,
            "form_title": "User Registration Form"
        }
        
        response = client.post("/submissions/", json=request_data)
        assert response.status_code == 200
        
        result = response.json()
        assert "id" in result
        assert result["form_title"] == "User Registration Form"
        assert result["data"] == form_data
        assert "submitted_at" in result
        assert result["message"] == "הטפס נשמר בהצלחה"
    
    def test_create_duplicate_submission_fails(self):
        """Test that duplicate submissions are rejected"""
        client = TestClient(app)
        
        form_data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "age": 25
        }
        
        request_data = {
            "form_data": form_data,
            "form_title": "User Registration Form"
        }
        
        # First submission should succeed
        response1 = client.post("/submissions/", json=request_data)
        assert response1.status_code == 200
        
        # Second submission with same data should fail
        response2 = client.post("/submissions/", json=request_data)
        assert response2.status_code == 400
        assert response2.json()["detail"] == "קיים דאטה כזה במסד נתונים"
    
    def test_get_all_submissions(self):
        """Test getting all submissions"""
        client = TestClient(app)
        
        # Create some submissions
        form_data1 = {"name": "Alice", "email": "alice@example.com"}
        form_data2 = {"name": "Bob", "email": "bob@example.com"}
        
        request_data1 = {"form_data": form_data1, "form_title": "Form 1"}
        request_data2 = {"form_data": form_data2, "form_title": "Form 2"}
        
        client.post("/submissions/", json=request_data1)
        client.post("/submissions/", json=request_data2)
        
        # Get all submissions
        response = client.get("/submissions/")
        assert response.status_code == 200
        
        submissions = response.json()
        assert len(submissions) == 2
        
        # Check that both submissions are returned
        submission_data = [s["data"] for s in submissions]
        assert form_data1 in submission_data
        assert form_data2 in submission_data
        
        # Check form titles
        form_titles = [s["form_title"] for s in submissions]
        assert "Form 1" in form_titles
        assert "Form 2" in form_titles
    
    def test_delete_all_submissions(self):
        """Test deleting all submissions"""
        client = TestClient(app)
        
        # Create some submissions
        form_data = {"name": "Test", "email": "test@example.com"}
        request_data = {"form_data": form_data, "form_title": "Test Form"}
        client.post("/submissions/", json=request_data)
        
        # Verify submission exists
        response = client.get("/submissions/")
        assert len(response.json()) == 1
        
        # Delete all submissions
        response = client.delete("/submissions/")
        assert response.status_code == 200
        assert response.json()["message"] == "כל הטפסים נמחקו בהצלחה"
        
        # Verify no submissions remain
        response = client.get("/submissions/")
        assert len(response.json()) == 0

class TestDataHash:
    """Test cases for data hash functionality"""
    
    def test_generate_data_hash_consistency(self):
        """Test that same data generates same hash regardless of field order"""
        data1 = {"name": "John", "email": "john@example.com", "age": 30}
        data2 = {"age": 30, "email": "john@example.com", "name": "John"}
        
        hash1 = generate_data_hash(data1)
        hash2 = generate_data_hash(data2)
        
        assert hash1 == hash2
    
    def test_generate_data_hash_uniqueness(self):
        """Test that different data generates different hashes"""
        data1 = {"name": "John", "email": "john@example.com"}
        data2 = {"name": "Jane", "email": "jane@example.com"}
        
        hash1 = generate_data_hash(data1)
        hash2 = generate_data_hash(data2)
        
        assert hash1 != hash2 