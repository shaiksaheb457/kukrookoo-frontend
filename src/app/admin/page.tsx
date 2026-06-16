"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import {
  FiDollarSign, FiShoppingBag,
  FiTrendingUp, FiPackage
} from "react-icons/fi";

export default function AdminDashboardPage() {
  const [stats, setStats]   = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/orders/admin/analytics");
        setStats(res.data);
      } catch {
        setStats({
          totalRevenue: 0, totalOrders: 0,
          statusCounts: {}, bestSelling: [],
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const cards = [
    {
      label: "Total Revenue",
      value: `₹${stats?.totalRevenue || 0}`,
      icon: <FiDollarSign size={22} />,
      color: "bg-green-50 text-farm-green",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <FiShoppingBag size={22} />,
      color: "bg-orange-50 text-brand-orange",
    },
    {
      label: "Pending Orders",
      value: stats?.statusCounts?.pending || 0,
      icon: <FiPackage size={22} />,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Delivered",
      value: stats?.statusCounts?.delivered || 0,
      icon: <FiTrendingUp size={22} />,
      color: "bg-red-50 text-brand-red",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}>
        Dashboard Overview
      </h1>
      <p className="text-brand-dark/50 text-sm mb-8">
        Welcome back! Here's what's happening with KukrooKoo today.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              {card.icon}
            </div>
            <p className="text-2xl font-bold text-brand-dark">
              {loading ? "..." : card.value}
            </p>
            <p className="text-sm text-brand-dark/50">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-bold text-brand-dark mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Order Status
          </h3>
          {loading ? (
            <p className="text-brand-dark/40 text-sm">Loading...</p>
          ) : Object.keys(stats?.statusCounts || {}).length === 0 ? (
            <p className="text-brand-dark/40 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(stats.statusCounts).map(([status, count]: any) => (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium text-brand-dark">{status}</span>
                    <span className="text-brand-dark/50">{count}</span>
                  </div>
                  <div className="h-2 bg-brand-cream rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-red rounded-full"
                      style={{ width: `${(count / stats.totalOrders) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Best selling products */}
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-bold text-brand-dark mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Best Selling Products
          </h3>
          {loading ? (
            <p className="text-brand-dark/40 text-sm">Loading...</p>
          ) : stats?.bestSelling?.length === 0 ? (
            <p className="text-brand-dark/40 text-sm">No sales data yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.bestSelling?.map((p: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-brand-red/10 text-brand-red font-bold flex items-center justify-center text-xs">
                      {i + 1}
                    </span>
                    <span className="font-medium text-brand-dark">{p.name}</span>
                  </div>
                  <span className="text-brand-dark/50">{p.qty} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}