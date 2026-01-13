"use client";

import { useEffect, useState } from "react";

type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
};

export default function AdminUserPage() {
  const [users, setusers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setusers(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function changeRole(id: string, role: "USER" | "ADMIN") {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ role }),
    });

    setusers((u) =>
      u.map((user) => (user.id === id ? { ...user, role } : user))
    );
  }

  async function deleteUser(id: string) {
    if (!confirm("Delete user?")) return;

    await fetch(`/api/admin/users/${id}`, {
      method: "DELETE",
    });
    setusers((u) => u.filter((x) => x.id !== id));
  }

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase">
          {users.length} Users Found
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-center">
                Role
              </th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                  {u.email}
                </td>
                <td className="px-6 py-4 text-center">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole(u.id, e.target.value as any)}
                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 mx-auto"
                  >
                    <option value={"USER"}>User</option>
                    <option value={"ADMIN"}>Admin</option>
                  </select>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                  >
                    Delete User
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
