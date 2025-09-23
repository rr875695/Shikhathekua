"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingStatus, setPendingStatus] = useState<Record<string, string>>({});
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    async function fetchOrders() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiRequest("/admin/orders", "GET", undefined, token);
        setOrders(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    await apiRequest(`/admin/orders/${id}`, "PUT", { status }, token || "");
    setOrders(orders.map((o) => (o._id === id ? { ...o, status } : o)));
    setPendingStatus((prev) => ({ ...prev, [id]: status }));
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Manage Orders</h1>
      {loading ? (
        <div className="py-10 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-gray-600">Loading orders...</p>
        </div>
      ) : (
      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Order ID</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Total</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border">
              <td className="p-2">{o.orderId}</td>
              <td className="p-2">{o.user?.name || o.customerDetails?.name}</td>
              <td className="p-2">₹{o.totalAmount}</td>
              <td className="p-2 space-x-2">
                <select
                  value={pendingStatus[o._id] ?? o.status}
                  onChange={(e) => setPendingStatus((prev) => ({ ...prev, [o._id]: e.target.value }))}
                  className="border p-1"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <button
                  onClick={() => updateStatus(o._id, pendingStatus[o._id] ?? o.status)}
                  className="admin-btn px-3 py-1"
                >
                  Submit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}
