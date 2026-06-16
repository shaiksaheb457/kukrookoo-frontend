"use client";

import { useState }  from "react";
import Link          from "next/link";
import { useForm }   from "react-hook-form";
import toast         from "react-hot-toast";
import api           from "@/lib/axios";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>();

  const onSubmit = async (data: { email: string }) => {
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-red"
            style={{ fontFamily: "var(--font-playfair)" }}>
            KukrooKoo 🐓
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          {!sent ? (
            <>
              <h2 className="text-2xl font-bold text-brand-dark mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Forgot Password?
              </h2>
              <p className="text-sm text-brand-dark/60 mb-6">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Email Address
                  </label>
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern:  { value: /^\S+@\S+$/, message: "Invalid email" },
                    })}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark placeholder:text-gray-400 transition"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-red text-white rounded-xl font-semibold hover:bg-brand-red/90 transition disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">📧</div>
              <h2 className="text-xl font-bold text-brand-dark mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Check your inbox!
              </h2>
              <p className="text-sm text-brand-dark/60">
                We've sent a password reset link to your email.
              </p>
            </div>
          )}

          <p className="text-center text-sm text-brand-dark/60 mt-6">
            <Link href="/login" className="text-brand-red font-semibold hover:underline">
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}