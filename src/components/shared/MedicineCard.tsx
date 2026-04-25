"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <CardContent className="flex flex-col flex-1 p-5">
        {/* Emoji + Category */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-2xl shrink-0">
            {medicine.imageEmoji}
          </div>
          <Badge variant="secondary" className="text-[10px] font-medium">
            {medicine.category}
          </Badge>
        </div>

        {/* Name & Salt */}
        <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
          {medicine.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">{medicine.salt}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{medicine.dosage}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{medicine.manufacturer}</p>

        <div className="flex-1" />

        {/* Availability */}
        <div className="mt-3 flex items-center gap-1.5">
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
            className={`text-xs font-medium ${
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

        {/* Price */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">₹{medicine.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{medicine.mrp}</span>
        </div>

        {/* Add to Cart */}
        <Button
          size="sm"
          variant={inCart ? "secondary" : "default"}
          className="w-full mt-3 gap-1.5 transition-all"
          onClick={() => addItem(medicine)}
          disabled={medicine.availability === "Out of Stock"}
        >
          {inCart ? (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-3.5 w-3.5" />
              Add to Cart
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
