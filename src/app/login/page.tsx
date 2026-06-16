"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";
import Link          from "next/link";
import { useForm }   from "react-hook-form";
import toast         from "react-hot-toast";
import api           from "@/lib/axios";
import { useAuth }   from "@/context/AuthContext";

interface LoginForm {
  email:    string;
  password: string;
}

export default function LoginPage() {
  const router   = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", data);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}! 🐓`);
      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed";
      // If unverified, go to OTP page
      if (err.response?.data?.userId) {
        toast.error("Please verify your email first");
        router.push(`/signup?verify=${err.response.data.userId}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-red"
            style={{ fontFamily: "var(--font-playfair)" }}>
            KukrooKoo 🐓
          </h1>
          <p className="text-sm text-brand-dark/60 mt-1">Farm Fresh, Delivered Fresh</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <h2 className="text-2xl font-bold text-brand-dark mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Welcome Back
          </h2>

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

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Password
              </label>
              <input
                {...register("password", { required: "Password is required" })}
                type="password"
                placeholder="Your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-brand-dark placeholder:text-gray-400 transition"
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <Link href="/forgot-password"
                className="text-sm text-brand-red hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-red text-white rounded-xl font-semibold hover:bg-brand-red/90 transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-brand-dark/60 mt-6">
            Don't have an account?{" "}
            <Link href="/signup" className="text-brand-red font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}