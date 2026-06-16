"use client";

import { motion } from "framer-motion";
import Link       from "next/link";

const stats = [
  { value: "5+",    label: "Years Farming"    },
  { value: "2k+",   label: "Happy Customers"  },
  { value: "100%",  label: "Natural Feed"     },
  { value: "0",     label: "Chemicals Used"   },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main visual box */}
            <div className="bg-gradient-to-br from-farm-green to-farm-light rounded-3xl p-10 flex items-center justify-center min-h-72 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <span className="text-8xl drop-shadow-xl">🌾</span>

              {/* Floating stat */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="absolute top-4 right-4 bg-white rounded-2xl px-4 py-2 shadow-card"
              >
                <p className="text-xs text-brand-dark/50">Est.</p>
                <p className="text-lg font-bold text-farm-green">2019</p>
              </motion.div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-brand-cream rounded-2xl p-3 text-center">
                  <p className="text-xl font-bold text-brand-red"
                    style={{ fontFamily: "var(--font-playfair)" }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] text-brand-dark/50 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <span className="text-brand-red text-sm font-semibold uppercase tracking-widest">
              Our Story
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mt-2 mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}>
              From Our Farm,<br />With Love
            </h2>

            <div className="space-y-4 text-brand-dark/60 leading-relaxed">
              <p>
                KukrooKoo started with a simple belief — that every family deserves
                access to genuinely fresh, chemical-free poultry. We started our farm
                in Andhra Pradesh in 2019 with just 200 birds.
              </p>
              <p>
                Today we raise thousands of birds on natural grain feed, with daily
                veterinary checks and zero artificial hormones. Every bird lives freely,
                eats well, and is processed humanely.
              </p>
              <p>
                When you order from KukrooKoo, you get chicken that was alive this
                morning and on your plate by evening. That's our promise.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                "🌾 Natural grain feed",
                "🏥 Daily vet checks",
                "🚿 Hygienic processing",
                "📦 Same-day delivery",
              ].map((item, i) => (
                <span key={i}
                  className="text-sm bg-farm-green/10 text-farm-green px-3 py-1.5 rounded-xl font-medium">
                  {item}
                </span>
              ))}
            </div>

            <Link href="/products"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition shadow-card">
              Shop Fresh Now →
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}