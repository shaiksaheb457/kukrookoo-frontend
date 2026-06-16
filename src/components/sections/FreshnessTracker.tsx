"use client";

import { motion } from "framer-motion";
import { FiCheck } from "react-icons/fi";

const stages = [
  { emoji: "🌾", label: "Farm Raised",    time: "Day 1–45",     done: true },
  { emoji: "🏥", label: "Health Checked", time: "Morning",      done: true },
  { emoji: "🔪", label: "Freshly Cut",    time: "Today, 6 AM",  done: true },
  { emoji: "📦", label: "Packed & Ready", time: "Today, 8 AM",  done: true },
  { emoji: "🚚", label: "Out for Delivery", time: "Today",      done: false },
  { emoji: "🏠", label: "At Your Door",   time: "By 7 PM",      done: false },
];

export default function FreshnessTracker() {
  return (
    <section className="py-16 bg-gradient-to-br from-farm-green/5 to-brand-cream">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-farm-green text-sm font-semibold uppercase tracking-widest">
            Freshness Guarantee
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-dark mt-2"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Track Your Chicken's Journey
          </h2>
          <p className="text-brand-dark/50 mt-2 max-w-md mx-auto">
            From our farm to your plate — every step, hygienically tracked.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-card p-6 sm:p-8">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 rounded-full hidden sm:block">
              <div className="h-full bg-farm-green rounded-full" style={{ width: "66%" }} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 relative">
              {stages.map((stage, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center text-xl mb-2 border-2 ${
                    stage.done
                      ? "bg-farm-green border-farm-green text-white"
                      : "bg-white border-gray-200 text-gray-300"
                  }`}>
                    {stage.done ? <FiCheck size={20} /> : stage.emoji}
                  </div>
                  <p className="text-xs font-semibold text-brand-dark">{stage.label}</p>
                  <p className="text-[10px] text-brand-dark/40">{stage.time}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}