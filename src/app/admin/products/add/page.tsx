"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";
import { useForm }   from "react-hook-form";
import toast         from "react-hot-toast";
import Link          from "next/link";
import api           from "@/lib/axios";
import { FiArrowLeft } from "react-icons/fi";

interface ProductForm {
  name:        string;
  description: string;
  category:    string;
  price:       number;
  unit:        string;
  stock:       number;
  badge:       string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProductForm>({
    defaultValues: { category: "live-broiler", unit: "kg" },
  });

  const onSubmit = async (data: ProductForm) => {
    setLoading(true);
    try {
      await api.post("/products", data);
      toast.success("Product added successfully!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/products"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white shadow-card text-brand-dark/60 hover:text-brand-red transition">
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-brand-dark"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Add New Product
          </h1>
          <p className="text-brand-dark/50 text-sm">Add a product to your catalogue</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-card p-6 space-y-4">

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Product Name *</label>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="e.g. Live Broiler Chicken"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Description *</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={3}
            placeholder="Brief description of the product"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition resize-none"
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Category *</label>
            <select
              {...register("category", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
            >
              <option value="live-broiler">Live Broiler</option>
              <option value="country-chicken">Country Chicken</option>
              <option value="broiler-meat">Broiler Meat</option>
              <option value="masala">Masala</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Unit *</label>
            <select
              {...register("unit", { required: true })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
            >
              <option value="kg">kg</option>
              <option value="250g">250g</option>
              <option value="500g">500g</option>
              <option value="750g">750g</option>
              <option value="1kg">1kg</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Price (₹) *</label>
            <input
              type="number"
              {...register("price", { required: "Price is required", min: 0 })}
              placeholder="180"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">Stock Quantity *</label>
            <input
              type="number"
              {...register("stock", { required: "Stock is required", min: 0 })}
              placeholder="50"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-dark mb-1">Badge (optional)</label>
          <input
            {...register("badge")}
            placeholder="e.g. Best Seller, Premium, Exclusive"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}