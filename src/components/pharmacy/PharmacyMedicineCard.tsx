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
  onViewDetails?: (medicine: Medicine) => void;
};

export const PharmacyMedicineCard = memo(function PharmacyMedicineCard({ medicine, onCompare, onViewDetails }: Props) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(medicine.id);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
      onClick={() => onViewDetails?.(medicine)}
      className="group relative flex flex-col h-full bg-white hover:shadow-2xl hover:shadow-teal-900/[0.04] transition-all duration-300 border border-slate-100 hover:border-teal-500/20 rounded-3xl overflow-hidden cursor-pointer"
    >
      {/* Badges Overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        {medicine.requiresPrescription ? (
          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wide border-amber-200/60 text-amber-700 bg-amber-50/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Rx Required
          </Badge>
        ) : <div />}
        
        {medicine.discount > 0 && (
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full border-none shadow-md shadow-emerald-500/20">
            {medicine.discount}% OFF
          </Badge>
        )}
      </div>

      {/* Image Container */}
      <div className="relative h-40 w-full rounded-t-3xl bg-slate-50/40 flex items-center justify-center p-5 group-hover:bg-teal-50/10 transition-colors duration-500 border-b border-slate-50">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        {medicine.image ? (
          <Image
            src={medicine.image}
            alt={medicine.name}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="text-6xl drop-shadow-sm group-hover:scale-105 transition-transform duration-500 ease-out select-none">
            {medicine.imageEmoji}
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute bottom-3 right-3 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onCompare(medicine);
              }}
              title="Compare Prices"
              className="h-9 w-9 bg-white/95 backdrop-blur-md text-slate-600 rounded-xl flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all duration-200 border border-slate-100 shadow-md hover:shadow-teal-500/10"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                addItem(medicine);
              }}
              title="Add to Cart"
              className="h-9 w-9 bg-teal-600 text-white rounded-xl flex items-center justify-center hover:bg-teal-500 transition-all duration-200 shadow-md shadow-teal-600/10 hover:shadow-teal-500/20"
            >
              <Plus className="h-4 w-4" />
            </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3.5 sm:p-5 space-y-3.5 sm:space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between gap-2 min-w-0">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest truncate flex-1 min-w-0">{medicine.manufacturer}</span>
          <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-100/60 text-[9px] font-bold uppercase rounded-full px-2 py-0.5 shrink-0">{medicine.category}</Badge>
        </div>
        
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-slate-800 leading-snug group-hover:text-teal-600 transition-colors line-clamp-1">{medicine.name}</h4>
          <p className="text-[11px] font-medium text-slate-400 line-clamp-1">{medicine.salt}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <div className={`h-1.5 w-1.5 rounded-full ${medicine.availability === 'In Stock' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{medicine.availability}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">{medicine.dosage}</span>
        </div>

        <div className="mt-auto pt-3.5 sm:pt-4 border-t border-slate-100/60 flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-end justify-between gap-2">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">Best Price</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-slate-900">₹{medicine.price}</span>
                <span className="text-xs font-medium text-slate-400 line-through">₹{medicine.mrp}</span>
              </div>
            </div>
            {medicine.mrp - medicine.price > 0 && (
              <p className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider shrink-0">
                SAVE ₹{medicine.mrp - medicine.price}
              </p>
            )}
          </div>

          <div className="pt-1 flex flex-col gap-1.5">
            <Button 
              className={`w-full h-10 rounded-xl font-extrabold text-xs transition-all duration-300 ${
                inCart 
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none" 
                  : "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20 active:scale-[0.98]"
              }`}
              onClick={(e) => {
                e.stopPropagation();
                addItem(medicine);
              }}
            >
              {inCart ? "In Cart" : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Add to Cart
                </>
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              className="w-full h-8 text-[10px] font-bold text-slate-400 hover:text-teal-600 hover:bg-teal-50/50 rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                onCompare(medicine);
              }}
            >
              <ArrowRightLeft className="h-3 w-3 mr-1.5" />
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
