"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { Medicine } from "@/lib/medicines-data";

export type CartItem = {
  medicine: Medicine;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addItem: (medicine: Medicine) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "docbook_cart_v1";

function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as CartItem[];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage quota exceeded or unavailable
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount (client-side only)
  useEffect(() => {
    setCartItems(loadCartFromStorage());
    setHydrated(true);
  }, []);

  // Persist to localStorage on every change (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, hydrated]);

  const addItem = useCallback((medicine: Medicine) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.medicine.id === medicine.id);
      if (existing) {
        return prev.map((i) =>
          i.medicine.id === medicine.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.medicine.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.medicine.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.medicine.id === id ? { ...i, quantity } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const isInCart = useCallback(
    (id: string) => cartItems.some((i) => i.medicine.id === id),
    [cartItems]
  );

  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartTotal = cartItems.reduce(
    (acc, i) => acc + i.medicine.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cartItems, cartCount, cartTotal, addItem, removeItem, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
