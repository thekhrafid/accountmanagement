import { useState } from "react";

export default function CreateTransaction() {
  const [type, setType] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("api/transactions", {
        method: "POST",
        credentials: "include", //send cookies
        headers: { "Contetnt-Type": "application/json" },
        body: JSON.stringify({ type, amount, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to create transaction");
      }
      setSuccess("Transaction created successfully");
      setType("");
      setAmount("");
      setCategory("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create transaction"
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto p-4 border rounded">
      <h2 className="font-bold text-lg mb-4">Create Transactions</h2>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block">Type</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            placeholder="text"
            required
          />
        </div>
        <div>
          <label className="block">Amount</label>
          <input
            type="number"
            value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border p-2 rounded mt-2"
            required
          />
        </div>
        <div>
          <label className="block">Category</label>
          <input
            type="text"
            value={category}
            placeholder="Category"
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            required
          />
        </div>
         <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
