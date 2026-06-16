"use client";

import { motion } from "framer-motion";
import Link       from "next/link";

const categories = [
  {
    emoji:    "🐔",
    title:    "Live Broiler Chicken",
    subtitle: "Fresh live weight",
    tag:      "Live",
    tagColor: "bg-green-100 text-green-700",
    from:     "from-orange-50",
    to:       "to-orange-100",
    border:   "border-orange-200",
    href:     "/products?category=live-broiler",
    price:    "₹180/kg",
  },
  {
    emoji:    "🦚",
    title:    "Country Chicken",
    subtitle: "Premium naatu kodi",
    tag:      "Premium",
    tagColor: "bg-yellow-100 text-yellow-700",
    from:     "from-yellow-50",
    to:       "to-amber-100",
    border:   "border-yellow-200",
    href:     "/products?category=country-chicken",
    price:    "₹420/kg",
  },
  {
    emoji:    "🍗",
    title:    "Broiler Meat",
    subtitle: "Hygienically cut",
    tag:      "Fresh Cut",
    tagColor: "bg-red-100 text-red-700",
    from:     "from-red-50",
    to:       "to-rose-100",
    border:   "border-red-200",
    href:     "/products?category=broiler-meat",
    price:    "₹220/kg",
  },
  {
    emoji:    "🫙",
    title:    "Secret Masala",
    subtitle: "Farm's signature spice",
    tag:      "Exclusive",
    tagColor: "bg-purple-100 text-purple-700",
    from:     "from-purple-50",
    to:       "to-pink-100",
    border:   "border-purple-200",
    href:     "/products?category=masala",
    price:    "₹199/500g",
  },
];

export default function CategoriesSection() {
  return (
    <section id="categories" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-brand-red text-sm font-semibold uppercase tracking-widest"
          >
            What We Offer
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-brand-dark mt-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Shop by Category
          </motion.h2>
          <p className="text-brand-dark/50 mt-3 max-w-md mx-auto">
            From live birds to fresh cuts — everything delivered farm-fresh to your door.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={cat.href}
                className={`group block bg-gradient-to-br ${cat.from} ${cat.to} border ${cat.border} rounded-2xl p-5 hover:shadow-cardHov hover:-translate-y-1 transition-all duration-300`}>

                {/* Tag */}
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-3 ${cat.tagColor}`}>
                  {cat.tag}
                </span>

                {/* Emoji */}
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {cat.emoji}
                </div>

                <h3 className="font-bold text-brand-dark text-sm sm:text-base leading-tight mb-1">
                  {cat.title}
                </h3>
                <p className="text-xs text-brand-dark/50 mb-3">{cat.subtitle}</p>

                <div className="flex items-center justify-between">
                  <span className="text-brand-red font-bold text-sm">{cat.price}</span>
                  <span className="text-xs text-brand-dark/40 group-hover:text-brand-red transition-colors">
                    Shop →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}