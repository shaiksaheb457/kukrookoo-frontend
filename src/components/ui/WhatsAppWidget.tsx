"use client";

import { useState } from "react";
import { FiMessageCircle, FiX } from "react-icons/fi";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="absolute bottom-16 right-0 w-64 bg-white rounded-2xl shadow-cardHov p-4 mb-2">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-green-500 rounded-full flex items-center justify-center text-white text-lg">
                Chicken
              </div>
              <div>
                <p className="font-semibold text-sm text-brand-dark">KukrooKoo Support</p>
                <p className="text-xs text-farm-green">Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-brand-dark/30 hover:text-brand-red">
              <FiX size={16} />
            </button>
          </div>
          <p className="text-sm text-brand-dark/60 mb-3">
            Hi! Need help with an order, delivery, or product info? Chat with us on WhatsApp.
          </p>
          <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="block text-center py-2.5 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition">
            Start Chat
          </a>
        </div>
      )}

      <button onClick={() => setOpen(!open)} className="w-14 h-14 bg-green-500 rounded-full shadow-cardHov flex items-center justify-center text-white hover:bg-green-600 transition hover:scale-110">
        {open ? <FiX size={24} /> : <FiMessageCircle size={24} />}
      </button>
    </div>
  );
}