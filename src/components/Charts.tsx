"use client";
import { useEffect, useState } from "react";
import MonthlyBarChart from "./MonthlyBarChart";
import CategoryPieChart from "./CategoryPieChart";

type ChartData = {
  monthly: { name: string; amount: number }[];
  categories: { name: string; value: number }[];
};

export default function Charts() {
  const [data, setData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/charts")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chart data:", err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center bg-white rounded-xl shadow mt-6">
        Loading charts...
      </div>
    );
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 mb-6">
      <MonthlyBarChart data={data.monthly} />
      <CategoryPieChart data={data.categories} />
    </div>
  );
}
