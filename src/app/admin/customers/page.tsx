"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api   from "@/lib/axios";
import { FiUsers } from "react-icons/fi";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/auth/admin/customers");
        setCustomers(res.data);
      } catch {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}>
        Customers
      </h1>
      <p className="text-brand-dark/50 text-sm mb-8">Manage your registered customers</p>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-brand-dark/40">Loading customers...</div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center">
            <FiUsers size={48} className="text-brand-dark/20 mx-auto mb-3" />
            <p className="font-semibold text-brand-dark mb-1">No customers yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-brand-dark/50">
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Phone</th>
                <th className="px-6 py-4 font-medium">Verified</th>
                <th className="px-6 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id} className="border-b border-gray-50 hover:bg-brand-cream/30 transition">
                  <td className="px-6 py-4 font-medium text-brand-dark">{c.name}</td>
                  <td className="px-6 py-4 text-brand-dark/60">{c.email}</td>
                  <td className="px-6 py-4 text-brand-dark/60">{c.phone || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      c.isVerified ? "bg-farm-green/10 text-farm-green" : "bg-gray-100 text-gray-500"
                    }`}>
                      {c.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-brand-dark/50 text-xs">
                    {new Date(c.createdAt).toLocaleDateString()}
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