"use client";

import { useState, useEffect } from "react";
import { useAuth }             from "@/context/AuthContext";
import { useRouter }           from "next/navigation";
import { useForm }             from "react-hook-form";
import toast                   from "react-hot-toast";
import Link                    from "next/link";
import { FiArrowLeft }         from "react-icons/fi";
import api                     from "@/lib/axios";

interface ProfileForm {
  name:  string;
  phone: string;
}

export default function ProfilePage() {
  const { user, loading, isLoggedIn, login, token } = useAuth();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>();

  useEffect(() => {
    if (!loading && !isLoggedIn) router.push("/login");
    if (user) reset({ name: user.name, phone: "" });
  }, [loading, isLoggedIn, user, router, reset]);

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    try {
      const res = await api.put("/auth/profile", data);
      login(token!, res.data.user);
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="bg-brand-red text-white px-6 pt-10 pb-16">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link href="/dashboard" className="text-white/80 hover:text-white">
            <FiArrowLeft size={22} />
          </Link>
          <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
            My Profile
          </h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-8">
        <div className="bg-white rounded-2xl shadow-card p-6">

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-brand-red/10 flex items-center justify-center text-3xl font-bold text-brand-red">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark transition"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-brand-dark/50 cursor-not-allowed"
              />
              <p className="text-xs text-brand-dark/40 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">Phone Number</label>
              <input
                {...register("phone")}
                placeholder="+91 00000 00000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark transition"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-brand-red text-white rounded-xl font-semibold hover:bg-brand-red/90 transition disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}