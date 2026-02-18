import { useEffect, useState } from "react";
import { createExpense, fetchExpenses } from "./api";
import "./index.css";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: ""
  });

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await fetchExpenses({
        category: categoryFilter || undefined,
        sort: "date_desc"
      });
      setExpenses(data);
      setError(null);
    } catch {
      setError("Failed to load expenses");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadExpenses();
  }, [categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createExpense({
        ...form,
        amount: Math.round(Number(form.amount) * 100) // ✅ convert to paise
      });

      setForm({ amount: "", category: "", description: "", date: "" });
      loadExpenses();
    } catch {
      setError("Failed to create expense");
    }
  };

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container">
      <h2>Expense Tracker</h2>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Amount (₹)"
          type="number"
          step="0.01"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          required
        />
        <input
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>

      <hr />

      <input
        placeholder="Filter by category"
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            ₹{(e.amount / 100).toFixed(2)} | {e.category} | {e.date}
          </li>
        ))}
      </ul>

      <h3>Total: ₹{(total / 100).toFixed(2)}</h3>
    </div>
  );
}
