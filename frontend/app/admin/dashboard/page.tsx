"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({ orders: 0, products: 0 });
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !token) {
      window.location.href = '/admin/login';
    }
    try {
      if (token) {
        setAdminName('Admin');
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      const orders = await apiRequest("/admin/orders", "GET", undefined, token);
      const products = await apiRequest("/products", "GET", undefined, token);
      setStats({ orders: orders.length, products: products.length });
    }
    fetchStats();
  }, [token]);

  return (
    <div className="admin-bg p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{`Welcome, ${adminName || 'Admin'}`} 👋</h1>
            <p className="text-slate-600 mt-1">Here is what's happening with your store today.</p>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('adminToken');
                document.cookie = 'adminToken=; Max-Age=0; path=/;';
                window.location.href = '/admin/login';
              }
            }}
            className="admin-btn warning"
          >
            Logout
          </button>
        </div>

        <div className="dashboard-grid mt-6">
          <div className="admin-card p-6 dashboard-stat">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title">Total Orders</div>
                <div className="stat-value">{stats.orders}</div>
                <div className="stat-trend">▲ 4.1% vs last week</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 text-xl">📦</div>
            </div>
          </div>

          <div className="admin-card p-6 dashboard-stat">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title">Total Products</div>
                <div className="stat-value">{stats.products}</div>
                <div className="stat-trend">▲ 1.8% vs last week</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-violet-50 flex items-center justify-center text-violet-600 text-xl">🧺</div>
            </div>
          </div>

          <div className="admin-card p-6 dashboard-stat">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title">Conversion Rate</div>
                <div className="stat-value">3.2%</div>
                <div className="stat-trend">▲ 0.6% vs last week</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl">📈</div>
            </div>
          </div>

          <div className="admin-card p-6 dashboard-stat">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title">Avg. Order Value</div>
                <div className="stat-value">₹{Math.round((stats.orders ? 799 : 0))}</div>
                <div className="stat-trend">—</div>
              </div>
              <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 text-xl">💳</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
