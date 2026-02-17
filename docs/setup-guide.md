# Setup Guide (Local)

## Prerequisites
- Node.js (LTS)
- Python 3.10+
- MongoDB (local) OR MongoDB Atlas
- Git

---

## Frontend Setup (React)
cd client
npm install
npm run dev

Frontend runs on:
http://localhost:5173

---

## Backend Setup (FastAPI)
cd server

Create venv:
python -m venv venv
venv\Scripts\activate

Install dependencies:
pip install -r requirements.txt

Run server:
uvicorn app.main:app --reload --port 8000

Backend runs on:
http://localhost:8000

---

## Environment Variables
Create a .env file inside server/:

MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=campusvault
JWT_SECRET=your_secret_key
