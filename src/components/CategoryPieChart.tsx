"use client";

import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Props = {
  data: { name: string; value: number }[];
};

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function CategoryPieChart({ data }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold mb-4">Expense by Category</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={60}
            paddingAngle={5}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
