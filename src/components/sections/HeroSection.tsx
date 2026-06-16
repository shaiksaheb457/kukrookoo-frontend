"use client";

import { motion } from "framer-motion";
import Link       from "next/link";
import { FiArrowRight, FiShield, FiClock, FiStar } from "react-icons/fi";

const trustBadges = [
  { icon: "🌿", label: "Farm Fresh"         },
  { icon: "⚡", label: "Same Day Delivery"  },
  { icon: "✅", label: "Hygienically Cut"   },
  { icon: "💯", label: "100% Fresh"         },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-cream via-orange-50 to-red-50 min-h-[88vh] flex items-center">

      {/* Background decorative circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-orange/8 rounded-full translate-y-1/3 -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-brand-red/10 text-brand-red px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
              Now delivering in Andhra Pradesh
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}>
              Fresh From{" "}
              <span className="text-gradient">Farm</span>
              <br />To Your Plate
            </h1>

            <p className="text-lg text-brand-dark/60 mb-8 leading-relaxed max-w-md">
              Premium live & fresh chicken delivered with trust.
              Ethically farmed, hygienically processed, right at your doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mb-10">
              <Link href="/products"
                className="flex items-center gap-2 px-7 py-3.5 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition shadow-card hover:shadow-cardHov hover:-translate-y-0.5 transform">
                Shop Now
                <FiArrowRight size={18} />
              </Link>
              <Link href="/#categories"
                className="flex items-center gap-2 px-7 py-3.5 border-2 border-brand-red text-brand-red font-semibold rounded-2xl hover:bg-brand-red hover:text-white transition">
                Explore Products
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-card text-sm font-medium text-brand-dark"
                >
                  <span>{badge.icon}</span>
                  {badge.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">

              {/* Main card */}
              <div className="w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-brand-red to-brand-orange rounded-3xl flex items-center justify-center shadow-cardHov relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10" />
                <span className="text-[120px] sm:text-[160px] drop-shadow-2xl select-none">
                  🐓
                </span>

                {/* Floating badge — Rating */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-white rounded-2xl px-3 py-2 shadow-card"
                >
                  <div className="flex items-center gap-1">
                    <FiStar className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-sm font-bold text-brand-dark">4.9</span>
                  </div>
                  <p className="text-[9px] text-brand-dark/50">2k+ Reviews</p>
                </motion.div>

                {/* Floating badge — Delivery */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 bg-white rounded-2xl px-3 py-2 shadow-card"
                >
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-brand-red" size={14} />
                    <span className="text-sm font-bold text-brand-dark">Same Day</span>
                  </div>
                  <p className="text-[9px] text-brand-dark/50">Delivery available</p>
                </motion.div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -inset-4 border-2 border-dashed border-brand-red/20 rounded-3xl -z-10" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}