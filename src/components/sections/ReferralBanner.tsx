"use client";

import { useState } from "react";
import { useAuth }   from "@/context/AuthContext";
import toast         from "react-hot-toast";
import { FiGift, FiCopy } from "react-icons/fi";

export default function ReferralBanner() {
  const { user, isLoggedIn } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isLoggedIn) return null;

  const referralCode = `KUKROO${user?.id?.slice(-5).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6">
      <div className="bg-gradient-to-r from-brand-red to-brand-orange rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">
            <FiGift size={24} />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base">Refer & Earn ₹100!</p>
            <p className="text-xs sm:text-sm text-white/80">
              Share your code — friends get 10% off, you earn ₹100 credit
            </p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 bg-white text-brand-red px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/90 transition flex-shrink-0"
        >
          <FiCopy size={14} />
          {copied ? "Copied!" : referralCode}
        </button>
      </div>
    </div>
  );
}