"use client";

import { ShoppingCart, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { type ConditionMedicine } from "@/lib/problem-categories-data";
import { useCart } from "@/context/CartContext";

export default function ConditionMedicineCard({ 
  medicine, 
  onViewBrands 
}: { 
  medicine: ConditionMedicine, 
  onViewBrands?: () => void 
}) {
  const { addItem } = useCart();

  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-slate-200 overflow-hidden bg-white">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-50 group-hover:bg-white transition-colors duration-500 overflow-hidden border border-slate-100 p-2">
            {medicine.image ? (
              <Image 
                src={medicine.image} 
                alt={medicine.name} 
                fill
                sizes="96px"
                className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500" 
              />
            ) : (
              <span className="text-4xl drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
                {medicine.imageEmoji}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h4 className="font-bold text-slate-800 text-lg leading-tight group-hover:text-primary transition-colors">
              {medicine.name}
            </h4>
            <p className="text-xs font-medium text-slate-500 mt-1">{medicine.salt}</p>
            
            <div className="mt-3 flex items-center gap-3">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-slate-900">₹{medicine.price}</span>
                <span className="text-xs text-slate-400 line-through font-medium">₹{medicine.mrp}</span>
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-0.5 border-none font-bold rounded-full">
                {medicine.discount}% OFF
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-[11px] h-9 gap-1.5 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
            onClick={onViewBrands}
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Brands
          </Button>
          <Button 
            size="sm" 
            className="text-[11px] h-9 gap-1.5 shadow-sm"
            onClick={() => addItem({
              id: medicine.id,
              name: medicine.name,
              salt: medicine.salt,
              price: medicine.price,
              mrp: medicine.mrp,
              discount: medicine.discount,
              category: "Medicine",
              manufacturer: "Various",
              availability: medicine.availability as any,
              requiresPrescription: false,
              dosage: "1 Unit",
              imageEmoji: medicine.imageEmoji
            })}
          >
            <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
