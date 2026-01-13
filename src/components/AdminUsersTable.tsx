"use client";
import { useEffect, useState, useMemo } from "react";
import {
  HiOutlineTrash,
  HiOutlineUserPlus,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowPath,
  HiOutlineUserCircle,
  HiOutlineClock,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from "react-icons/hi2";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  income: number;
  expense: number;
  balance: number;
  createdAt: string;
};

export default function AdminUsersTable() {
  const [data, setData] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/admin/users");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    return data.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  async function makeAdmin(id: string) {
    if (!confirm("Confirm elevating user to Administrator status?")) return;
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "ADMIN" }),
    });
    if (res.ok) fetchData();
  }

  async function deleteUser(id: string) {
    if (!confirm("Permanently delete this user and all associated data?"))
      return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) setData((p) => p.filter((u) => u.id !== id));
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4 animate-pulse">
        <div className="h-12 w-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs tracking-[0.2em] uppercase">
          Loading Records...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-lg group">
            <HiOutlineMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
            <input
              type="text"
              placeholder="Search directory by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={fetchData}
            className={`p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm ${
              refreshing ? "animate-spin" : ""
            }`}
          >
            <HiOutlineArrowPath className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-100">
            {filteredData.length} Records
          </div>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-blue-600 hover:underline text-xs font-bold"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-4xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  User Details
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                  Financials
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">
                  Joined
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-center">
                  Role Status
                </th>
                <th className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-40 text-center">
                    <div className="flex flex-col items-center gap-4 text-slate-300">
                      <HiOutlineUserCircle className="w-20 h-20 opacity-20" />
                      <p className="text-sm font-bold uppercase tracking-widest">
                        No matching datasets
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((u) => (
                  <tr
                    key={u.id}
                    className="group hover:bg-slate-50/50 transition-all duration-300"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100 shadow-sm transition-all group-hover:scale-110">
                          <span className="text-blue-600 font-black text-xl tracking-tighter">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-base leading-tight mb-1">
                            {u.name}
                          </p>
                          <p className="text-xs text-slate-400 font-bold tracking-tight">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-lg font-black tracking-tighter ${
                              u.balance >= 0 ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            {formatCurrency(u.balance)}
                          </span>
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-1.5 py-0.5 rounded">
                            Net Assets
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-[11px] font-black text-green-500/80">
                            <HiOutlineArrowTrendingUp className="w-3.5 h-3.5" />
                            {formatCurrency(u.income)}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-black text-red-400/80">
                            <HiOutlineArrowTrendingDown className="w-3.5 h-3.5" />
                            {formatCurrency(u.expense)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="inline-flex flex-col items-center gap-1 text-slate-400">
                        <HiOutlineClock className="w-4 h-4 opacity-40 mb-1" />
                        <span className="text-[11px] font-black uppercase tracking-tighter whitespace-nowrap">
                          {formatDate(u.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border transition-all ${
                            u.role === "ADMIN"
                              ? "bg-blue-600 text-white border-transparent"
                              : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              u.role === "ADMIN"
                                ? "bg-white animate-pulse"
                                : "bg-slate-300"
                            }`}
                          ></div>
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {u.role !== "ADMIN" && (
                          <button
                            onClick={() => makeAdmin(u.id)}
                            className="w-32 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm"
                          >
                            <HiOutlineUserPlus className="w-4 h-4" />
                            <span>Elevate</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="w-32 flex items-center justify-center gap-2 px-3 py-2 bg-white hover:bg-red-600 text-red-600 hover:text-white rounded-xl transition-all text-[10px] font-black uppercase tracking-widest border border-red-100 shadow-sm"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                          <span>Terminate</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
