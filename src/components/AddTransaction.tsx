"use client";
import { useState } from "react";

export default function AddTransaction() {
  const [type, setType] = useState("INCOME");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ type, amount, category }),
    });

    if (res.ok) {
      setAmount("");
      setCategory("");
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-lg mb-6"
    >
      <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>

      <div className="flex gap-4 mb-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>

        <input
          type="number"
          value={amount}
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          required
          className="border p-2 rounded w-full"
        />
      </div>

      <input
        placeholder="Category (Salary , Food...)"
        value={category}
        required
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white p-2 rounded w-full"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}
