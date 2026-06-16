"use client";

import { useState }       from "react";
import { useRouter }      from "next/navigation";
import Link               from "next/link";
import { useForm }        from "react-hook-form";
import toast              from "react-hot-toast";
import api                from "@/lib/axios";

interface SignupForm {
  name:     string;
  email:    string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [loading,  setLoading]  = useState(false);
  const [userId,   setUserId]   = useState<string | null>(null);
  const [otpSent,  setOtpSent]  = useState(false);
  const [otp,      setOtp]      = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>();

  // Step 1 — Register
  const onSubmit = async (data: SignupForm) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/register", data);
      setUserId(res.data.userId);
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2 — Verify OTP
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return toast.error("Enter 6-digit OTP");
    setOtpLoading(true);
    try {
      await api.post("/auth/verify-otp", { userId, otp });
      toast.success("Email verified! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2 — Resend OTP
  const handleResendOtp = async () => {
    try {
      await api.post("/auth/resend-otp", { userId });
      toast.success("New OTP sent!");
    } catch {
      toast.error("Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-red" style={{ fontFamily: "var(--font-playfair)" }}>
            KukrooKoo 🐓
          </h1>
          <p className="text-sm text-brand-dark/60 mt-1">Farm Fresh, Delivered Fresh</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">

          {!otpSent ? (
            <>
              <h2 className="text-2xl font-bold text-brand-dark mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Create Account
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Full Name
                  </label>
                  <input
                    {...register("name", { required: "Name is required" })}
                    placeholder="Your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark placeholder:text-gray-400 transition"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                  )}
                </div>

                {/* Email */}
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

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-brand-dark mb-1">
                    Password
                  </label>
                  <input
                    {...register("password", {
                      required:  "Password is required",
                      minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                    type="password"
                    placeholder="Min. 6 characters"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark placeholder:text-gray-400 transition"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-brand-red text-white rounded-xl font-semibold hover:bg-brand-red/90 transition disabled:opacity-60 mt-2"
                >
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* OTP Verification */}
              <h2 className="text-2xl font-bold text-brand-dark mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}>
                Verify Email
              </h2>
              <p className="text-sm text-brand-dark/60 mb-6">
                Enter the 6-digit OTP sent to your email.
              </p>

              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark text-center text-2xl tracking-widest font-bold placeholder:text-gray-300 transition mb-4"
              />

              <button
                onClick={handleVerifyOtp}
                disabled={otpLoading}
                className="w-full py-3 bg-brand-red text-white rounded-xl font-semibold hover:bg-brand-red/90 transition disabled:opacity-60 mb-3"
              >
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                onClick={handleResendOtp}
                className="w-full py-3 border border-brand-red text-brand-red rounded-xl font-semibold hover:bg-brand-red/5 transition"
              >
                Resend OTP
              </button>
            </>
          )}

          <p className="text-center text-sm text-brand-dark/60 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-red font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}