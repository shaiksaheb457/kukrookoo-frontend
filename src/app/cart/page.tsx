"use client";

import { useState }  from "react";
import Link          from "next/link";
import { useRouter } from "next/navigation";
import Navbar        from "@/components/layout/Navbar";
import Footer        from "@/components/layout/Footer";
import { useCart }   from "@/context/CartContext";
import { useAuth }   from "@/context/AuthContext";
import toast         from "react-hot-toast";
import {
  FiTrash2, FiShoppingBag,
  FiTag, FiArrowRight
} from "react-icons/fi";

const COUPONS: Record<string, number> = {
  "FRESH10":    10,
  "KUKROO20":   20,
  "FIRSTORDER": 15,
};

export default function CartPage() {
  const { items, removeItem, updateQty, clearCart, totalPrice } = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const [coupon,    setCoupon]    = useState("");
  const [discount,  setDiscount]  = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  const deliveryFee   = totalPrice > 500 ? 0 : 40;
  const discountAmt   = Math.round(totalPrice * discount / 100);
  const finalTotal    = totalPrice - discountAmt + deliveryFee;

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (COUPONS[code]) {
      setDiscount(COUPONS[code]);
      setCouponMsg(`✅ ${COUPONS[code]}% discount applied!`);
      toast.success(`Coupon applied — ${COUPONS[code]}% off!`);
    } else {
      setCouponMsg("❌ Invalid coupon code");
      setDiscount(0);
    }
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    router.push("/checkout");
  };

  if (items.length === 0) return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-7xl mb-6">🛒</p>
        <h2 className="text-2xl font-bold text-brand-dark mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}>
          Your cart is empty
        </h2>
        <p className="text-brand-dark/50 mb-8">
          Add some fresh chicken to get started!
        </p>
        <Link href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition">
          <FiShoppingBag size={18} /> Shop Now
        </Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-red to-brand-orange text-white py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl font-bold"
            style={{ fontFamily: "var(--font-playfair)" }}>
            My Cart ({items.length} items)
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Cart items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div key={`${item.id}-${item.weight}`}
                className="bg-white rounded-2xl shadow-card p-4 flex gap-4 items-center">

                {/* Emoji */}
                <div className="w-16 h-16 bg-brand-cream rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {item.emoji}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-brand-dark text-sm leading-tight mb-0.5 truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-brand-dark/50 mb-2">{item.weight}</p>
                  <div className="flex items-center gap-3">
                    {/* Qty controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(`${item.id}-${item.weight}`, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-brand-dark hover:border-brand-red hover:text-brand-red transition font-bold"
                      >−</button>
                      <span className="text-sm font-bold text-brand-dark w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(`${item.id}-${item.weight}`, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-brand-dark hover:border-brand-red hover:text-brand-red transition font-bold"
                      >+</button>
                    </div>
                    <span className="text-brand-red font-bold text-sm">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(`${item.id}-${item.weight}`)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-brand-dark/30 hover:text-brand-red hover:bg-red-50 transition flex-shrink-0"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            {/* Clear cart */}
            <button onClick={clearCart}
              className="text-sm text-brand-dark/40 hover:text-brand-red transition font-medium">
              Clear cart
            </button>
          </div>

          {/* Order summary */}
          <div className="space-y-4">

            {/* Coupon */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-semibold text-brand-dark mb-3 flex items-center gap-2">
                <FiTag size={16} className="text-brand-red" /> Coupon Code
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                  placeholder="Enter coupon"
                  className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red text-sm bg-brand-cream/30"
                />
                <button onClick={applyCoupon}
                  className="px-4 py-2.5 bg-brand-red text-white text-sm font-semibold rounded-xl hover:bg-brand-red/90 transition">
                  Apply
                </button>
              </div>
              {couponMsg && (
                <p className="text-xs mt-2 font-medium text-brand-dark/60">{couponMsg}</p>
              )}
              <p className="text-[10px] text-brand-dark/30 mt-2">
                Try: FRESH10 · KUKROO20 · FIRSTORDER
              </p>
            </div>

            {/* Price summary */}
            <div className="bg-white rounded-2xl shadow-card p-5">
              <h3 className="font-semibold text-brand-dark mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-brand-dark/60">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                {discountAmt > 0 && (
                  <div className="flex justify-between text-farm-green font-medium">
                    <span>Discount ({discount}%)</span>
                    <span>− ₹{discountAmt}</span>
                  </div>
                )}
                <div className="flex justify-between text-brand-dark/60">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? "text-farm-green font-medium" : ""}>
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-[10px] text-brand-dark/40">
                    Free delivery on orders above ₹500
                  </p>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-brand-dark text-base">
                  <span>Total</span>
                  <span className="text-brand-red">₹{finalTotal}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-5 flex items-center justify-center gap-2 py-3.5 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition shadow-card"
              >
                Proceed to Checkout
                <FiArrowRight size={18} />
              </button>

              <Link href="/products"
                className="block text-center text-sm text-brand-dark/50 hover:text-brand-red transition mt-3">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}