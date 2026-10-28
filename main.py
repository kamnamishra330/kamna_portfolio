from pathlib import Path
import sqlite3
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr, Field

# Project folders
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
DB_PATH = BASE_DIR / "portfolio.db"


# Database connection
def get_connection():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


# Create SQL table
def create_table():
    with get_connection() as connection:
        connection.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)


# Run database setup when app starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_table()
    yield


app = FastAPI(
    title="Kamna Portfolio API",
    description="Portfolio backend",
    version="1.0.0",
    lifespan=lifespan,
)

# Serve CSS and JavaScript files
app.mount(
    "/static",
    StaticFiles(directory=STATIC_DIR),
    name="static",
)


# Contact form validation
class ContactMessage(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    message: str = Field(min_length=10, max_length=2000)


# Homepage
@app.get("/", include_in_schema=False)
def home():
    return FileResponse(STATIC_DIR / "index.html")


# Check whether backend is running
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Portfolio API is running"
    }


# Save contact form data in SQLite
@app.post("/api/contact", status_code=201)
def save_contact(contact: ContactMessage):
    clean_name = contact.name.strip()
    clean_message = contact.message.strip()

    if not clean_name or not clean_message:
        raise HTTPException(
            status_code=422,
            detail="Name and message cannot be blank."
        )

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO messages (name, email, message)
            VALUES (?, ?, ?)
            """,
            (clean_name, str(contact.email), clean_message),
        )
        message_id = cursor.lastrowid

    return {
        "success": True,
        "message": "Thank you! Your message has been saved.",
        "id": message_id,
    }


# Projects shown on the portfolio
@app.get("/api/projects")
def projects():
    return [
        {
            "title": "Personal Portfolio",
            "description": "My personal portfolio website.",
            "tech": ["HTML", "CSS", "JavaScript", "FastAPI", "SQLite"],
            "github": "https://github.com/"
        },
        {
            "title": "Student Record API",
            "description": "A project to practise student record management.",
            "tech": ["Python", "FastAPI", "SQL"],
            "github": "https://github.com/"
        },
        {
            "title": "Task Manager",
            "description": "A project for practising task management.",
            "tech": ["HTML", "CSS", "JavaScript", "SQLite"],
            "github": "https://github.com/"
        }
    ]
