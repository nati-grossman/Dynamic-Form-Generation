import pytest
from datetime import date
from pydantic import ValidationError
from models import (
    FormSchema, FormField, FieldValidation, FieldErrorMessages, 
    DropdownOption, DynamicFormSubmissionGenerator
)

class TestPydanticValidation:
    """Test Pydantic-based form validation"""
    
    def test_text_field_validation(self):
        """Test text field validation with Pydantic"""
        # Create form schema
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="name",
                    label="שם",
                    type="text",
                    required=True,
                    validation=FieldValidation(minLength=3, maxLength=10),
                    errorMessages=FieldErrorMessages(
                        minLength="מינימום 3 תווים",
                        maxLength="מקסימום 10 תווים"
                    )
                )
            ]
        )
        
        # Create dynamic model
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid input
        valid_data = {"name": "ישראל"}
        validated = dynamic_model(**valid_data)
        assert validated.name == "ישראל"
        
        # Test too short
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"name": "י"})
        assert "מינימום 3 תווים" in str(exc_info.value)
        
        # Test too long
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"name": "ישראלישראלישראל"})
        assert "מקסימום 10 תווים" in str(exc_info.value)
    
    def test_email_field_validation(self):
        """Test email field validation with Pydantic"""
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="email",
                    label="אימייל",
                    type="email",
                    required=True,
                    errorMessages=FieldErrorMessages(
                        email="כתובת אימייל לא תקינה"
                    )
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid email
        valid_data = {"email": "test@example.com"}
        validated = dynamic_model(**valid_data)
        assert validated.email == "test@example.com"
        
        # Test invalid email
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"email": "invalid-email"})
        assert "כתובת אימייל לא תקינה" in str(exc_info.value)
    
    def test_date_field_validation(self):
        """Test date field validation with Pydantic"""
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="birth_date",
                    label="תאריך לידה",
                    type="date",
                    required=True,
                    validation=FieldValidation(
                        minDate="1900-01-01",
                        maxDate="2020-12-31"
                    ),
                    errorMessages=FieldErrorMessages(
                        minDate="תאריך מוקדם מדי",
                        maxDate="תאריך מאוחר מדי"
                    )
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid date
        valid_data = {"birth_date": "1990-05-15"}
        validated = dynamic_model(**valid_data)
        assert validated.birth_date == "1990-05-15"
        
        # Test too early date
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"birth_date": "1800-01-01"})
        assert "תאריך מוקדם מדי" in str(exc_info.value)
        
        # Test too late date
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"birth_date": "2025-01-01"})
        assert "תאריך מאוחר מדי" in str(exc_info.value)
        
        # Test invalid format
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"birth_date": "15/05/1990"})
        assert "פורמט תאריך לא תקין" in str(exc_info.value)
    
    def test_number_field_validation(self):
        """Test number field validation with Pydantic"""
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="age",
                    label="גיל",
                    type="number",
                    required=True,
                    validation=FieldValidation(min=18, max=120),
                    errorMessages=FieldErrorMessages(
                        min="ערך מינימלי: 18",
                        max="ערך מקסימלי: 120"
                    )
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid number
        valid_data = {"age": 25}
        validated = dynamic_model(**valid_data)
        assert validated.age == 25
        
        # Test too small
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"age": 15})
        assert "ערך מינימלי: 18" in str(exc_info.value)
        
        # Test too large
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"age": 150})
        assert "ערך מקסימלי: 120" in str(exc_info.value)
    
    def test_dropdown_field_validation(self):
        """Test dropdown field validation with Pydantic"""
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="country",
                    label="מדינה",
                    type="dropdown",
                    required=True,
                    options=[
                        DropdownOption(value="israel", label="ישראל"),
                        DropdownOption(value="usa", label="ארצות הברית"),
                        DropdownOption(value="uk", label="בריטניה")
                    ],
                    errorMessages=FieldErrorMessages(
                        invalidOption="אפשרות לא תקינה"
                    )
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid option
        valid_data = {"country": "israel"}
        validated = dynamic_model(**valid_data)
        assert validated.country == "israel"
        
        # Test invalid option
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"country": "invalid"})
        assert "אפשרות לא תקינה" in str(exc_info.value)
    
    def test_password_field_validation(self):
        """Test password field validation with Pydantic"""
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="password",
                    label="סיסמה",
                    type="password",
                    required=True,
                    validation=FieldValidation(
                        minLength=8,
                        pattern=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$"
                    ),
                    errorMessages=FieldErrorMessages(
                        minLength="מינימום 8 תווים",
                        pattern="סיסמה לא עומדת בדרישות"
                    )
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid password
        valid_data = {"password": "Password123"}
        validated = dynamic_model(**valid_data)
        assert validated.password == "Password123"
        
        # Test too short
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"password": "Pass1"})
        assert "מינימום 8 תווים" in str(exc_info.value)
        
        # Test invalid pattern
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**{"password": "password123"})  # No uppercase
        assert "סיסמה לא עומדת בדרישות" in str(exc_info.value)
    
    def test_optional_field_validation(self):
        """Test optional field validation with Pydantic"""
        form_schema = FormSchema(
            title="Test Form",
            fields=[
                FormField(
                    name="required_field",
                    label="שדה חובה",
                    type="text",
                    required=True
                ),
                FormField(
                    name="optional_field",
                    label="שדה אופציונלי",
                    type="text",
                    required=False
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test with only required field
        valid_data = {"required_field": "ערך"}
        validated = dynamic_model(**valid_data)
        assert validated.required_field == "ערך"
        assert validated.optional_field is None
        
        # Test with both fields
        valid_data = {"required_field": "ערך", "optional_field": "ערך נוסף"}
        validated = dynamic_model(**valid_data)
        assert validated.required_field == "ערך"
        assert validated.optional_field == "ערך נוסף"
        
        # Test missing required field
        with pytest.raises(ValidationError):
            dynamic_model(**{"optional_field": "ערך נוסף"})
    
    def test_complex_form_validation(self):
        """Test complex form with multiple field types"""
        form_schema = FormSchema(
            title="טופס מורכב",
            fields=[
                FormField(
                    name="full_name",
                    label="שם מלא",
                    type="text",
                    required=True,
                    validation=FieldValidation(minLength=2, maxLength=50)
                ),
                FormField(
                    name="email",
                    label="אימייל",
                    type="email",
                    required=True
                ),
                FormField(
                    name="age",
                    label="גיל",
                    type="number",
                    required=True,
                    validation=FieldValidation(min=18, max=120)
                ),
                FormField(
                    name="country",
                    label="מדינה",
                    type="dropdown",
                    required=True,
                    options=[
                        DropdownOption(value="israel", label="ישראל"),
                        DropdownOption(value="usa", label="ארצות הברית")
                    ]
                )
            ]
        )
        
        dynamic_model = DynamicFormSubmissionGenerator.create_submission_model(form_schema)
        
        # Test valid complex form
        valid_data = {
            "full_name": "ישראל ישראלי",
            "email": "israel@example.com",
            "age": 30,
            "country": "israel"
        }
        validated = dynamic_model(**valid_data)
        assert validated.full_name == "ישראל ישראלי"
        assert validated.email == "israel@example.com"
        assert validated.age == 30
        assert validated.country == "israel"
        
        # Test invalid complex form
        invalid_data = {
            "full_name": "י",  # Too short
            "email": "invalid-email",  # Invalid email
            "age": 15,  # Too young
            "country": "invalid"  # Invalid option
        }
        
        with pytest.raises(ValidationError) as exc_info:
            dynamic_model(**invalid_data)
        
        errors = exc_info.value.errors()
        assert len(errors) >= 4  # Should have multiple validation errors 