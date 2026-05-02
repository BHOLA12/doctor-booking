"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import type { Medicine } from "@/lib/medicines-data";
import { CheckCircle2, Plus, ShoppingCart } from "lucide-react";

type Props = {
  medicine: Medicine;
};

export default function MedicineCard({ medicine }: Props) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(medicine.id);

  return (
    <Card className="group relative flex flex-col h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {medicine.discount >= 20 && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5">
            {medicine.discount}% OFF
          </Badge>
        </div>
      )}
      {medicine.requiresPrescription && (
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="outline" className="text-[10px] font-medium border-amber-300 text-amber-700 bg-amber-50 px-1.5 py-0.5">
            Rx Required
          </Badge>
        </div>
      )}
      <CardContent className="flex flex-col flex-1 p-4">
        {/* Image Container */}
        <div className="relative h-40 w-full mb-4 rounded-lg bg-slate-50/50 flex items-center justify-center p-4 group-hover:bg-slate-100/50 transition-colors duration-300">
          {medicine.image ? (
            <Image
              src={medicine.image}
              alt={medicine.name}
              fill
              sizes="(max-width: 768px) 100vw, 300px"
              className="object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="text-5xl drop-shadow-sm group-hover:scale-110 transition-transform duration-500">
              {medicine.imageEmoji}
            </div>
          )}
        </div>

        {/* Category Badge */}
        <div className="flex justify-center mb-3">
          <Badge variant="secondary" className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-none">
            {medicine.category}
          </Badge>
        </div>

        {/* Name & Salt */}
        <div className="text-center mb-3">
          <h3 className="font-bold text-[15px] leading-tight text-slate-800 group-hover:text-primary transition-colors">
            {medicine.name}
          </h3>
          <p className="text-[11px] font-medium text-slate-500 mt-1">{medicine.salt}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{medicine.dosage}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-wider font-semibold">{medicine.manufacturer}</p>
        </div>

        <div className="flex-1" />

        {/* Availability */}
        <div className="mt-2 flex items-center gap-1.5 justify-start px-1">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              medicine.availability === "In Stock"
                ? "bg-emerald-500"
                : medicine.availability === "Limited Stock"
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          />
          <span
            className={`text-[11px] font-semibold ${
              medicine.availability === "In Stock"
                ? "text-emerald-600"
                : medicine.availability === "Limited Stock"
                ? "text-amber-600"
                : "text-red-600"
            }`}
          >
            {medicine.availability}
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-2 flex items-center justify-between px-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">₹{medicine.price}</span>
            <span className="text-xs text-slate-400 line-through font-medium">₹{medicine.mrp}</span>
          </div>
          
          <Button
            size="icon"
            variant={inCart ? "secondary" : "outline"}
            className={`h-8 w-8 rounded-full transition-all duration-300 ${
              !inCart ? "hover:bg-primary hover:text-white hover:border-primary" : "bg-emerald-100 text-emerald-700 border-emerald-200"
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(medicine);
            }}
            disabled={medicine.availability === "Out of Stock"}
          >
            {inCart ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
