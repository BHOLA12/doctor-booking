"use client";

import { X, ShoppingCart, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { type Brand } from "@/lib/problem-categories-data";

type BrandWithPrice = Brand & { price: number; mrp: number; discount: number };

export default function BrandPickerSheet({
  isOpen,
  onClose,
  medicineName,
  saltName,
  brands,
}: {
  isOpen: boolean;
  onClose: () => void;
  medicineName: string;
  saltName: string;
  brands: BrandWithPrice[];
}) {
  const { addItem } = useCart();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-bold">Compare Brands</SheetTitle>
              <SheetDescription className="text-xs mt-1">
                For {medicineName} ({saltName})
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-xl mb-4">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <p className="text-[11px] font-medium text-blue-700">
              All brands contain the same active salt and are 100% verified.
            </p>
          </div>

          {brands.map((brand) => (
            <div 
              key={brand.id} 
              className="p-4 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-primary/20 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-xl group-hover:scale-110 transition-transform">
                    {brand.emoji}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{brand.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Manufactured by {brand.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="text-lg font-bold text-slate-900">₹{brand.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{brand.mrp}</span>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0 border-emerald-100 mt-1">
                    {brand.discount}% OFF
                  </Badge>
                </div>
              </div>

              <Button 
                className="w-full mt-4 h-10 rounded-xl gap-2 shadow-sm"
                onClick={() => {
                  addItem({
                    id: `${brand.id}-${medicineName}`,
                    name: `${medicineName} (${brand.name})`,
                    salt: saltName,
                    price: brand.price,
                    mrp: brand.mrp,
                    discount: brand.discount,
                    category: "Medicine",
                    manufacturer: brand.name,
                    availability: "In Stock",
                    requiresPrescription: false,
                    dosage: "1 Unit",
                    imageEmoji: brand.emoji
                  });
                  onClose();
                }}
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </Button>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t">
          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Prices may vary based on manufacturer and packaging. Consult your doctor before switching brands.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
