"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Minus, Plus, ShoppingCart, Trash2, X, Loader2, LogIn, PackageCheck } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartDrawer({ open, onOpenChange }: Props) {
  const { cartItems, cartTotal, cartCount, removeItem, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [isPlacing, setIsPlacing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      onOpenChange(false);
      router.push("/login?redirect=/medicines");
      return;
    }

    setIsPlacing(true);
    try {
      const payload = {
        items: cartItems.map(({ medicine, quantity }) => ({
          medicineId: medicine.id,
          name: medicine.name,
          price: medicine.price,
          quantity,
          imageEmoji: medicine.imageEmoji,
          dosage: medicine.dosage,
          manufacturer: medicine.manufacturer,
        })),
        totalAmount: cartTotal,
        address: user.name ? `Delivery to ${user.name}'s address` : undefined,
        phone: undefined,
      };

      const res = await fetch("/api/orders/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        clearCart();
        onOpenChange(false);
        toast.success("Order placed successfully! 🎉", {
          description: `Order #${data.data.id.slice(-8).toUpperCase()} confirmed — medicines on the way!`,
          duration: 4000,
        });
        router.push(`/orders/${data.data.id}/track`);
      } else {
        toast.error(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" showCloseButton={false} className="w-full sm:w-[400px] p-0 flex flex-col bg-slate-50/50">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-white shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600 shadow-inner">
              <ShoppingCart className="h-4.5 w-4.5" />
            </div>
            <h2 className="font-extrabold text-slate-800 text-[15px] uppercase tracking-wider">Your Cart</h2>
            {cartCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-[10px] font-black bg-teal-600 hover:bg-teal-600 text-white rounded-full">
                {cartCount}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100" onClick={() => onOpenChange(false)}>
            <X className="h-4.5 w-4.5 text-slate-500" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 mb-6 text-slate-400">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <p className="font-black text-slate-800 text-base">Your cart is empty</p>
              <p className="text-xs text-slate-400 mt-2 max-w-[240px] leading-relaxed">Looks like you haven&apos;t added any medicines yet.</p>
              <Button
                onClick={() => onOpenChange(false)}
                className="mt-6 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 h-11 shadow-md shadow-teal-600/10"
              >
                Browse Medicines
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map(({ medicine, quantity }) => (
                <div key={medicine.id} className="flex gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md hover:border-teal-500/20 transition-all duration-300 group">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-2xl shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {medicine.imageEmoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 leading-snug truncate">{medicine.name}</p>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">{medicine.dosage}</p>
                    <p className="text-sm font-black text-teal-600 mt-1.5">₹{medicine.price}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between min-h-[60px]">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      onClick={() => removeItem(medicine.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-lg hover:bg-white text-slate-500"
                        onClick={() => updateQuantity(medicine.id, quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs font-bold w-5 text-center text-slate-700">{quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-lg hover:bg-white text-slate-500"
                        onClick={() => updateQuantity(medicine.id, quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white px-5 py-6 space-y-4 shadow-[0_-4px_24px_rgba(0,0,0,0.03)]">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Subtotal ({cartCount} items)</span>
                <span className="text-slate-800">₹{cartTotal}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Delivery Charges</span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-[10px]">Free</span>
              </div>
              <div className="h-[1px] bg-slate-100 w-full my-1" />
              <div className="flex items-center justify-between font-black text-slate-800 text-[15px]">
                <span>Total Amount</span>
                <span className="text-teal-600">₹{cartTotal}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {!user ? (
                <Link href="/login?redirect=/medicines" onClick={() => onOpenChange(false)} className="block">
                  <Button className="w-full h-12 text-sm font-extrabold bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg shadow-teal-600/15 flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Login to Place Order
                  </Button>
                </Link>
              ) : (
                <Button
                  className="w-full h-12 text-sm font-extrabold bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg shadow-teal-600/15 active:scale-[0.98] transition-all flex items-center gap-2"
                  onClick={handleCheckout}
                  disabled={isPlacing}
                >
                  {isPlacing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      <PackageCheck className="h-4 w-4" />
                      Place Order · ₹{cartTotal}
                    </>
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider"
                onClick={clearCart}
                disabled={isPlacing}
              >
                Clear All Items
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
