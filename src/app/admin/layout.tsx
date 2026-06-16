"use client";

import { useEffect }    from "react";
import { useAuth }      from "@/context/AuthContext";
import { useRouter }    from "next/navigation";
import AdminSidebar      from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isLoggedIn) { router.push("/login"); return; }
    if (user?.role !== "admin") { router.push("/"); return; }
  }, [loading, isLoggedIn, user, router]);

  if (loading || !isLoggedIn || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <p className="text-brand-red font-semibold animate-pulse">Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 bg-brand-cream min-h-screen">
        {children}
      </main>
    </div>
  );
}