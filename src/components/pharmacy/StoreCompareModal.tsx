"use client";

import { useState, useEffect } from "react";
import { X, Star, Clock, ShoppingCart, ShieldCheck, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { PharmacyStore } from "@/lib/pharmacy-data";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  store: PharmacyStore;
  onOrder: () => void;
}

// Compare price coefficients for each store
const PRICE_COEFFICIENTS: Record<string, number> = {
  s1: 1.0,  // Hindustan - base
  s2: 0.94, // Ajay - 6% cheaper
  s3: 1.05, // Gudvil - 5% more expensive
  s4: 0.88, // Green - 12% cheaper
  "registered-store": 0.95, // Registered store - 5% cheaper
};

const COMPARE_MEDICINES = [
  { name: "Dolo 650mg (15 Tabs)", basePrice: 30 },
  { name: "Crocin 500mg (15 Tabs)", basePrice: 28 },
  { name: "Azithral 500mg (5 Tabs)", basePrice: 120 },
  { name: "Combiflam (20 Tabs)", basePrice: 45 },
  { name: "Volini Gel (50g)", basePrice: 145 },
];

export default function StoreCompareModal({ isOpen, onClose, store, onOrder }: Props) {
  const currentCoefficient = PRICE_COEFFICIENTS[store.id] || 0.95;

  const [otherStores, setOtherStores] = useState<any[]>([]);

  useEffect(() => {
    async function loadOtherStores() {
      try {
        const res = await fetch("/api/pharmacies");
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            const dbStores = result.data.map((pharmacy: any) => ({
              id: `db-store-${pharmacy.id}`,
              name: pharmacy.storeName,
              rating: pharmacy.rating || 4.5,
              delivery: "20-30 mins"
            }));

            if (dbStores.length > 0) {
              setOtherStores(dbStores.filter((s: any) => s.id !== store.id));
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error loading comparison stores from database:", err);
      }

      const defaultOther = [
        { id: "s1", name: "Hindustan Medical Hall", rating: 4.8, delivery: "30-45 mins" },
        { id: "s2", name: "Ajay Medical Hall", rating: 4.6, delivery: "45-60 mins" },
        { id: "s3", name: "Gudvil Medical Hall", rating: 4.5, delivery: "60-90 mins" },
        { id: "s4", name: "Green Medical Hall", rating: 4.3, delivery: "15-20 mins" },
      ];
      
      setOtherStores(defaultOther.filter((s: any) => s.id !== store.id));
    }

    loadOtherStores();
  }, [store.id]);

  // Calculate totals
  const calculateTotal = (coef: number) => {
    return COMPARE_MEDICINES.reduce((sum, med) => sum + Math.round(med.basePrice * coef), 0);
  };

  const currentTotal = calculateTotal(currentCoefficient);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="relative bg-white w-full max-w-2xl mx-auto rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
          >
            {/* Header */}
            <div className="bg-slate-50/50 p-4 sm:p-8 border-b border-slate-100/80 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-none font-black text-[9px] uppercase px-3 py-1 rounded-full mb-2 shadow-md shadow-teal-500/10">
                  Market Comparison
                </Badge>
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-tight truncate">
                  Compare Prices for {store.name}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200/60 hover:bg-slate-50 transition-colors shrink-0"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            </div>

            {/* Comparison Grid */}
            <div className="p-4 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
              <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                Common Medicines Basket Price
              </p>

              {/* Medicine List Grid */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/30">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 font-black text-slate-400 uppercase text-[9px] sm:text-[10px] tracking-widest">
                      <th className="p-2 sm:p-4">Medicine Item</th>
                      <th className="p-2 sm:p-4 text-right">This Store</th>
                      <th className="p-2 sm:p-4 text-right">Avg Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_MEDICINES.map((med, index) => {
                      const storePrice = Math.round(med.basePrice * currentCoefficient);
                      const avgPrice = Math.round(med.basePrice * 0.97); // average of all
                      return (
                        <tr key={index} className="border-b border-slate-100/50 font-medium text-slate-600 bg-white">
                          <td className="p-2 sm:p-4 font-bold text-[10px] sm:text-xs md:text-sm">{med.name}</td>
                          <td className="p-2 sm:p-4 text-right font-black text-slate-800 text-[10px] sm:text-xs md:text-sm">₹{storePrice}</td>
                          <td className="p-2 sm:p-4 text-right text-slate-400 text-[10px] sm:text-xs md:text-sm">₹{avgPrice}</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-teal-50/20 font-black text-slate-900">
                      <td className="p-2 sm:p-4 text-[11px] sm:text-sm font-black text-teal-800">Basket Total</td>
                      <td className="p-2 sm:p-4 text-right text-xs sm:text-base text-teal-600 font-extrabold">₹{currentTotal}</td>
                      <td className="p-2 sm:p-4 text-right text-[10px] sm:text-sm text-slate-500">₹{calculateTotal(0.97)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Store vs Store list */}
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                  Total Basket Value comparison with other stores
                </p>

                <div className="grid gap-3">
                  {/* Selected Store card */}
                  <div className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-teal-50/80 border border-teal-200/60 shadow-sm shadow-teal-600/[0.02] gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-9 w-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/10 shrink-0">
                        <Check className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-teal-900 text-sm truncate">{store.name}</h4>
                        <p className="text-[10px] text-teal-600 font-bold uppercase tracking-wide">Selected Store</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block mb-0.5">Basket Price</span>
                      <span className="text-sm sm:text-base font-extrabold text-teal-800">₹{currentTotal}</span>
                    </div>
                  </div>

                  {/* Other Store lists */}
                  {otherStores.map((other, i) => {
                    const otherCoef = PRICE_COEFFICIENTS[other.id] || 1.0;
                    const otherTotal = calculateTotal(otherCoef);
                    const diff = currentTotal - otherTotal;
                    const pctDiff = Math.abs(Math.round((diff / otherTotal) * 100));

                    return (
                      <div key={i} className="flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 hover:bg-slate-50/30 transition-all duration-300 gap-3">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center text-xs font-extrabold border border-slate-100 shrink-0">
                            {other.name.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-slate-800 text-sm truncate">{other.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                              <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" /> {other.rating}</span>
                              <span>• {other.delivery}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Basket Price</span>
                          <div className="flex items-center gap-1.5 sm:gap-2 justify-end">
                            <span className="text-xs sm:text-sm font-black text-slate-800">₹{otherTotal}</span>
                            {diff > 0 ? (
                              <span className="text-[9px] font-black text-red-500 bg-red-50 px-1 py-0.5 rounded-md">+{pctDiff}% Exp</span>
                            ) : (
                              <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1 py-0.5 rounded-md">-{pctDiff}% Save</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-8 bg-slate-50 border-t border-slate-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide text-center sm:text-left">
                *Comparison based on generic MRP data. Prices subject to change.
              </p>
              <Button className="w-full sm:w-auto rounded-2xl h-12 px-6 font-black bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20" onClick={onOrder}>
                Select & Order Now <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
