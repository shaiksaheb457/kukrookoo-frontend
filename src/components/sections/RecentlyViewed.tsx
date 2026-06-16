"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CATEGORY_EMOJI: Record<string, string> = {
  "live-broiler":    "🐔",
  "country-chicken": "🦚",
  "broiler-meat":    "🍗",
  "masala":          "🫙",
};

export default function RecentlyViewed({ currentId }: { currentId?: string }) {
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("kukrookoo_recent");
    const recentItems = stored ? JSON.parse(stored) : [];
    setRecent(recentItems.filter((item: any) => item._id !== currentId));
  }, [currentId]);

  if (recent.length === 0) return null;

  return (
    <section className="py-12 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-xl font-bold text-brand-dark mb-5"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Recently Viewed
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
          {recent.slice(0, 6).map((item: any) => (
            <Link key={item._id} href={`/products/${item._id}`}
              className="flex-shrink-0 w-40 bg-white rounded-2xl shadow-card p-4 hover:shadow-cardHov transition">
              <div className="text-4xl mb-2 text-center">
                {CATEGORY_EMOJI[item.category] || "🍗"}
              </div>
              <p className="text-xs font-semibold text-brand-dark line-clamp-2 mb-1">
                {item.name}
              </p>
              <p className="text-sm font-bold text-brand-red">₹{item.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}