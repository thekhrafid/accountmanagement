"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  transaction: any; // Using any for flexibility or you can use Transaction type
  onUpdated: (updated: any) => void;
};

export default function EditTransactionModal({
  open,
  onClose,
  transaction,
  onUpdated,
}: Props) {
  const [amount, setAmount] = useState(transaction?.amount || 0);
  const [type, setType] = useState(transaction?.type || "INCOME");
  const [category, setCategory] = useState(transaction?.category || "");
  const [loading, setLoading] = useState(false);

  if (!open || !transaction) return null;

  async function handleUpdate() {
    setLoading(true);

    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount), type, category }),
      });

      if (response.ok) {
        const updated = await response.json();
        onUpdated(updated);
        onClose();
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal box */}
      <div className="bg-white rounded-xl w-full max-w-md p-6 animate-scaleIn">
        <h2 className="text-lg font-semibold mb-4">Edit Transaction</h2>

        <div className="space-y-3">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="INCOME">Income</option>
            <option value="EXPENSE">Expense</option>
          </select>

          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded border">
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={handleUpdate}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
