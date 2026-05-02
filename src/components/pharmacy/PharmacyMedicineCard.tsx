"use client";

import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import type { Medicine } from "@/lib/medicines-data";
import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  medicine: Medicine;
  onCompare: (medicine: Medicine) => void;
};

export const PharmacyMedicineCard = memo(function PharmacyMedicineCard({ medicine, onCompare }: Props) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(medicine.id);

  return (
    <motion.div
      className="group relative flex flex-col h-full bg-white hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-500 border-border/50 rounded-2xl overflow-hidden"
    >
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        {medicine.requiresPrescription ? (
          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-amber-200 text-amber-700 bg-amber-50/80 backdrop-blur-sm px-2 py-0.5 rounded-lg">
            Rx Required
          </Badge>
        ) : <div />}
        
        {medicine.discount > 0 && (
          <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
            {medicine.discount}% OFF
          </Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative h-36 w-full rounded-t-2xl bg-slate-50 flex items-center justify-center p-4 group-hover:bg-white transition-colors duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {medicine.image ? (
          <Image
            src={medicine.image}
            alt={medicine.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="text-6xl drop-shadow-sm group-hover:scale-110 transition-transform duration-700 ease-out">
            {medicine.imageEmoji}
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={() => onCompare(medicine)}
              className="h-10 w-10 bg-white/90 backdrop-blur-md text-slate-700 rounded-xl flex items-center justify-center hover:bg-white transition-all border border-slate-100 shadow-lg"
            >
              <ArrowRightLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => addItem(medicine)}
              className="h-10 w-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <Plus className="h-5 w-5" />
            </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{medicine.manufacturer}</span>
          <Badge variant="outline" className="bg-slate-50 text-slate-400 border-slate-100 text-[9px] font-black uppercase">{medicine.category}</Badge>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-base font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">{medicine.name}</h4>
          <p className="text-[10px] font-bold text-slate-400 line-clamp-1">{medicine.salt}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className={`h-1.5 w-1.5 rounded-full ${medicine.availability === 'In Stock' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{medicine.availability}</span>
          </div>
          <p className="text-[9px] font-bold text-slate-400">{medicine.dosage}</p>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-50 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <span className="text-lg font-black text-slate-900">₹{medicine.price}</span>
                <span className="text-[10px] font-bold text-slate-400 line-through">₹{medicine.mrp}</span>
              </div>
            </div>
            <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">SAVE ₹{medicine.mrp - medicine.price}</p>
          </div>

          <div className="pt-2">
            <Button 
              className="w-full h-9 rounded-xl font-black text-xs gap-2"
              variant={inCart ? "secondary" : "default"}
              onClick={() => addItem(medicine)}
            >
              {inCart ? "In Cart" : (
                <>
                  <Plus className="h-3 w-3" /> Add to Cart
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full h-8 mt-1 text-[10px] font-black text-slate-400 hover:text-primary"
              onClick={() => onCompare(medicine)}
            >
              <ArrowRightLeft className="h-3 w-3 mr-2" />
              Compare Prices
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

PharmacyMedicineCard.displayName = "PharmacyMedicineCard";

export default PharmacyMedicineCard;
