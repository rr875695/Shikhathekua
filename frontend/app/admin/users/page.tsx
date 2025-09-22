"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    async function fetchUsers() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiRequest("/admin/users", "GET", undefined, token);
        setUsers(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [token]);

  return (
    <div className="p-6">
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">All Users</h1>
            <p className="text-slate-600 text-sm">Registered customers with basic details</p>
          </div>
        </div>
        {loading ? (
          <div className="py-10 text-center">
            <div className="admin-spinner inline-block align-[-0.125em]"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200 mt-2">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border border-slate-200 text-left">Name</th>
                  <th className="p-3 border border-slate-200 text-left">Email</th>
                  <th className="p-3 border border-slate-200 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border border-slate-200">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}



