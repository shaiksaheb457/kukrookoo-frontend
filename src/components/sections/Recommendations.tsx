"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ui/ProductCard";
import api from "@/lib/axios";

const DEMO_RECS = [
  { _id: "2", name: "Country Chicken (Naatu Kodi)", category: "country-chicken", description: "Premium free-range country chicken.", price: 420, unit: "kg", stock: 20, rating: 4.9, reviews: 89, images: [], badge: "Premium" },
  { _id: "6", name: "KukrooKoo Secret Masala — 500g", category: "masala", description: "Our farm's signature spice blend.", price: 199, unit: "500g", stock: 200, rating: 4.6, reviews: 345, images: [], badge: "Exclusive" },
  { _id: "3", name: "Broiler Chicken Meat — 500g", category: "broiler-meat", description: "Hygienically cut and cleaned broiler meat.", price: 120, unit: "500g", stock: 100, rating: 4.7, reviews: 210, images: [], badge: "Fresh Cut" },
  { _id: "8", name: "Live Country Chicken", category: "country-chicken", description: "Premium live country chicken.", price: 380, unit: "kg", stock: 15, rating: 4.9, reviews: 55, images: [], badge: "Premium" },
];

export default function Recommendations({ category, excludeId }: { category?: string; excludeId?: string }) {
  const [products, setProducts] = useState<any[]>(DEMO_RECS);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const params: any = {};
        if (category)  params.category = category;
        if (excludeId) params.exclude  = excludeId;
        const res = await api.get("/recommendations", { params });
        if (res.data.length > 0) setProducts(res.data);
      } catch {
        // fallback to demo
      }
    };
    fetchRecs();
  }, [category, excludeId]);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-brand-red text-sm font-semibold uppercase tracking-widest">
            ✨ AI Picks For You
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mt-2"
            style={{ fontFamily: "var(--font-playfair)" }}>
            You May Also Like
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}