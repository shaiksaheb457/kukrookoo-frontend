"use client";

import { useState, useEffect } from "react";
import { useRouter }           from "next/navigation";
import Navbar                  from "@/components/layout/Navbar";
import Footer                  from "@/components/layout/Footer";
import { useCart }             from "@/context/CartContext";
import { useAuth }             from "@/context/AuthContext";
import { useForm }             from "react-hook-form";
import toast                   from "react-hot-toast";
import api                     from "@/lib/axios";
import { FiMapPin, FiCreditCard, FiCheckCircle } from "react-icons/fi";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-sdk")) return resolve(true);
    const script = document.createElement("script");
    script.id  = "razorpay-sdk";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface CheckoutForm {
  name:         string;
  phone:        string;
  line1:        string;
  line2:        string;
  city:         string;
  state:        string;
  pincode:      string;
  instructions: string;
}

const PAYMENT_METHODS = [
  { id: "razorpay", label: "Razorpay",          icon: "💳", desc: "UPI, Cards, Net Banking" },
  { id: "upi",      label: "UPI Direct",         icon: "📱", desc: "GPay, PhonePe, Paytm"   },
  { id: "cod",      label: "Cash on Delivery",   icon: "💵", desc: "Pay when delivered"      },
];

const DELIVERY_SLOTS = [
  { id: "morning",   label: "Morning",   time: "8 AM – 11 AM",  emoji: "🌅" },
  { id: "afternoon", label: "Afternoon", time: "12 PM – 3 PM",  emoji: "☀️" },
  { id: "evening",   label: "Evening",   time: "4 PM – 7 PM",   emoji: "🌇" },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { isLoggedIn, user, loading }    = useAuth();
  const router  = useRouter();

  const [payMethod,    setPayMethod]    = useState("cod");
  const [deliverySlot, setDeliverySlot] = useState("morning");
  const [placing,      setPlacing]      = useState(false);
  const [ordered,      setOrdered]      = useState(false);
  const [orderId,      setOrderId]      = useState("");

  const deliveryFee = totalPrice > 500 ? 0 : 40;
  const finalTotal  = totalPrice + deliveryFee;

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: { name: user?.name || "", state: "Andhra Pradesh" },
  });

  useEffect(() => {
    if (!loading && !isLoggedIn) { router.push("/login"); return; }
    if (!loading && items.length === 0 && !ordered) router.push("/cart");
  }, [loading, isLoggedIn, items, ordered, router]);

  const placeCodOrder = async (data: CheckoutForm) => {
    try {
      const res = await api.post("/orders", {
        items: items.map((i) => ({
          product:  i.id,
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          weight:   i.weight,
        })),
        shippingAddress: data,
        paymentMethod:   payMethod,
        deliverySlot,
        totalAmount:     finalTotal,
      });
      setOrderId(res.data._id || "KKO" + Date.now());
    } catch {
      setOrderId("KKO" + Date.now().toString().slice(-8));
    } finally {
      clearCart();
      setOrdered(true);
      setPlacing(false);
    }
  };

  const placeRazorpayOrder = async (data: CheckoutForm) => {
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Check your connection.");
      setPlacing(false);
      return;
    }

    try {
      // Step 1 — create Razorpay order on backend
      const orderRes = await api.post("/payment/create-order", {
        amount: finalTotal,
      });

      const { orderId: rzpOrderId, amount, currency, keyId } = orderRes.data;

      // Step 2 — open Razorpay checkout
      const options = {
        key:      keyId,
        amount:   amount,
        currency: currency,
        name:     "KukrooKoo",
        description: "Farm Fresh Chicken Order",
        order_id: rzpOrderId,
        prefill: {
          name:    data.name,
          contact: data.phone,
        },
        theme: { color: "#A11217" },
        handler: async function (response: any) {
          try {
            // Step 3 — verify payment signature
            const verifyRes = await api.post("/payment/verify", {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
            });

            if (verifyRes.data.verified) {
              // Step 4 — create the actual order in DB
              const res = await api.post("/orders", {
                items: items.map((i) => ({
                  product:  i.id,
                  name:     i.name,
                  price:    i.price,
                  quantity: i.quantity,
                  weight:   i.weight,
                })),
                shippingAddress: data,
                paymentMethod:   payMethod,
                deliverySlot,
                totalAmount:     finalTotal,
                razorpayPaymentId: response.razorpay_payment_id,
              });
              setOrderId(res.data._id || response.razorpay_payment_id);
              clearCart();
              setOrdered(true);
            } else {
              toast.error("Payment verification failed");
            }
          } catch {
            toast.error("Something went wrong verifying payment");
          } finally {
            setPlacing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPlacing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Failed to initiate payment");
      setPlacing(false);
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setPlacing(true);

    if (payMethod === "razorpay" || payMethod === "upi") {
      await placeRazorpayOrder(data);
    } else {
      await placeCodOrder(data);
    }
  };

  // ── Order success screen ──
  if (ordered) return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl shadow-cardHov p-10">
          <div className="w-20 h-20 bg-farm-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheckCircle size={40} className="text-farm-green" />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}>
            Order Placed! 🎉
          </h2>
          <p className="text-brand-dark/60 mb-4">
            Your fresh chicken is being prepared.
          </p>
          <div className="bg-brand-cream rounded-2xl p-4 mb-6">
            <p className="text-xs text-brand-dark/50 mb-1">Order ID</p>
            <p className="font-mono font-bold text-brand-dark text-lg">
              #{orderId.toString().slice(-8).toUpperCase()}
            </p>
          </div>
          <p className="text-sm text-brand-dark/50 mb-6">
            🚚 Expected delivery: <strong>
              {DELIVERY_SLOTS.find((s) => s.id === deliverySlot)?.time || "Today"}
            </strong>
          </p>
          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard/orders")}
              className="flex-1 py-3 border-2 border-brand-red text-brand-red font-semibold rounded-2xl hover:bg-brand-red/5 transition text-sm">
              Track Order
            </button>
            <button onClick={() => router.push("/products")}
              className="flex-1 py-3 bg-brand-red text-white font-semibold rounded-2xl hover:bg-brand-red/90 transition text-sm">
              Shop More
            </button>
          </div>
        </div>
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
            Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left — Address + Payment */}
            <div className="lg:col-span-2 space-y-5">

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-brand-dark mb-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  <FiMapPin className="text-brand-red" size={18} />
                  Delivery Address
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {[
                    { name: "name",    label: "Full Name *",       placeholder: "Your name",       col: 1 },
                    { name: "phone",   label: "Phone Number *",    placeholder: "+91 98765 43210", col: 1 },
                    { name: "line1",   label: "Address Line 1 *",  placeholder: "Street, Area",    col: 2 },
                    { name: "line2",   label: "Address Line 2",    placeholder: "Landmark",        col: 2 },
                    { name: "city",    label: "City *",            placeholder: "Kadapa",          col: 1 },
                    { name: "state",   label: "State *",           placeholder: "Andhra Pradesh",  col: 1 },
                    { name: "pincode", label: "Pincode *",         placeholder: "516001",          col: 1 },
                  ].map((field) => (
                    <div key={field.name}
                      className={field.col === 2 ? "sm:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-brand-dark/70 mb-1">
                        {field.label}
                      </label>
                      <input
                        {...register(field.name as keyof CheckoutForm, {
                          required: field.label.includes("*") ? `${field.label.replace(" *", "")} is required` : false,
                        })}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition"
                      />
                      {errors[field.name as keyof CheckoutForm] && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[field.name as keyof CheckoutForm]?.message}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* Delivery instructions */}
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-brand-dark/70 mb-1">
                      Delivery Instructions
                    </label>
                    <textarea
                      {...register("instructions")}
                      placeholder="E.g. Call before delivery, Leave at door..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-red bg-brand-cream/30 text-sm transition resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Slot */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-brand-dark mb-5"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  🚚 Delivery Slot
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {DELIVERY_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setDeliverySlot(slot.id)}
                      className={`p-4 rounded-2xl border-2 text-center transition ${
                        deliverySlot === slot.id
                          ? "border-brand-red bg-brand-red/5"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="text-2xl mb-1">{slot.emoji}</div>
                      <p className="text-sm font-semibold text-brand-dark">{slot.label}</p>
                      <p className="text-xs text-brand-dark/50">{slot.time}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-card p-6">
                <h2 className="font-bold text-brand-dark mb-5 flex items-center gap-2"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  <FiCreditCard className="text-brand-red" size={18} />
                  Payment Method
                </h2>
                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition ${
                        payMethod === method.id
                          ? "border-brand-red bg-brand-red/5"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={payMethod === method.id}
                        onChange={() => setPayMethod(method.id)}
                        className="accent-brand-red"
                      />
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-brand-dark text-sm">{method.label}</p>
                        <p className="text-xs text-brand-dark/50">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-card p-5 sticky top-20">
                <h3 className="font-bold text-brand-dark mb-4"
                  style={{ fontFamily: "var(--font-playfair)" }}>
                  Order Summary
                </h3>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.weight}`}
                      className="flex items-center gap-3">
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-brand-dark truncate">{item.name}</p>
                        <p className="text-[10px] text-brand-dark/50">{item.weight} × {item.quantity}</p>
                      </div>
                      <span className="text-xs font-bold text-brand-red">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-brand-dark/60">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-brand-dark/60">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-farm-green font-medium" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-dark text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-brand-red">₹{finalTotal}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={placing}
                  className="w-full mt-5 py-3.5 bg-brand-red text-white font-bold rounded-2xl hover:bg-brand-red/90 transition shadow-card disabled:opacity-60 text-sm"
                >
                  {placing ? "Placing Order..." : `Place Order — ₹${finalTotal}`}
                </button>

                <p className="text-center text-[10px] text-brand-dark/30 mt-3">
                  🔒 Secure checkout · Farm fresh guarantee
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}