"use client";

import { useAuth }   from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link          from "next/link";
import ReferralBanner from "@/components/sections/ReferralBanner";
import {
  FiUser, FiShoppingBag, FiMapPin,
  FiHeart, FiLogOut, FiChevronRight
} from "react-icons/fi";

const menuItems = [
  {
    icon:  <FiShoppingBag size={22} />,
    label: "My Orders",
    sub:   "Track & view your orders",
    href:  "/dashboard/orders",
    color: "bg-orange-50 text-brand-orange",
  },
  {
    icon:  <FiUser size={22} />,
    label: "My Profile",
    sub:   "Manage your personal info",
    href:  "/dashboard/profile",
    color: "bg-red-50 text-brand-red",
  },
  {
    icon:  <FiMapPin size={22} />,
    label: "My Addresses",
    sub:   "Saved delivery addresses",
    href:  "/dashboard/addresses",
    color: "bg-green-50 text-farm-green",
  },
  {
    icon:  <FiHeart size={22} />,
    label: "My Wishlist",
    sub:   "Products you love",
    href:  "/wishlist",
    color: "bg-pink-50 text-pink-500",
  },
];

export default function DashboardPage() {
  const { user, logout, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push("/login");
  }, [loading, isLoggedIn, router]);

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="text-brand-red text-lg font-semibold animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream">

      {/* Header */}
      <div className="bg-brand-red text-white px-6 pt-12 pb-20">
        <div className="max-w-lg mx-auto">
          <p className="text-white/70 text-sm mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            {user?.name} 🐓
          </h1>
          <p className="text-white/70 text-sm mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Referral banner */}
      <ReferralBanner />

      {/* Cards */}
      <div className="max-w-lg mx-auto px-4 -mt-4">

        {/* Account card */}
        <div className="bg-white rounded-2xl shadow-card p-5 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-red/10 flex items-center justify-center text-2xl font-bold text-brand-red">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-brand-dark">{user?.name}</p>
              <p className="text-sm text-brand-dark/60">{user?.email}</p>
              <span className="inline-block mt-1 text-xs bg-farm-green/10 text-farm-green px-2 py-0.5 rounded-full font-medium">
                Verified ✓
              </span>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href}
              className="flex items-center gap-4 px-5 py-4 hover:bg-brand-cream/50 transition border-b border-gray-50 last:border-0">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-brand-dark text-sm">{item.label}</p>
                <p className="text-xs text-brand-dark/50">{item.sub}</p>
              </div>
              <FiChevronRight className="text-brand-dark/30" />
            </Link>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="w-full flex items-center justify-center gap-2 bg-white rounded-2xl shadow-card px-5 py-4 text-brand-red font-semibold hover:bg-red-50 transition mb-8"
        >
          <FiLogOut size={18} />
          Logout
        </button>

      </div>
    </div>
  );
}