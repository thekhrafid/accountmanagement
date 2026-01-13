"use client";

import { useEffect, useState } from "react";
import EditTransactionModal from "@/components/EditTransactionModal";

type Transaction = {
  id: string;
  amount: number;
  type: string;
  category: string;
  createdAt: string;
};

export default function TransactionList() {
  const [data, setData] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<Transaction | null>(null);

  useEffect(() => {
    loadData();
  }, [page, search]);

  async function loadData() {
    setLoading(true);
    const res = await fetch(
      `/api/transactions?page=${page}&limit=5&search=${search}`
    );
    const json = await res.json();
    setData(json.data);
    setTotalPages(json.totalPages);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    loadData();
  }

  function handleEdit(transaction: Transaction) {
    setSelected(transaction);
    setOpenEdit(true);
  }

  function handleUpdate() {
    loadData();
    setOpenEdit(false);
  }

  return (
    <div className="bg-white shadow rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Transactions</h2>

        <input
          placeholder="Search type or category..."
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="border px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <p className="text-center py-4">Loading...</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-center">
              <th className="py-3">Type</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((t) => (
              <tr
                key={t.id}
                className="border-b text-center hover:bg-gray-50 transition-colors"
              >
                <td
                  className={`py-4 font-medium ${
                    t.type === "INCOME" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {t.type}
                </td>
                <td className="font-semibold">${t.amount}</td>
                <td className="text-gray-600">{t.category}</td>
                <td className="text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString()}
                </td>
                <td className="space-x-3">
                  <button
                    onClick={() => handleEdit(t)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>

        <span className="text-sm font-medium text-gray-600">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>

      {openEdit && selected && (
        <EditTransactionModal
          open={openEdit}
          transaction={selected}
          onClose={() => setOpenEdit(false)}
          onUpdated={handleUpdate}
        />
      )}
    </div>
  );
}
