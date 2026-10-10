# SecureShop — Intentionally Vulnerable E-Commerce Lab

An educational, deliberately-vulnerable full-stack e-commerce app for practicing web
application security testing. **Run it locally only — never expose it to the internet.**

Stack: React + Vite + Tailwind (frontend), FastAPI + SQLite + JWT (backend).

## Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py             # creates & seeds secureshop.db
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. The backend runs on **http://localhost:8000**
(interactive API docs at `/docs`).

## Sample accounts

| username | password    | role     |
|----------|-------------|----------|
| alice    | alice123    | customer |
| bob      | bobpassword | customer |
| admin    | admin2024   | admin    |

## Scope

Everything runs on your machine against a local SQLite file. No outbound calls,
no real payment processing, no real email sending. Safe to attack as much as you like —
it's yours.

## Resetting data

Re-run `python seed_data.py` at any time to wipe and reseed the database.
