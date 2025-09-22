"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

export default function ProductFormPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState({ name: "", price: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  useEffect(() => {
    if (id !== "new" && token) {
      apiRequest(`/products/${id}`, "GET", undefined, token).then((data) => setProduct({ name: data.name || '', price: String(data.price ?? ''), description: data.description || '', image: data.image || '' }));
    }
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = { ...product, price: Number(product.price) } as any;
    setSaving(true);
    try {
      if (id === "new") {
        await apiRequest("/admin/products", "POST", body, token || "");
      } else {
        await apiRequest(`/admin/products/${id}`, "PUT", body, token || "");
      }
    } finally {
      setSaving(false);
    }
    router.push("/admin/products");
  };

  const handleImageUpload = async (file: File) => {
    if (!file || !token) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      const res = await fetch('http://127.0.0.1:5000/api/admin/upload-image', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      // Store site-relative URL
      setProduct((prev) => ({ ...prev, image: data.url }));
    } catch (e: any) {
      alert(e.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6">
      <div className="admin-card max-w-2xl">
        <h1 className="text-xl font-semibold mb-4">{id === "new" ? "Add Product" : "Edit Product"}</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="border p-2 w-full rounded"
              placeholder="Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Price</label>
            <input
              className="border p-2 w-full rounded"
              placeholder="Price"
              type="number"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Image</label>
            {product.image && (
              <div className="mb-2">
                <img src={product.image} alt="Preview" className="max-h-40 rounded" />
              </div>
            )}
            <input
              className="border p-2 w-full rounded"
              placeholder="/sugar.jpeg or /uploads/filename.jpg"
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
            />
            <div className="mt-2 flex items-center gap-3">
              <input type="file" accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
              {uploading && <span className="text-sm text-slate-600">Uploading...</span>}
              {product.image && <span className="text-sm text-emerald-600">Uploaded</span>}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              className="border p-2 w-full rounded"
              placeholder="Description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <button disabled={saving} className="admin-btn disabled:opacity-60">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={() => router.push('/admin/products')} className="admin-btn secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
