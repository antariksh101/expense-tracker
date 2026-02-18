import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000"
});

export const createExpense = async (expense) => {
  const idempotencyKey = crypto.randomUUID();

  const res = await api.post("/expenses", expense, {
    headers: { "Idempotency-Key": idempotencyKey }
  });

  return res.data;
};

export const fetchExpenses = async (params) => {
  const res = await api.get("/expenses", { params });
  return res.data;
};
