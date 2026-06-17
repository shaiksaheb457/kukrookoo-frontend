"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "@/lib/axios";
import { FiLock, FiCheckCircle } from "react-icons/fi";

interface ResetForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetForm>();

  const password = watch("password");

  const onSubmit = async (data: ResetForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", {
        token,
        password: data.password,
      });
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-brand-cream">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl shadow-cardHov p-10">
            <div className="w-20 h-20 bg-farm-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle size={40} className="text-farm-green" />
            </div>
            <h2
              className="text-2xl font-bold text-brand-dark mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Password Reset!
            </h2>
            <p className="text-brand-dark/60 mb-6">
              Your password has been updated successfully.
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition text-sm"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl shadow-card p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock size={28} className="text-brand-red" />
            </div>
            <h1
              className="text-2xl font-bold text-brand-dark"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Reset Password
            </h1>
            <p className="text-sm text-brand-dark/50 mt-2">
              Enter your new password below.
            </p>
          </div>

          {!token && (
            <p className="text-red-500 text-sm text-center mb-4">
              Missing or invalid reset link. Please request a new one.
            </p>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark/70 mb-1">
                New Password
              </label>
              <input
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark/70 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition disabled:opacity-60 text-sm"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <p className="text-center text-sm text-brand-dark/50 mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-brand-red font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}