"use client";

import { ShoppingCart, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-3xl group-hover:bg-primary/5 transition-colors">
            {medicine.imageEmoji}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 truncate group-hover:text-primary transition-colors">
              {medicine.name}
            </h4>
            <p className="text-xs text-slate-500 truncate mt-0.5">{medicine.salt}</p>
            
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">₹{medicine.price}</span>
              <span className="text-xs text-slate-400 line-through">₹{medicine.mrp}</span>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 text-[10px] px-1.5 py-0 border-emerald-100">
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
