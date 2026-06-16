"use client";

import { useEffect, useState } from "react";
import { useAuth }             from "@/context/AuthContext";
import { useRouter }           from "next/navigation";
import Link                    from "next/link";
import { FiArrowLeft, FiMapPin, FiPlus } from "react-icons/fi";
import api                     from "@/lib/axios";
import toast                   from "react-hot-toast";

export default function AddressesPage() {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showForm,  setShowForm]  = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [form, setForm] = useState({
    label: "Home", line1: "", line2: "",
    city: "", state: "", pincode: "",
  });

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push("/login");
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get("/auth/me");
        setAddresses(res.data.addresses || []);
      } catch {}
    };
    if (isLoggedIn) fetchAddresses();
  }, [isLoggedIn]);

  const handleSave = async () => {
    if (!form.line1 || !form.city || !form.pincode)
      return toast.error("Fill in required fields");
    setSaving(true);
    try {
      const res = await api.post("/auth/address", form);
      setAddresses(res.data.addresses);
      setShowForm(false);
      toast.success("Address saved!");
    } catch {
      toast.error("Failed to save address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-red text-white px-6 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-white/80 hover:text-white">
              <FiArrowLeft size={22} />
            </Link>
            <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
              My Addresses
            </h1>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1 text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition">
            <FiPlus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8 space-y-3">

        {/* Add form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-card p-5 space-y-3">
            <h3 className="font-semibold text-brand-dark">New Address</h3>
            {[
              { key: "label",   label: "Label (Home/Work)", placeholder: "Home" },
              { key: "line1",   label: "Address Line 1 *",  placeholder: "Street, Area" },
              { key: "line2",   label: "Address Line 2",    placeholder: "Landmark (optional)" },
              { key: "city",    label: "City *",            placeholder: "City" },
              { key: "state",   label: "State *",           placeholder: "State" },
              { key: "pincode", label: "Pincode *",         placeholder: "500001" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-brand-dark/60 mb-1">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red text-sm bg-brand-cream/30 transition"
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-2.5 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-red/90 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Address"}
            </button>
          </div>
        )}

        {/* Address list */}
        {addresses.length === 0 && !showForm ? (
          <div className="bg-white rounded-2xl shadow-card p-10 text-center">
            <FiMapPin size={40} className="text-brand-dark/20 mx-auto mb-3" />
            <p className="font-semibold text-brand-dark mb-1">No addresses saved</p>
            <p className="text-sm text-brand-dark/50">Add a delivery address to get started</p>
          </div>
        ) : (
          addresses.map((addr: any, i: number) => (
            <div key={i} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-brand-red mt-0.5" size={18} />
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{addr.label}</p>
                  <p className="text-sm text-brand-dark/60 mt-0.5">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                  </p>
                  <p className="text-sm text-brand-dark/60">
                    {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}