import AdminUsersTable from "@/components/AdminUsersTable";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  HiOutlineUserGroup,
  HiOutlineCurrencyDollar,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowsRightLeft,
} from "react-icons/hi2";

async function getStats() {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/stats`, {
    cache: "no-store",
  });
  if (!res.ok) return { users: 0, transactions: 0, income: 0, expense: 0 };
  return res.json();
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return redirect("/dashboard");
  }

  const stats = await getStats();

  const cards = [
    {
      label: "Total Users",
      value: stats?.users ?? 0,
      icon: HiOutlineUserGroup,
      color: "text-blue-600",
      border: "border-blue-100",
      bg: "bg-blue-50/50",
    },
    {
      label: "Net Revenue",
      value: `$${stats?.income?.toLocaleString() ?? 0}`,
      icon: HiOutlineCurrencyDollar,
      color: "text-green-600",
      border: "border-green-100",
      bg: "bg-green-50/50",
    },
    {
      label: "Total Expenses",
      value: `$${stats?.expense?.toLocaleString() ?? 0}`,
      icon: HiOutlineArrowTrendingUp,
      color: "text-red-500",
      border: "border-red-100",
      bg: "bg-red-50/50",
    },
    {
      label: "Transactions",
      value: stats?.transactions ?? 0,
      icon: HiOutlineArrowsRightLeft,
      color: "text-slate-600",
      border: "border-slate-100",
      bg: "bg-slate-50/50",
    },
  ];

  return (
    <div className="space-y-12 py-6 bg-white">
      <div className="space-y-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
          Admin Control Center
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Manage accounts, monitor transactions, and oversee system authority.
        </p>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white p-8 rounded-4xl border ${card.border} shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col gap-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300`}
          >
            <div
              className={`h-16 w-16 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}
            >
              <card.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                {card.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {card.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Account Directory
            </h2>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Live Feed
            </span>
          </div>
        </div>
        <AdminUsersTable />
      </section>
    </div>
  );
}
