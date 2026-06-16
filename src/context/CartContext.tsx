"use client";

import {
  createContext, useContext, useState,
  useEffect, ReactNode
} from "react";
import toast from "react-hot-toast";

export interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  unit:     string;
  quantity: number;
  weight:   string;
  emoji:    string;
}

interface CartContextType {
  items:       CartItem[];
  addItem:     (item: CartItem) => void;
  removeItem:  (id: string) => void;
  updateQty:   (id: string, qty: number) => void;
  clearCart:   () => void;
  totalItems:  number;
  totalPrice:  number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("kukrookoo_cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("kukrookoo_cart", JSON.stringify(items));
  }, [items]);

const addItem = (item: CartItem) => {
  setItems((prev) => {
    const existing = prev.find(
      (i) => i.id === item.id && i.weight === item.weight
    );
    if (existing) {
      return prev.map((i) =>
        i.id === item.id && i.weight === item.weight
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    }
    return [...prev, item];
  });
  // toast OUTSIDE setItems — never call side effects inside setState
  toast.success(`${item.name} added to cart!`);
};

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Item removed");
  };

  const updateQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem,
      updateQty, clearCart,
      totalItems, totalPrice,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);