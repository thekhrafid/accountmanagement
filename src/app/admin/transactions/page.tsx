"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category: string;
  user: { email: string };
};

export default function AdminTransactionsPage() {
  const [data, setData] = useState<Transaction[]>([]);

  useEffect(() => {
    fetch("/api/admin/transactions")
      .then((res) => res.json())
      .then(setData);
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete transaction?")) return;

    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    setData((d) => d.filter((t) => t.id !== id));
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>

      <table className="w-full text-sm">
        <thead>
          <tr>
            <th>User</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t) => (
            <tr key={t.id} className="text-center border-b">
              <td>{t.user.email}</td>
              <td>{t.type}</td>
              <td>{t.amount}</td>
              <td>
                <button
                  onClick={() => remove(t.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
