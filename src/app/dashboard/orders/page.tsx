"use client";

import { useEffect, useState } from "react";
import { useAuth }             from "@/context/AuthContext";
import { useRouter }           from "next/navigation";
import Link                    from "next/link";
import { FiArrowLeft, FiPackage } from "react-icons/fi";
import api                     from "@/lib/axios";

const STATUS_COLORS: Record<string, string> = {
  pending:      "bg-yellow-100 text-yellow-700",
  confirmed:    "bg-blue-100 text-blue-700",
  dispatched:   "bg-purple-100 text-purple-700",
  delivered:    "bg-green-100 text-green-700",
  cancelled:    "bg-red-100 text-red-700",
};

export default function OrdersPage() {
  const { isLoggedIn, loading } = useAuth();
  const router  = useRouter();
  const [orders, setOrders]     = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push("/login");
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my-orders");
        setOrders(res.data);
      } catch {
        setOrders([]);
      } finally {
        setFetching(false);
      }
    };
    if (isLoggedIn) fetchOrders();
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-red text-white px-6 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-white/80 hover:text-white">
            <FiArrowLeft size={22} />
          </Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            My Orders
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8">
        {fetching ? (
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <p className="text-brand-dark/50 animate-pulse">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <FiPackage size={48} className="text-brand-dark/20 mx-auto mb-4" />
            <h3 className="font-semibold text-brand-dark mb-1"
              style={{ fontFamily: "var(--font-playfair)" }}>
              No orders yet
            </h3>
            <p className="text-sm text-brand-dark/50 mb-4">
              Your order history will appear here
            </p>
            <Link href="/products"
              className="inline-block px-6 py-2 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-red/90 transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order: any) => (
              <div key={order._id} className="bg-white rounded-2xl shadow-card p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs text-brand-dark/50">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-brand-dark">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <p className="text-brand-dark/60">
                    {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                  </p>
                  <p className="font-bold text-brand-red">₹{order.totalAmount}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}