import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import db from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Helper: validate expense input
 */
function validateExpense(body) {
  const { amount, category, description, date } = body;

  if (amount === undefined || typeof amount !== "number" || amount <= 0)
    return "Amount must be a positive number";

  if (!category || typeof category !== "string")
    return "Category is required";

  if (!date || isNaN(Date.parse(date)))
    return "Valid date is required";

  return null;
}

/**
 * POST /expenses
 * Idempotent via Idempotency-Key header
 */
app.post("/expenses", (req, res) => {
  const error = validateExpense(req.body);
  if (error) return res.status(400).json({ error });

  const { amount, category, description, date } = req.body;
  const idempotencyKey = req.headers["idempotency-key"];

  if (idempotencyKey) {
    const existing = db
      .prepare("SELECT * FROM expenses WHERE idempotency_key = ?")
      .get(idempotencyKey);

    if (existing) return res.json(existing);
  }

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO expenses 
    (id, amount, category, description, date, created_at, idempotency_key)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `
  ).run(
    id,
    amount,
    category,
    description || "",
    date,
    createdAt,
    idempotencyKey || null
  );

  const expense = db.prepare("SELECT * FROM expenses WHERE id = ?").get(id);
  res.status(201).json(expense);
});

/**
 * GET /expenses
 * Supports:
 *   ?category=
 *   ?sort=date_desc
 */
app.get("/expenses", (req, res) => {
  const { category, sort } = req.query;

  let query = "SELECT * FROM expenses";
  const params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (sort === "date_desc") {
    query += " ORDER BY date DESC";
  }

  const expenses = db.prepare(query).all(...params);
  res.json(expenses);
});

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
