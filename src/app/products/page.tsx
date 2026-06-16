"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams }               from "next/navigation";
import Navbar                            from "@/components/layout/Navbar";
import Footer                            from "@/components/layout/Footer";
import ProductCard                       from "@/components/ui/ProductCard";
import { FiFilter, FiSearch, FiX }      from "react-icons/fi";
import api                               from "@/lib/axios";

const CATEGORIES = [
  { label: "All",             value: ""                },
  { label: "Live Broiler",    value: "live-broiler"    },
  { label: "Country Chicken", value: "country-chicken" },
  { label: "Broiler Meat",    value: "broiler-meat"    },
  { label: "Masala",          value: "masala"          },
];

// Demo products for when backend has no products yet
const DEMO_PRODUCTS = [
  {
    _id: "1", name: "Live Broiler Chicken", category: "live-broiler",
    description: "Fresh live broiler chicken. Healthy and well-fed birds.",
    price: 180, unit: "kg", stock: 50, rating: 4.8, reviews: 124,
    images: [], badge: "Best Seller",
  },
  {
    _id: "2", name: "Country Chicken (Naatu Kodi)", category: "country-chicken",
    description: "Premium free-range country chicken. Rich flavor and nutrition.",
    price: 420, unit: "kg", stock: 20, rating: 4.9, reviews: 89,
    images: [], badge: "Premium",
  },
  {
    _id: "3", name: "Broiler Chicken Meat — 500g", category: "broiler-meat",
    description: "Hygienically cut and cleaned broiler meat. Ready to cook.",
    price: 120, unit: "500g", stock: 100, rating: 4.7, reviews: 210,
    images: [], badge: "Fresh Cut",
  },
  {
    _id: "4", name: "Broiler Chicken Meat — 1kg", category: "broiler-meat",
    description: "Full 1kg pack of fresh broiler meat. Best value.",
    price: 220, unit: "kg", stock: 80, rating: 4.7, reviews: 180,
    images: [],
  },
  {
    _id: "5", name: "Country Chicken Meat — 500g", category: "country-chicken",
    description: "Premium country chicken meat. Perfect for curries.",
    price: 210, unit: "500g", stock: 30, rating: 4.9, reviews: 67,
    images: [], badge: "Premium",
  },
  {
    _id: "6", name: "KukrooKoo Secret Masala — 500g", category: "masala",
    description: "Our farm's signature spice blend for authentic chicken taste.",
    price: 199, unit: "500g", stock: 200, rating: 4.6, reviews: 345,
    images: [], badge: "Exclusive",
  },
  {
    _id: "7", name: "KukrooKoo Secret Masala — 1kg", category: "masala",
    description: "Economy pack of our signature masala blend.",
    price: 349, unit: "kg", stock: 150, rating: 4.6, reviews: 210,
    images: [],
  },
  {
    _id: "8", name: "Live Country Chicken", category: "country-chicken",
    description: "Premium live country chicken. Healthy and naturally raised.",
    price: 380, unit: "kg", stock: 15, rating: 4.9, reviews: 55,
    images: [], badge: "Premium",
  },
];

function ProductsContent() {
  const searchParams  = useSearchParams();
  const [products,    setProducts]    = useState<any[]>(DEMO_PRODUCTS);
  const [filtered,    setFiltered]    = useState<any[]>(DEMO_PRODUCTS);
  const [category,    setCategory]    = useState(searchParams.get("category") || "");
  const [search,      setSearch]      = useState(searchParams.get("search")   || "");
  const [loading,     setLoading]     = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Try fetching from backend, fallback to demo
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/products");
        if (res.data.length > 0) setProducts(res.data);
      } catch {
        // use demo products
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter
  useEffect(() => {
    let result = [...products];
    if (category) result = result.filter((p) => p.category === category);
    if (search)   result = result.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [category, search, products]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      {/* Page header */}
      <div className="bg-gradient-to-br from-brand-red to-brand-orange text-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Our Products
          </h1>
          <p className="text-white/80 max-w-md mx-auto">
            Farm fresh chicken and masala — delivered to your door.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:border-brand-red text-sm shadow-card"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-dark/40 hover:text-brand-red">
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-2 px-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-card text-sm font-medium"
          >
            <FiFilter size={16} /> Filters
          </button>
        </div>

        {/* Category filters */}
        <div className={`flex flex-wrap gap-2 mb-8 ${showFilters ? "flex" : "hidden sm:flex"}`}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                category === cat.value
                  ? "bg-brand-red text-white shadow-card"
                  : "bg-white text-brand-dark/60 hover:text-brand-red border border-gray-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-brand-dark/50">
            Showing <span className="font-semibold text-brand-dark">{filtered.length}</span> products
            {category && <> in <span className="font-semibold text-brand-red capitalize">{category.replace("-", " ")}</span></>}
          </p>
          {(search || category) && (
            <button
              onClick={() => { setSearch(""); setCategory(""); }}
              className="text-sm text-brand-red hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-72 animate-pulse shadow-card" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-brand-dark mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}>
              No products found
            </h3>
            <p className="text-brand-dark/50 text-sm">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}