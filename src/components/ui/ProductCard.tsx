"use client";

import { useState }   from "react";
import Link           from "next/link";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { motion }     from "framer-motion";
import { useCart }    from "@/context/CartContext";
import toast          from "react-hot-toast";

interface Product {
  _id:         string;
  name:        string;
  description: string;
  category:    string;
  price:       number;
  unit:        string;
  images:      string[];
  stock:       number;
  rating?:     number;
  reviews?:    number;
  badge?:      string;
}

const CATEGORY_EMOJI: Record<string, string> = {
  "live-broiler":    "🐔",
  "country-chicken": "🦚",
  "broiler-meat":    "🍗",
  "masala":          "🫙",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem }  = useCart();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding,     setAdding]     = useState(false);

  const emoji        = CATEGORY_EMOJI[product.category] || "🍗";
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    setAdding(true);
    addItem({
      id:       product._id,
      name:     product.name,
      price:    product.price,
      unit:     product.unit,
      quantity: 1,
      weight:   product.unit,
      emoji,
    });
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = () => {
    setWishlisted(!wishlisted);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl shadow-card hover:shadow-cardHov hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative bg-gradient-to-br from-brand-cream to-orange-50 h-48 flex items-center justify-center overflow-hidden">
        <span className="text-7xl group-hover:scale-110 transition-transform duration-300 select-none">
          {emoji}
        </span>
        <button onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-xl shadow-card flex items-center justify-center hover:scale-110 transition">
          <FiHeart size={15}
            className={wishlisted ? "fill-brand-red text-brand-red" : "text-brand-dark/40"} />
        </button>
        {product.badge && (
          <span className="absolute top-3 left-3 text-xs font-semibold bg-brand-red text-white px-2.5 py-1 rounded-xl">
            {product.badge}
          </span>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-brand-dark/50 bg-white px-3 py-1 rounded-xl shadow-card">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-bold text-brand-dark text-sm sm:text-base leading-tight mb-1 hover:text-brand-red transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-brand-dark/50 mb-3 line-clamp-2">
          {product.description}
        </p>
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <FiStar size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-brand-dark">{product.rating}</span>
            <span className="text-xs text-brand-dark/40">({product.reviews || 0})</span>
          </div>
        )}
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-brand-red">₹{product.price}</span>
            <span className="text-xs text-brand-dark/50 ml-1">/ {product.unit}</span>
          </div>
          <span className="text-xs text-farm-green font-medium bg-farm-green/10 px-2 py-0.5 rounded-lg">
            {isOutOfStock ? "❌ Out of stock" : "✓ Available"}
          </span>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || adding}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-xl hover:bg-brand-red/90 transition disabled:opacity-50"
        >
          <FiShoppingCart size={15} />
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}