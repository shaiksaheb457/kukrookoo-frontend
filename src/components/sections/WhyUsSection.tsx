"use client";

import { motion } from "framer-motion";

const features = [
  { emoji: "🌿", title: "Farm Fresh",           desc: "Direct from our own farm. No middlemen, no cold storage delays."        },
  { emoji: "🚫", title: "No Chemicals",          desc: "Birds raised without harmful hormones or antibiotics."                  },
  { emoji: "🧼", title: "Hygienically Cut",      desc: "Processed in clean, certified facilities with food-grade equipment."    },
  { emoji: "💪", title: "Healthy Birds",         desc: "Fed on natural grains. Regular vet checks ensure quality."              },
  { emoji: "⭐", title: "Trusted Quality",       desc: "2,000+ happy customers. Consistent quality every single order."        },
  { emoji: "⚡", title: "Fast Delivery",         desc: "Same-day delivery. Fresh at your door within hours of processing."     },
];

export default function WhyUsSection() {
  return (
    <section className="py-20 bg-brand-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-brand-red text-sm font-semibold uppercase tracking-widest"
          >
            Why KukrooKoo
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-brand-dark mt-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            The KukrooKoo Promise
          </motion.h2>
          <p className="text-brand-dark/50 mt-3 max-w-md mx-auto">
            We take quality seriously — from the farm to your kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-card hover:shadow-cardHov hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-brand-red/10 rounded-2xl flex items-center justify-center text-2xl mb-4">
                {f.emoji}
              </div>
              <h3 className="font-bold text-brand-dark mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>
                {f.title}
              </h3>
              <p className="text-sm text-brand-dark/60 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}