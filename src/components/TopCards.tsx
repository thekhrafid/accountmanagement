"use client";
import { useEffect, useState } from "react";

type Summary = {
  income: number;
  expense: number;
  balance: number;
};
export default function TopCards() {
  const [data, setData] = useState<Summary | null>({income:0, expense:0, balance: 0});

  useEffect(() => {
    fetch("/api/dashboard",{credentials:"include"})
    .then((res)=>res.json())
    .then(setData)
      
  }, []);

  if (!data) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <Card title="Income" value={data.income} color="text-green-600" />
      <Card title="Expense" value={data.expense} color="text-red-600" />
      <Card title="Balance" value={data.balance} color="text-blue-600" />
    </div>
  );
}
function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <h2 className={`text-3xl font-bold ${color}`}>
        ৳ {value.toFixed(2)}
      </h2>
    </div>
  );
}
