"use client";

import { useState, useEffect } from "react";
import Link                    from "next/link";
import { useAuth }             from "@/context/AuthContext";
import { useCart }             from "@/context/CartContext";
import { useRouter }           from "next/navigation";
import {
  FiShoppingCart, FiUser, FiMenu,
  FiX, FiSearch, FiLogOut
} from "react-icons/fi";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const { totalItems }               = useCart();
  const router   = useRouter();
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [profileOpen,  setProfileOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { label: "Home",     href: "/"         },
    { label: "Products", href: "/products" },
    { label: "About",    href: "/#about"   },
    { label: "Contact",  href: "/#contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white shadow-md"
          : "bg-white/95 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-white font-bold text-lg">
                🐓
              </div>
              <div>
                <span className="font-bold text-xl text-brand-red"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  KukrooKoo
                </span>
                <p className="text-[9px] text-brand-dark/40 leading-none tracking-wide uppercase">
                  Farm Fresh
                </p>
              </div>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  className="text-sm font-medium text-brand-dark/70 hover:text-brand-red transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">

              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-dark/60 hover:text-brand-red hover:bg-brand-red/5 transition">
                <FiSearch size={18} />
              </button>

              {/* Cart — with live count */}
              <Link href="/cart"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-brand-dark/60 hover:text-brand-red hover:bg-brand-red/5 transition relative">
                <FiShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-brand-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {isLoggedIn ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-brand-red/5 transition">
                    <div className="w-7 h-7 rounded-full bg-brand-red/10 flex items-center justify-center text-sm font-bold text-brand-red">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-brand-dark">
                      {user?.name?.split(" ")[0]}
                    </span>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-cardHov border border-gray-100 overflow-hidden z-50">
                      <Link href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-brand-dark hover:bg-brand-cream transition">
                        <FiUser size={15} /> My Account
                      </Link>
                      <Link href="/dashboard/orders"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-brand-dark hover:bg-brand-cream transition">
                        <FiShoppingCart size={15} /> My Orders
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); router.push("/"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-brand-red hover:bg-red-50 transition border-t border-gray-100">
                        <FiLogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-brand-red text-white text-sm font-semibold rounded-xl hover:bg-brand-red/90 transition">
                  <FiUser size={15} /> Login
                </Link>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-brand-dark/60 hover:text-brand-red transition">
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <div className="pb-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for chicken, masala..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red text-sm bg-brand-cream/50"
                />
                <button type="submit"
                  className="px-4 py-2.5 bg-brand-red text-white rounded-xl text-sm font-semibold hover:bg-brand-red/90 transition">
                  Search
                </button>
              </form>
            </div>
          )}

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-cream hover:text-brand-red transition">
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16" />
    </>
  );
}