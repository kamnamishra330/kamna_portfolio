# Kamna Portfolio Website — Hindi Setup Guide

Is project mein HTML, CSS, JavaScript, Python, FastAPI aur SQL (SQLite) ka use hai.

## 1. Zaroori software
- Python 3.10 ya uske baad ka version
- VS Code (recommended)
- Browser: Chrome / Edge

Python check karne ke liye terminal mein:
```bash
python --version
```
Agar Windows par `python` kaam na kare, to `py --version` try karein.

## 2. Folder structure

```text
kamna_portfolio/
├── main.py
├── requirements.txt
├── README_HINDI.md
├── portfolio.db          # server chalne par khud banega
└── static/
    ├── index.html
    ├── style.css
    └── script.js
```

## 3. VS Code mein folder kholein
1. ZIP file extract karein.
2. VS Code kholein.
3. File > Open Folder par click karke `kamna_portfolio` folder select karein.
4. Terminal > New Terminal kholein.

## 4. Virtual environment banayein (recommended)

Windows:
```bash
python -m venv .venv
.venv\Scripts\activate
```

Agar PowerShell activation block kare, CMD terminal khol kar `.venv\Scripts\activate.bat` use karein. Aap virtual environment ke bina bhi packages install kar sakte hain.

## 5. Packages install karein
```bash
pip install -r requirements.txt
```

## 6. Website run karein
Project ke main folder mein ye command chalayein:
```bash
uvicorn main:app --reload
```

Browser mein kholein:
- Website: http://127.0.0.1:8000
- API documentation: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/api/health

Server band karne ke liye terminal mein `Ctrl + C` dabayein.

## 7. Database kaise kaam karta hai?
Pehli baar server start hone par `portfolio.db` file aur `messages` table automatically ban jaati hai.
Contact form submit karne par naam, email aur message database mein save hote hain.

Saved messages dekhne ke liye:
1. Server ko `Ctrl + C` se band karein.
2. Python shell mein ye run karein:
```bash
python
```
3. Phir ye code paste karein:
```python
import sqlite3
con = sqlite3.connect("portfolio.db")
for row in con.execute("SELECT id, name, email, message, created_at FROM messages ORDER BY id DESC"):
    print(row)
con.close()
exit()
```
Database file ko public website par expose na karein. Is demo mein messages dekhne ke liye admin login nahi banaya gaya hai.

## 8. Apni details kaise badlein?
- Naam/intro/education: `static/index.html` mein edit karein.
- Email: `static/index.html` mein `your-email@example.com` ko apne email se replace karein.
- Colors/layout: `static/style.css` mein `:root` ke color variables badlein.
- Projects: `main.py` ke `/api/projects` function ke andar sample project details, technology list aur GitHub URL replace karein.
- Skills: `static/index.html` ke `#skills` section mein update karein.

## 9. Files ka kaam
- `index.html`: website ka content aur sections.
- `style.css`: dark theme, colors, cards, mobile responsive design.
- `script.js`: mobile menu, `/api/projects` se data lana, contact form submit karna.
- `main.py`: FastAPI server, endpoints, input validation aur SQLite database.
- `requirements.txt`: Python packages.

## 10. Common errors
- `uvicorn is not recognized`: `pip install -r requirements.txt` chalayein; phir `python -m uvicorn main:app --reload` try karein.
- `Could not load projects`: check karein ki server chal raha hai aur page `http://127.0.0.1:8000` se khola hai. HTML file ko double-click karke na kholein.
- Email validation error: valid email address daalein.
- Port busy: `python -m uvicorn main:app --reload --port 8001` aur phir `http://127.0.0.1:8001` use karein.

## Important
Ye local learning project hai. Public internet par deploy karne se pehle spam protection, privacy notice, HTTPS, secure admin access, database backups aur hosting configuration add karein. Sirf apni asli skills aur projects hi portfolio mein likhein.
