# Expense Tracker

A minimal full-stack expense tracker built with:

- Backend: Node.js + Express + SQLite
- Frontend: React (Vite)

## Design Decisions

- SQLite chosen for simplicity and persistence.
- Amount stored as integer (paise) to avoid floating-point precision errors.
- Idempotency-Key support added to POST /expenses for safe retries.
- Sorting and filtering handled at database level.
- Clean separation between API and UI.

## Trade-offs

- No authentication (out of scope).
- No pagination (dataset assumed small).
- No advanced caching.

## How to Run

### Backend
cd backend
npm install
npm run dev

Runs on http://localhost:4000

### Frontend
cd frontend
npm install
npm run dev

Runs on http://localhost:5173
