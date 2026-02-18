# Expense Tracker

A minimal full-stack **Expense Tracker** application built with:

- **Backend:** Node.js + Express + SQLite  
- **Frontend:** React (Vite)

The application allows users to:

- Add expenses
- Filter expenses by category
- Sort expenses by date (newest first)
- View total expense amount
- Safely retry expense creation using idempotency keys

---

# 🏗 Architecture

```
Frontend (React - Vite)
        ↓
REST API (Express)
        ↓
SQLite Database
```

- The **frontend** communicates with the backend using REST APIs.
- The **backend** handles validation, business logic, filtering, sorting, and persistence.
- **SQLite** stores data in a local file for simplicity and portability.

---

# 📦 Tech Stack

## Backend
- Node.js
- Express
- SQLite (better-sqlite3)
- UUID
- CORS
- Nodemon (dev)

## Frontend
- React
- Vite
- Fetch API

---

# ⚙️ Key Design Decisions

## 1️⃣ SQLite for Storage
- Lightweight and zero-configuration.
- Ideal for small-to-medium datasets.
- Persistent file-based storage.
- Easy local development setup.

---

## 2️⃣ Money Stored as Integer (Paise)

Amounts are stored as **integers in paise**, not floating-point numbers.

Example:

User enters: 100.50  
Stored as: 10050  

Why?

- Prevents floating-point precision errors
- Ensures financial correctness
- Industry best practice for monetary values

Conversion:
- Frontend converts rupees → paise before sending
- UI divides by 100 for display

---

## 3️⃣ Idempotency Support

`POST /expenses` supports an optional `Idempotency-Key` header.

This prevents duplicate expense creation if:
- Network retry occurs
- Client resends the same request

This mimics real-world production-safe API design.

---

## 4️⃣ Database-Level Filtering & Sorting

- Category filtering handled in SQL
- Sorting handled in SQL (`ORDER BY date DESC`)

This:
- Reduces unnecessary processing
- Keeps logic close to the data layer

---

## 5️⃣ Clean Separation of Concerns

- Frontend handles UI only
- Backend handles validation & persistence
- No direct database logic inside frontend

---

# 🔌 API Endpoints

## ➜ Create Expense

**POST /expenses**

### Headers (optional)

Idempotency-Key: <unique-value>

### Body

```json
{
  "amount": 10050,
  "category": "Food",
  "description": "Lunch",
  "date": "2026-02-18"
}
```

- `amount` must be in paise
- `date` format: YYYY-MM-DD

---

## ➜ Get Expenses

**GET /expenses**

### Query Parameters

| Parameter | Description |
|-----------|------------|
| category  | Filter by category |
| sort      | date_desc (default) |

Example:

GET /expenses?category=Food&sort=date_desc

---

# 🚀 How to Run

## 1️⃣ Clone Repository

```bash
git clone <your-repo-url>
cd expense-tracker
```

## 2️⃣ Run Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

http://localhost:4000

## 3️⃣ Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

http://localhost:5173

---

# 📁 Project Structure

```
expense-tracker/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# ⚖️ Trade-offs & Limitations

- No authentication (out of scope)
- No pagination (dataset assumed small)
- No edit/delete endpoints
- No production deployment setup
- Basic UI styling only

---

# 🔮 Possible Improvements

- Add authentication (JWT)
- Add pagination
- Add edit/delete functionality
- Add category-wise summaries
- Add monthly reports
- Add Docker setup
- Deploy to cloud

---

# 📌 Summary

This project demonstrates:

- REST API design
- Idempotent request handling
- Proper monetary data handling
- Separation of concerns
- Clean full-stack integration
