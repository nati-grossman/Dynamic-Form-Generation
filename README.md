# Dynamic Form Generation System

A system for creating dynamic forms based on JSON files with advanced validation support and database storage.

## Features

- ✅ Dynamic form creation from JSON files
- ✅ Support for field types: text, email, password, date, number, dropdown
- ✅ Advanced validation with Pydantic v2 and custom error messages
- ✅ Form storage in PostgreSQL database
- ✅ Modern UI with Material UI
- ✅ Full Hebrew and RTL support
- ✅ Example file download
- ✅ Display list of submitted forms
- ✅ Delete all forms
- ✅ Modular architecture with separate routers and services
- ✅ Pydantic models split into separate files
- ✅ Dynamic model generator for runtime validation
- ✅ Full environment variables support
- ✅ Comprehensive documentation for each module
- ✅ CORS and Swagger docs support

## Project Structure

```
Dynamic Form Generation/
├── README.md                   # Project documentation
├── .gitignore                  # Files to ignore in Git
├── start.bat                   # Quick start for Windows
├── start.sh                    # Quick start for Linux/Mac
│
├── Server/                     # Python server with FastAPI
│   ├── main.py                # Main server file
│   ├── config.py              # Settings and environment variables
│   ├── models.py              # Pydantic models entry point
│   ├── database.py            # Database configuration
│   ├── requirements.txt       # Python dependencies
│   │
│   ├── routers/               # Controllers (API Routes)
│   │   ├── forms.py          # Forms controller
│   │   └── submissions.py    # Submissions controller
│   │
│   ├── services/              # Service layer
│   │   ├── __init__.py       # Services export
│   │   ├── form_service.py   # Forms service
│   │   └── submission_service.py # Submissions service
│   │
│   ├── models/                # Split Pydantic models
│   │   ├── __init__.py       # Export all models
│   │   ├── base.py           # Base models
│   │   ├── form_field.py     # Form field model
│   │   ├── form_schema.py    # Form schema model
│   │   ├── submission.py     # Submission model
│   │   └── dynamic_validator.py # Dynamic model generator
│   │
│   └── files/                 # System files
│       ├── example_file/      # Example file
│       │   └── example1.json  # Example file for user download
│       └── user_file/         # User files
│           └── current_form.json # Current schema
│
├── Client/                    # React app with TypeScript
│   ├── package.json          # Node.js dependencies
│   ├── package-lock.json     # Version lock
│   ├── tsconfig.json         # TypeScript settings
│   │
│   ├── public/               # Static files
│   │   ├── index.html        # Main HTML
│   │   └── manifest.json     # App manifest
│   │
│   └── src/                  # Source code
│       ├── index.tsx         # App entry point
│       ├── App.tsx           # Main component
│       │
│       ├── components/       # React components
│       │   ├── DynamicForm/  # Dynamic form component
│       │   │   ├── index.tsx # Main form component
│       │   │   ├── fieldRenderer.tsx # Main field renderer
│       │   │   ├── types.ts  # Specific types
│       │   │   ├── validation.ts # Validation logic
│       │   │   └── renderers/ # Separate renderers for each field type
│       │   │       ├── index.ts # Renderers export
│       │   │       ├── TextFieldRenderer.tsx
│       │   │       ├── DateFieldRenderer.tsx
│       │   │       ├── NumberFieldRenderer.tsx
│       │   │       └── SelectFieldRenderer.tsx
│       │   ├── FileUpload.tsx # File upload component
│       │   ├── MessageDisplay.tsx # Messages component
│       │   ├── StatisticsDialog.tsx # Statistics component
│       │   └── SubmissionsList.tsx # Submissions list component
│       │
│       ├── services/         # API services
│       │   ├── index.ts      # Services export
│       │   ├── apiService.ts # Basic API service
│       │   ├── formService.ts # Forms service
│       │   └── submissionService.ts # Submissions service
│       │
│       ├── store/            # App state management
│       │   ├── index.ts      # Store export
│       │   ├── context.tsx   # React Context
│       │   ├── hooks.ts      # Custom hooks
│       │   ├── actions.ts    # Store actions
│       │   └── reducer.ts    # State update reducer
│       │
│       ├── hooks/            # Custom hooks
│       │   ├── useInitialData.ts # Initial data hook
│       │   └── useSubmissions.ts # Submissions hook
│       │
│       └── types/            # Type definitions
│           └── index.ts      # Global types
│
└── Files to upload/          # Example files for upload
    ├── example1.json         # Example 1: Product order form (with dropdown)
    ├── example2.json         # Example 2: Contact form
    ├── example3.json         # Example 3: Course registration form
    └── example4.json         # Example 4: Satisfaction survey
```

## Installation and Setup

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL

### 1. Database Setup

```sql
CREATE DATABASE dynamic_forms;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE dynamic_forms TO postgres;
```

### 2. Environment Variables (Optional)

You can create a `.env` file in the `Server/` directory to modify default settings:

```env
# Database Configuration
DATABASE_URL=postgresql+psycopg://postgres:password@localhost/dynamic_forms

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

**Note**: All variables are optional and have appropriate default values for development.

### 3. Server Setup

```bash
cd Server
pip install -r requirements.txt

# Start server
python main.py
```

Server will run on: http://localhost:8000

### 4. Client Setup

```bash
cd Client
npm install
npm start
```

Client will run on: http://localhost:3000

### 5. Quick Start

- Windows: `start.bat`
- Linux/Mac: `./start.sh`

## Using the System

### 1. Download Example File

Click "Download Example File" button to download a JSON file with valid structure.

### 2. Upload JSON File

Click "Upload JSON File" and select a valid JSON file. The system will validate the file and display an appropriate message.

### 3. Fill the Form

After uploading a valid file, the form will appear automatically. Fill the fields and click "Submit Form".

### 4. View Submitted Forms

On the right side you can see all submitted forms. Click the delete button to delete all forms.

### 5. View Statistics

Click the "Statistics" button to see detailed statistics about submitted forms.

## JSON File Structure

```json
{
  "title": "Form Title",
  "fields": [
    {
      "name": "fieldName",
      "label": "Field Label",
      "type": "text|email|password|date|number|dropdown",
      "required": true,
      "validation": {
        "minLength": 3,
        "maxLength": 100,
        "min": 1,
        "max": 1000,
        "minDate": "2020-01-01",
        "maxDate": "2025-12-31",
        "pattern": "regex_pattern"
      },
      "errorMessages": {
        "required": "Error message for required field",
        "minLength": "Error message for minimum length",
        "maxLength": "Error message for maximum length"
      },
      "options": [
        { "value": "option1", "label": "Label 1" },
        { "value": "option2", "label": "Label 2" }
      ]
    }
  ]
}
```

## API Endpoints

### Forms (`/forms`)

- `GET /forms/download-example` - Download example file
- `POST /forms/upload-schema` - Upload JSON file
- `GET /forms/current-schema` - Get current schema
- `POST /forms/submit` - Submit form

### Submissions (`/submissions`)

- `GET /submissions/` - Get all submitted forms
- `GET /submissions/statistics` - Get submission statistics
- `DELETE /submissions/` - Delete all forms

## Technologies

### Server

- **FastAPI**: Fast API framework with automatic Swagger support
- **Pydantic v2**: Advanced validation and serialization
- **SQLAlchemy**: Database ORM
- **PostgreSQL**: Relational database
- **Services Layer**: Business logic separation from routers
- **Dynamic Models**: Runtime validation model creation

### Client

- **React**: UI library
- **TypeScript**: Type safety
- **Material UI**: Modern UI components
- **Formik + Yup**: Form management and validation
- **Fetch API**: Native HTTP communication with server

### Communication

- **RESTful API**: Structured endpoints
- **CORS**: Cross-origin access support
- **JSON**: Standard data format

## Supported Field Types

| Field Type | Description   | Supported Validations         |
| ---------- | ------------- | ----------------------------- |
| text       | Regular text  | minLength, maxLength, pattern |
| email      | Email address | email format                  |
| password   | Password      | minLength, pattern            |
| date       | Date          | minDate, maxDate              |
| number     | Number        | min, max                      |
| dropdown   | Select list   | options validation            |

## Error Messages

The system supports custom error messages for each field. If no error messages are defined, the system will use default messages in English.

## System Architecture

### Server (Backend)

- **FastAPI**: Fast API framework with automatic Swagger support
- **Pydantic v2**: Advanced validation and serialization
- **SQLAlchemy**: Database ORM
- **PostgreSQL**: Relational database
- **Services Layer**: Business logic separation from routers
- **Dynamic Models**: Runtime validation model creation

### Client (Frontend)

- **React**: UI library
- **TypeScript**: Type safety
- **Material UI**: Modern UI components
- **Formik + Yup**: Form management and validation
- **Fetch API**: Native HTTP communication with server

### Communication

- **RESTful API**: Structured endpoints
- **CORS**: Cross-origin access support
- **JSON**: Standard data format
