"use client";

import { useEffect } from "react";  
import RecentlyViewed from "@/components/sections/RecentlyViewed";
import { useState, use }    from "react";
import { useRouter }        from "next/navigation";
import Link                  from "next/link";
import Navbar                from "@/components/layout/Navbar";
import Footer                from "@/components/layout/Footer";
import toast                 from "react-hot-toast";
import Recommendations from "@/components/sections/Recommendations";
import { FiArrowLeft, FiShoppingCart, FiHeart, FiStar, FiClock, FiShield } from "react-icons/fi";

const DEMO_PRODUCTS: Record<string, any> = {
  "1": {
    _id: "1", name: "Live Broiler Chicken", category: "live-broiler",
    description: "Fresh live broiler chicken raised on natural grain feed. Healthy, well-fed birds delivered live to your doorstep. No hormones, no antibiotics.",
    price: 180, unit: "kg", stock: 50, rating: 4.8, reviews: 124,
    badge: "Best Seller",
    weights: ["1 kg", "2 kg", "3 kg", "5 kg"],
    details: ["Naturally raised", "No hormones", "Daily vet checked", "Live delivery"],
  },
  "2": {
    _id: "2", name: "Country Chicken (Naatu Kodi)", category: "country-chicken",
    description: "Premium free-range country chicken. Rich in flavor and nutrition. Slow-grown for authentic taste. The real naatu kodi experience.",
    price: 420, unit: "kg", stock: 20, rating: 4.9, reviews: 89,
    badge: "Premium",
    weights: ["1 kg", "1.5 kg", "2 kg"],
    details: ["Free-range", "Slow-grown", "Rich flavor", "Premium quality"],
  },
  "3": {
    _id: "3", name: "Broiler Chicken Meat — 500g", category: "broiler-meat",
    description: "Hygienically cut and cleaned broiler meat. Ready to cook. Processed in certified facility with food-grade equipment.",
    price: 120, unit: "500g", stock: 100, rating: 4.7, reviews: 210,
    badge: "Fresh Cut",
    weights: ["250g", "500g", "750g", "1 kg"],
    details: ["Freshly cut", "Hygienically packed", "Ready to cook", "Same day processing"],
  },
  "6": {
    _id: "6", name: "KukrooKoo Secret Masala", category: "masala",
    description: "Our farm's signature spice blend for authentic chicken taste. Handcrafted with 15+ spices. The secret behind our chicken's irresistible flavor.",
    price: 199, unit: "500g", stock: 200, rating: 4.6, reviews: 345,
    badge: "Exclusive",
    weights: ["250g", "500g", "1 kg"],
    details: ["15+ spices", "No preservatives", "Handcrafted", "Authentic recipe"],
  },
};

const CATEGORY_EMOJI: Record<string, string> = {
  "live-broiler":    "🐔",
  "country-chicken": "🦚",
  "broiler-meat":    "🍗",
  "masala":          "🫙",
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }   = use(params);
  const router   = useRouter();
  const product  = DEMO_PRODUCTS[id];

  const [quantity,    setQuantity]    = useState(1);
  const [weight,      setWeight]      = useState(product?.weights?.[1] || "");
  const [wishlisted,  setWishlisted]  = useState(false);
  const [adding,      setAdding]      = useState(false);

  if (!product) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🔍</p>
        <h2 className="text-xl font-bold text-brand-dark mb-2">Product not found</h2>
        <Link href="/products" className="text-brand-red hover:underline">← Back to products</Link>
      </div>
    </div>
  );

  useEffect(() => {
  if (!product) return;
  const stored = localStorage.getItem("kukrookoo_recent");
  let recent = stored ? JSON.parse(stored) : [];
  recent = recent.filter((p: any) => p._id !== product._id);
  recent.unshift({
    _id: product._id, name: product.name,
    price: product.price, category: product.category,
  });
  localStorage.setItem("kukrookoo_recent", JSON.stringify(recent.slice(0, 10)));
}, [product]);

  const handleAddToCart = () => {
    setAdding(true);
    setTimeout(() => {
      toast.success(`${product.name} (${weight}) added to cart!`);
      setAdding(false);
    }, 600);
  };

  const handleBuyNow = () => {
    toast.success("Proceeding to checkout...");
    router.push("/cart");
  };

  const emoji = CATEGORY_EMOJI[product.category] || "🍗";
  const totalPrice = product.price * quantity;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-brand-dark/50 mb-6">
          <Link href="/" className="hover:text-brand-red">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-red">Products</Link>
          <span>/</span>
          <span className="text-brand-dark font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left — Image */}
          <div>
            <div className="bg-gradient-to-br from-brand-cream to-orange-100 rounded-3xl h-80 sm:h-96 flex items-center justify-center relative overflow-hidden shadow-card">
              <span className="text-[140px] select-none drop-shadow-xl">{emoji}</span>
              {product.badge && (
                <span className="absolute top-4 left-4 bg-brand-red text-white text-sm font-bold px-3 py-1 rounded-xl">
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-xl shadow-card flex items-center justify-center hover:scale-110 transition"
              >
                <FiHeart
                  size={18}
                  className={wishlisted ? "fill-brand-red text-brand-red" : "text-brand-dark/40"}
                />
              </button>
            </div>

            {/* Trust strips */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: <FiShield size={16} />, label: "Quality Assured" },
                { icon: <FiClock  size={16} />, label: "Same Day Fresh"  },
                { icon: "🌿",                   label: "No Chemicals"    },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-3 text-center shadow-card">
                  <div className="text-brand-red flex justify-center mb-1">{item.icon}</div>
                  <p className="text-[10px] font-medium text-brand-dark/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Details */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-brand-dark mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={14}
                    className={i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
              <span className="text-sm font-semibold text-brand-dark">{product.rating}</span>
              <span className="text-sm text-brand-dark/40">({product.reviews} reviews)</span>
            </div>

            <p className="text-brand-dark/60 leading-relaxed mb-6">{product.description}</p>

            {/* Price */}
            <div className="bg-brand-red/5 border border-brand-red/10 rounded-2xl p-4 mb-6">
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-brand-red">₹{totalPrice}</span>
                <span className="text-brand-dark/50 text-sm mb-1">
                  (₹{product.price} × {quantity} {product.unit})
                </span>
              </div>
            </div>

            {/* Weight selector */}
            {product.weights && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-brand-dark mb-2">Select Weight</p>
                <div className="flex flex-wrap gap-2">
                  {product.weights.map((w: string) => (
                    <button key={w}
                      onClick={() => setWeight(w)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${
                        weight === w
                          ? "bg-brand-red text-white border-brand-red"
                          : "bg-white text-brand-dark border-gray-200 hover:border-brand-red"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-dark mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-lg font-bold text-brand-dark hover:border-brand-red hover:text-brand-red transition"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-brand-dark text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-lg font-bold text-brand-dark hover:border-brand-red hover:text-brand-red transition"
                >
                  +
                </button>
                <span className="text-xs text-brand-dark/40">
                  {product.stock} available
                </span>
              </div>
            </div>

            {/* Product details */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.details?.map((d: string, i: number) => (
                <span key={i}
                  className="text-xs bg-farm-green/10 text-farm-green px-3 py-1.5 rounded-xl font-medium">
                  ✓ {d}
                </span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 border-2 border-brand-red text-brand-red font-semibold rounded-2xl hover:bg-brand-red hover:text-white transition disabled:opacity-60"
              >
                <FiShoppingCart size={18} />
                {adding ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 py-3.5 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition shadow-card"
              >
                Buy Now
              </button>
            </div>

            {/* Delivery note */}
            <p className="text-center text-xs text-brand-dark/40 mt-4">
              🚚 Same day delivery available · Order before 2 PM
            </p>
          </div>
        </div>
      </div>
      <Recommendations category={product.category} excludeId={id} />
      <RecentlyViewed currentId={id} />
      <Footer />
    </div>
  );
}