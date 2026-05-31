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
        <SheetHeader className="p-6 pr-12 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-extrabold text-slate-800">Compare Brands</SheetTitle>
              <SheetDescription className="text-xs mt-1 text-slate-400">
                For {medicineName} ({saltName})
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-teal-50/50 border border-teal-100/50 rounded-2xl mb-4">
            <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0" />
            <p className="text-[11px] font-bold text-teal-700 leading-normal">
              All brands contain the same active salt and are 100% verified.
            </p>
          </div>

          {brands.map((brand) => (
            <div 
              key={brand.id} 
              className="p-4 sm:p-5 rounded-3xl border border-slate-100 bg-white shadow-sm hover:border-teal-500/20 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-xl group-hover:scale-105 transition-transform border border-slate-100 shrink-0">
                    {brand.emoji}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-extrabold text-slate-800 text-sm truncate">{brand.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">By {brand.name}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 pl-2">
                  <div className="flex items-baseline justify-end gap-1.5">
                    <span className="text-lg font-black text-slate-900">₹{brand.price}</span>
                    <span className="text-xs text-slate-400 line-through font-medium">₹{brand.mrp}</span>
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full border-none shadow-sm mt-1.5 font-bold">
                    {brand.discount}% OFF
                  </Badge>
                </div>
              </div>

              <Button 
                className="w-full mt-4 h-10 rounded-xl gap-2 bg-teal-600 hover:bg-teal-500 text-white font-extrabold shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 transition-all duration-200 active:scale-[0.98]"
                onClick={() => {
                  addItem({
                    id: brand.id,
                    name: brand.description || `${medicineName} (${brand.name})`,
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

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center leading-normal">
            Prices may vary based on manufacturer and packaging. Consult your doctor before switching brands.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
