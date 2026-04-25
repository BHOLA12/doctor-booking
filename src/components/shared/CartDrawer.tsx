"use client";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CartDrawer({ open, onOpenChange }: Props) {
  const { cartItems, cartTotal, cartCount, removeItem, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    toast.success("Order placed successfully! 🎉", {
      description: "Your medicines will be delivered within 24 hours.",
    });
    clearCart();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[400px] p-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-base">Your Cart</h2>
            {cartCount > 0 && (
              <Badge className="h-5 min-w-5 px-1.5 text-[10px]">{cartCount}</Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="text-5xl mb-4">🛒</div>
              <p className="font-semibold text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add medicines to get started</p>
            </div>
          ) : (
            cartItems.map(({ medicine, quantity }) => (
              <div key={medicine.id} className="flex gap-3 p-3 rounded-xl border bg-card hover:shadow-sm transition-shadow">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/8 text-xl shrink-0">
                  {medicine.imageEmoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate">{medicine.name}</p>
                  <p className="text-xs text-muted-foreground">{medicine.dosage}</p>
                  <p className="text-sm font-bold text-primary mt-1">₹{medicine.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(medicine.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(medicine.id, quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => updateQuantity(medicine.id, quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3 bg-card">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal ({cartCount} items)</span>
              <span className="font-semibold">₹{cartTotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery</span>
              <span className="text-emerald-600 font-semibold">FREE</span>
            </div>
            <div className="flex items-center justify-between font-bold text-base border-t pt-3">
              <span>Total</span>
              <span className="text-primary">₹{cartTotal}</span>
            </div>
            <Button className="w-full h-11 text-sm font-semibold rounded-xl" onClick={handleCheckout}>
              Place Order · ₹{cartTotal}
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
