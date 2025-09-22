"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    async function fetchProducts() {
      if (!token) return;
      setLoading(true);
      try {
        const data = await apiRequest("/products", "GET", undefined, token);
        setProducts(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    try {
      await apiRequest(`/admin/products/${id}`, "DELETE", undefined, token || "");
      setProducts(products.filter((p) => p._id !== id));
    } catch (e) {
      alert('Failed to delete product')
    }
  };

  return (
    <div className="p-6">
      <div className="admin-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold">Manage Products</h1>
            <p className="text-slate-600 text-sm">Catalog listing</p>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">
            <div className="admin-spinner inline-block align-[-0.125em]"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 border border-slate-200 text-left">Name</th>
                  <th className="p-3 border border-slate-200 text-left">Price</th>
                  <th className="p-3 border border-slate-200 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border border-slate-200">
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">₹{p.price}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <a href={`/admin/products/${p._id}`} className="admin-link">Edit</a>
                        <button onClick={() => handleDelete(p._id)} className="text-red-600">Delete</button>
                      </div>
                    </td>
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
