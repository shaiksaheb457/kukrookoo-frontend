"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api   from "@/lib/axios";
import { FiShoppingBag } from "react-icons/fi";

const STATUS_OPTIONS = ["pending", "confirmed", "dispatched", "delivered", "cancelled"];

const STATUS_COLORS: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  dispatched: "bg-purple-100 text-purple-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

export default function AdminOrdersPage() {
  const [orders,  setOrders]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin/all");
      setOrders(res.data);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/orders/admin/${id}/status`, { status });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}>
        Orders
      </h1>
      <p className="text-brand-dark/50 text-sm mb-8">Manage and track customer orders</p>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-brand-dark/40">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center">
            <FiShoppingBag size={48} className="text-brand-dark/20 mx-auto mb-3" />
            <p className="font-semibold text-brand-dark mb-1">No orders yet</p>
            <p className="text-sm text-brand-dark/50">Orders will appear here once customers start buying</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-brand-dark/50">
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-gray-50 hover:bg-brand-cream/30 transition">
                  <td className="px-6 py-4 font-mono text-xs text-brand-dark/70">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-brand-dark">{order.user?.name}</p>
                    <p className="text-xs text-brand-dark/40">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-brand-dark/60">{order.items?.length} items</td>
                  <td className="px-6 py-4 font-semibold text-brand-red">₹{order.totalAmount}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs uppercase font-semibold text-brand-dark/50">
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full capitalize border-0 focus:outline-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}