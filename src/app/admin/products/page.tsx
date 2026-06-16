"use client";

import { useState, useEffect } from "react";
import Link  from "next/link";
import toast from "react-hot-toast";
import api   from "@/lib/axios";
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";

const CATEGORY_LABELS: Record<string, string> = {
  "live-broiler":    "Live Broiler",
  "country-chicken": "Country Chicken",
  "broiler-meat":    "Broiler Meat",
  "masala":          "Masala",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products/admin/all");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleStockUpdate = async (id: string, stock: number) => {
    try {
      await api.put(`/products/${id}`, { stock });
      setProducts((prev) => prev.map((p) => p._id === id ? { ...p, stock } : p));
      toast.success("Stock updated");
    } catch {
      toast.error("Failed to update stock");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-brand-dark"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Products
          </h1>
          <p className="text-brand-dark/50 text-sm">Manage your product catalogue</p>
        </div>
        <Link href="/admin/products/add"
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-xl hover:bg-brand-red/90 transition">
          <FiPlus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-brand-dark/40">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <FiPackage size={48} className="text-brand-dark/20 mx-auto mb-3" />
            <p className="font-semibold text-brand-dark mb-1">No products yet</p>
            <p className="text-sm text-brand-dark/50 mb-4">Add your first product to get started</p>
            <Link href="/admin/products/add"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-xl hover:bg-brand-red/90 transition">
              <FiPlus size={16} /> Add Product
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-brand-dark/50">
                <th className="px-6 py-4 font-medium">Product</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Stock</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b border-gray-50 hover:bg-brand-cream/30 transition">
                  <td className="px-6 py-4 font-medium text-brand-dark">{product.name}</td>
                  <td className="px-6 py-4 text-brand-dark/60">
                    {CATEGORY_LABELS[product.category] || product.category}
                  </td>
                  <td className="px-6 py-4 font-semibold text-brand-red">
                    ₹{product.price} / {product.unit}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      defaultValue={product.stock}
                      onBlur={(e) => handleStockUpdate(product._id, Number(e.target.value))}
                      className="w-20 px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-red text-sm"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      product.stock > 0
                        ? "bg-farm-green/10 text-farm-green"
                        : "bg-red-50 text-brand-red"
                    }`}>
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-brand-dark/40 hover:text-brand-red hover:bg-red-50 transition">
                      <FiTrash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}