"use client";

import Link              from "next/link";
import { usePathname }   from "next/navigation";
import { useAuth }       from "@/context/AuthContext";
import { useRouter }     from "next/navigation";
import {
  FiGrid, FiBox, FiShoppingBag,
  FiUsers, FiLogOut, FiArrowLeft
} from "react-icons/fi";

const menuItems = [
  { icon: <FiGrid size={18} />,        label: "Dashboard", href: "/admin"           },
  { icon: <FiBox size={18} />,         label: "Products",  href: "/admin/products"  },
  { icon: <FiShoppingBag size={18} />, label: "Orders",    href: "/admin/orders"    },
  { icon: <FiUsers size={18} />,       label: "Customers", href: "/admin/customers" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const router = useRouter();

  return (
    <aside className="w-64 bg-brand-dark text-white min-h-screen flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-lg">🐓</div>
          <div>
            <span className="font-bold text-lg" style={{ fontFamily: "var(--font-playfair)" }}>
              KukrooKoo
            </span>
            <p className="text-[9px] text-white/40 uppercase tracking-wide">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-brand-red text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}>
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-1">
        <Link href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white transition">
          <FiArrowLeft size={18} /> Back to Site
        </Link>
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-brand-red hover:bg-red-500/10 transition">
          <FiLogOut size={18} /> Logout
        </button>
        <div className="px-4 pt-2">
          <p className="text-xs text-white/40">Logged in as</p>
          <p className="text-sm font-medium truncate">{user?.name}</p>
        </div>
      </div>
    </aside>
  );
}