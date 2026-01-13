"use client";

import { useEffect, useState } from "react";
import CreateTransaction from "./create";
import { useSession } from "next-auth/react";

type Transaction = {
  id: string;
  type: string;
  amount: number;
  category: string;
  createdAt: string;
};

const deleteTransaction = async (id: string) => {
  if (!confirm("Are you sure?")) return;

  const res = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to delete transaction");
  }

  alert(data.message);
};
export default function TransactionsPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/transactions", { credentials: "include" });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");
      setData(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>
      <CreateTransaction /> {/*Form included */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {loading && <p>Loading transactions...</p>}
      {!loading && data.length === 0 && !error && <p>No transactions found</p>}
      {data.length > 0 && (
        <table className="w-full border mt-4 text-center">
          <thead>
            <tr>
              <th>Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.type}</td>
                <td>{tx.amount}</td>
                <td>{tx.category}</td>
                <td>{new Date(tx.createdAt).toLocaleDateString()}</td>

                {session && session.user.role === "ADMIN" && (
                  <td>
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
