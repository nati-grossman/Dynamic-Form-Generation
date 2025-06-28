# מערכת טפסים דינמית

מערכת ליצירת טפסים דינמיים לפי קובץ JSON עם תמיכה בוולידציה מתקדמת ושמירה במסד נתונים.

## תכונות

- ✅ יצירת טפסים דינמיים לפי קובץ JSON
- ✅ תמיכה בסוגי שדות: text, email, password, date, number, dropdown
- ✅ וולידציה מתקדמת עם Pydantic v2 והודעות שגיאה מותאמות
- ✅ שמירת טפסים במסד נתונים PostgreSQL
- ✅ ממשק משתמש מודרני עם Material UI
- ✅ תמיכה מלאה בעברית ו-RTL
- ✅ הורדת קובץ דוגמה
- ✅ הצגת רשימת הטפסים שהוגשו
- ✅ מחיקת כל הטפסים
- ✅ ארכיטקטורה מודולרית עם routers ו-services נפרדים
- ✅ מודלים Pydantic מפוצלים לקבצים נפרדים
- ✅ מחולל מודלים דינמיים לוולידציה בזמן ריצה
- ✅ טסטים מקיפים עם Pytest
- ✅ תמיכה מלאה במשתני סביבה
- ✅ דוקומנטציה מפורטת לכל מודול
- ✅ תמיכה ב-CORS ו-Swagger docs

## מבנה הפרויקט

```
Dynamic Form Generation/
├── Server/                     # שרת Python עם FastAPI
│   ├── main.py                # הקובץ הראשי של השרת
│   ├── config.py              # הגדרות ומשתני סביבה
│   ├── models.py              # נקודת כניסה למודלים Pydantic
│   ├── database.py            # הגדרות מסד נתונים
│   ├── requirements.txt       # תלויות Python
│   ├── pytest.ini            # הגדרות טסטים
│   ├── routers/              # קונטולרים
│   │   ├── forms.py          # קונטולר טפסים
│   │   └── submissions.py    # קונטולר הגשות
│   ├── services/             # שכבת שירותים
│   │   ├── form_service.py   # שירות לטפסים
│   │   └── submission_service.py # שירות להגשות
│   ├── models/               # מודלים Pydantic מפוצלים
│   │   ├── __init__.py       # ייצוא כל המודלים
│   │   ├── base.py           # מודלים בסיסיים
│   │   ├── form_field.py     # מודל שדה טופס
│   │   ├── form_schema.py    # מודל סכמת טופס
│   │   ├── submission.py     # מודל הגשה
│   │   └── dynamic_validator.py # מחולל מודלים דינמיים
│   └── tests/                # טסטים
│       └── test_pydantic_validation.py # בדיקות וולידציה
├── Client/                    # לקוח React
│   ├── src/
│   │   ├── App.js            # קומפוננטה ראשית
│   │   ├── api.js            # תקשורת עם השרת
│   │   └── components/       # קומפוננטות
│   │       ├── DynamicForm.js
│   │       └── SubmissionsList.js
│   └── package.json          # תלויות Node.js
└── Files to upload/          # קבצי דוגמה
    ├── example1.json
    └── example2.json
```

## התקנה והפעלה

### דרישות מקדימות

- Python 3.8+
- Node.js 16+
- PostgreSQL

### 1. הגדרת מסד הנתונים

```sql
CREATE DATABASE dynamic_forms;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE dynamic_forms TO postgres;
```

### 2. הגדרת משתני סביבה

צור קובץ `.env` בתיקיית `Server/`:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost/dynamic_forms

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Security
SECRET_KEY=your-secret-key-here-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Logging
LOG_LEVEL=INFO
LOG_FILE=logs/app.log
```

### 3. הפעלת השרת

```bash
cd Server
pip install -r requirements.txt

# הרצת טסטים (אופציונלי)
pytest

# הפעלת השרת
python main.py
```

השרת יפעל על: http://localhost:8000

### 4. הפעלת הלקוח

```bash
cd Client
npm install
npm start
```

הלקוח יפעל על: http://localhost:3000

### 5. הפעלה מהירה

- Windows: `start.bat`
- Linux/Mac: `./start.sh`

## שימוש במערכת

### 1. הורדת קובץ דוגמה

לחץ על כפתור "הורד קובץ דוגמה" כדי להוריד קובץ JSON עם מבנה תקין.

### 2. העלאת קובץ JSON

לחץ על "העלה קובץ JSON" ובחר קובץ JSON תקין. המערכת תבדוק את תקינות הקובץ ותציג הודעה מתאימה.

### 3. מילוי הטופס

לאחר העלאת קובץ תקין, הטופס יופיע אוטומטית. מלא את השדות ולחץ על "שלח טופס".

### 4. צפייה בטפסים שהוגשו

בצד ימין תוכל לראות את כל הטפסים שהוגשו. לחץ על כפתור המחיקה כדי למחוק את כל הטפסים.

## מבנה קובץ JSON

```json
{
  "title": "כותרת הטופס",
  "fields": [
    {
      "name": "fieldName",
      "label": "תווית השדה",
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
        "required": "הודעת שגיאה לשדה חובה",
        "minLength": "הודעת שגיאה לאורך מינימלי",
        "maxLength": "הודעת שגיאה לאורך מקסימלי"
      },
      "options": [
        { "value": "option1", "label": "תווית 1" },
        { "value": "option2", "label": "תווית 2" }
      ]
    }
  ]
}
```

## API Endpoints

### טפסים (`/forms`)

- `GET /forms/download-example` - הורדת קובץ דוגמה
- `POST /forms/upload-schema` - העלאת קובץ JSON
- `GET /forms/current-schema` - קבלת הסכמה הנוכחית
- `POST /forms/submit` - שליחת טופס

### הגשות (`/submissions`)

- `GET /submissions/` - קבלת כל הטפסים שהוגשו
- `DELETE /submissions/` - מחיקת כל הטפסים

### כללי

- `GET /` - מידע על ה-API
- `GET /health` - בדיקת בריאות המערכת
- `GET /docs` - תיעוד Swagger

## טכנולוגיות

### שרת

- **FastAPI**: מסגרת API מהירה עם תמיכה אוטומטית ב-Swagger
- **Pydantic v2**: וולידציה וסריאליזציה מתקדמת
- **SQLAlchemy**: ORM למסד נתונים
- **PostgreSQL**: מסד נתונים יחסי
- **Services Layer**: הפרדת לוגיקה עסקית מהראוטרים
- **Dynamic Models**: יצירת מודלי וולידציה דינמיים בזמן ריצה

### לקוח

- **React**: ספריית UI
- **Material UI**: רכיבי UI מודרניים
- **Formik + Yup**: ניהול טפסים ווולידציה
- **Axios**: תקשורת HTTP עם השרת

### תקשורת

- **RESTful API**: endpoints מובנים
- **CORS**: תמיכה בגישה צולבת
- **JSON**: פורמט נתונים סטנדרטי

## תמיכה בסוגי שדות

| סוג שדה  | תיאור        | וולידציות נתמכות              |
| -------- | ------------ | ----------------------------- |
| text     | טקסט רגיל    | minLength, maxLength, pattern |
| email    | כתובת אימייל | email format                  |
| password | סיסמה        | minLength, pattern            |
| date     | תאריך        | minDate, maxDate              |
| number   | מספר         | min, max                      |
| dropdown | רשימה נפתחת  | options validation            |

## הודעות שגיאה

המערכת תומכת בהודעות שגיאה מותאמות אישית לכל שדה. אם לא מוגדרות הודעות שגיאה, המערכת תשתמש בהודעות ברירת מחדל בעברית.

## הרצת טסטים

```bash
cd Server
pytest                    # הרצת כל הטסטים
pytest -v                # הרצה מפורטת
pytest tests/test_pydantic_validation.py  # הרצת טסטים ספציפיים
pytest tests/test_pydantic_validation.py::TestPydanticValidation::test_text_field_validation  # הרצת טסט ספציפי
```

## פיתוח עתידי

- [ ] תמיכה בסוגי שדות נוספים (checkbox, radio, file upload)
- [ ] תמיכה בטפסים מרובי עמודים
- [ ] מערכת הרשאות משתמשים
- [ ] ייצוא נתונים ל-Excel/PDF
- [ ] תמיכה בתבניות טפסים מוכנות
- [ ] מערכת התראות בזמן אמת
- [ ] לוגים מתקדמים
- [ ] מערכת ניטור ביצועים

## ארכיטקטורת המערכת

### שרת (Backend)

- **FastAPI**: מסגרת API מהירה עם תמיכה אוטומטית ב-Swagger
- **Pydantic v2**: וולידציה וסריאליזציה מתקדמת
- **SQLAlchemy**: ORM למסד נתונים
- **PostgreSQL**: מסד נתונים יחסי
- **Services Layer**: הפרדת לוגיקה עסקית מהראוטרים
- **Dynamic Models**: יצירת מודלי וולידציה דינמיים בזמן ריצה

### לקוח (Frontend)

- **React**: ספריית UI
- **Material UI**: רכיבי UI מודרניים
- **Formik + Yup**: ניהול טפסים ווולידציה
- **Axios**: תקשורת HTTP עם השרת

### תקשורת

- **RESTful API**: endpoints מובנים
- **CORS**: תמיכה בגישה צולבת
- **JSON**: פורמט נתונים סטנדרטי
