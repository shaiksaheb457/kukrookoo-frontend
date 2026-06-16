import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-brand-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-brand-red rounded-xl flex items-center justify-center text-lg">🐓</div>
              <span className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                KukrooKoo
              </span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-4">
              Farm fresh poultry delivered to your door. Ethical farming, premium quality.
            </p>
            <p className="text-brand-orange text-sm font-medium">
              📍 Kadapa, Andhra Pradesh
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "Home",     href: "/"         },
                { label: "Products", href: "/products" },
                { label: "About Us", href: "/#about"   },
                { label: "Contact",  href: "/#contact" },
              ].map((l) => (
                <Link key={l.href} href={l.href}
                  className="block text-sm text-white/50 hover:text-brand-orange transition">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Categories</h4>
            <div className="space-y-2">
              {[
                "Live Broiler Chicken",
                "Country Chicken",
                "Fresh Broiler Meat",
                "KukrooKoo Masala",
              ].map((c) => (
                <Link key={c} href="/products"
                  className="block text-sm text-white/50 hover:text-brand-orange transition">
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Contact Us</h4>
            <div className="space-y-3 text-sm text-white/50">
              <p>📞 +91 98765 43210</p>
              <p>✉️ hello@kukrookoo.com</p>
              <p>⏰ Mon–Sat, 6am–8pm</p>
              <a href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-500 transition">
                💬 WhatsApp Us
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>© 2026 KukrooKoo. All rights reserved.</p>
          <p>Made with ❤️ in Andhra Pradesh</p>
        </div>
      </div>
    </footer>
  );
}