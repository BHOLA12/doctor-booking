"use client";

import { Building2, ChevronRight, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type Brand } from "@/lib/problem-categories-data";

export default function BrandCard({ 
  brand, 
  isSelected, 
  onClick 
}: { 
  brand: Brand, 
  isSelected?: boolean,
  onClick?: () => void
}) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? "border-primary bg-primary/5 shadow-md" 
          : "border-slate-100 hover:border-slate-300 hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${
            isSelected ? "bg-white shadow-sm" : "bg-slate-50"
          }`}>
            {brand.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-800 truncate">{brand.name}</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <Package className="h-3 w-3 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight">
                {brand.medicineCount}+ Medicines
              </span>
            </div>
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${
            isSelected ? "text-primary translate-x-1" : "text-slate-300"
          }`} />
        </div>
        
        {isSelected && (
          <p className="mt-3 text-[11px] text-slate-500 leading-tight border-t border-primary/10 pt-3 italic">
            {brand.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
