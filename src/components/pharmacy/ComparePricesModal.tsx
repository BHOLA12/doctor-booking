"use client";

import { useState, useEffect } from "react";
import { X, Star, Clock, ShoppingCart, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { type Medicine } from "@/lib/medicines-data";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

interface ComparePricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

export default function ComparePricesModal({ isOpen, onClose, medicine }: ComparePricesModalProps) {
  const { addItem } = useCart();
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    async function loadComparison() {
      try {
        const res = await fetch("/api/pharmacies");
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            const coefficients: Record<string, number> = {
              s1: 1.0,
              s2: 0.94,
              s3: 1.05,
              s4: 0.88,
            };
            const defaultStocks = ["High", "Medium", "Low"];

            const dbComparison = result.data.map((pharmacy: any, index: number) => {
              const coef = coefficients[pharmacy.id] || 0.95;
              return {
                store: pharmacy.storeName,
                price: coef,
                delivery: "20-30 mins",
                rating: pharmacy.rating || 4.5,
                verified: true,
                stock: defaultStocks[index % defaultStocks.length],
              };
            });

            if (dbComparison.length > 0) {
              setComparisonData(dbComparison);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error loading comparison data from database:", err);
      }

      const baseComparison = [
        {
          store: "Ajay Medical Hall",
          price: 0.94,
          delivery: "25-30 mins (1-2 km)",
          rating: 4.6,
          verified: true,
          stock: "High",
        },
        {
          store: "Hindustan Medical Hall",
          price: 1.0,
          delivery: "25-30 mins (1-2 km)",
          rating: 4.8,
          verified: true,
          stock: "Medium",
        },
        {
          store: "Gudvil Medical Hall",
          price: 1.05,
          delivery: "35-45 mins",
          rating: 4.5,
          verified: true,
          stock: "Low",
        }
      ];
      setComparisonData(baseComparison);
    }

    loadComparison();
  }, [isOpen]);

  if (!medicine) return null;

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
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-white w-full max-w-2xl mx-auto rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50/50 p-4 sm:p-8 border-b border-slate-100/80 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0 flex-1">
                <div className="h-11 w-11 md:h-16 md:w-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0">
                  {medicine.image ? (
                    <img src={medicine.image || ""} alt={medicine.name} className="h-9 w-9 md:h-12 md:w-12 object-contain" />
                  ) : (
                    <span className="text-2xl sm:text-3xl select-none">{medicine.imageEmoji}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg md:text-2xl font-black text-slate-900 leading-tight truncate">{medicine.name}</h3>
                  <p className="text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">{medicine.manufacturer} • {medicine.dosage}</p>
                </div>
              </div>
              <button onClick={onClose} className="h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-white border border-slate-200/60 hover:bg-slate-50 transition-colors shrink-0">
                <X className="h-5 w-5 md:h-6 md:w-6 text-slate-400" />
              </button>
            </div>

            {/* Comparison List */}
            <div className="p-4 sm:p-8 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
               <div className="flex items-center justify-between mb-2 px-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compare Stores Near You</p>
                 <Badge variant="outline" className="text-[9px] md:text-[10px] font-extrabold border-slate-200/80 bg-slate-50">3 STORES FOUND</Badge>
               </div>

               {comparisonData.map((item, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-2.5 sm:p-4 md:p-6 rounded-[1.25rem] sm:rounded-[1.5rem] md:rounded-[2rem] bg-white border border-slate-100 hover:border-teal-500/20 hover:bg-slate-50/30 transition-all duration-300 flex items-center justify-between gap-2.5 sm:gap-4"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 md:gap-5 min-w-0 flex-1">
                       <div className={`h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${
                         i === 1 
                           ? "bg-teal-600 text-white shadow-md shadow-teal-600/20" 
                           : "bg-slate-50 text-slate-400 border border-slate-100"
                       }`}>
                          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                       </div>
                       <div className="space-y-0.5 md:space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                             <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm md:text-base truncate">{item.store}</h4>
                             {item.verified && <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 fill-teal-50/50 shrink-0" />}
                          </div>
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3 text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                             <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-amber-500 text-amber-500" /> {item.rating}</span>
                             <span className="flex items-center gap-0.5"><Clock className="h-2.5 w-2.5 md:h-3 md:w-3 text-teal-600" /> {item.delivery}</span>
                             <span className={item.stock === "Low" ? "text-amber-500" : "text-emerald-600"}>{item.stock} Stock</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
                       <div className="text-right pr-0.5 sm:pr-2">
                          <p className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                          <p className="text-xs sm:text-base md:text-xl font-extrabold text-slate-900">₹{Math.round(medicine.price * item.price)}</p>
                       </div>
                       <Button 
                         className="h-8 sm:h-9 md:h-12 rounded-xl px-2.5 sm:px-4 md:px-5 font-black bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-600/10 hover:shadow-teal-500/20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-[9px] sm:text-xs md:text-sm active:scale-[0.98]"
                         onClick={(e) => {
                           e.stopPropagation();
                           addItem(medicine);
                           toast.success(`Added ${medicine.name} from ${item.store} to cart!`);
                           onClose();
                         }}
                       >
                          Order <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 ml-1" />
                       </Button>
                    </div>
                  </motion.div>
               ))}
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-8 bg-slate-50 border-t border-slate-100/80 flex flex-col sm:flex-row items-center justify-between gap-4">
               <div className="flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-extrabold uppercase tracking-wide">
                 <MapPin className="h-4 w-4 text-teal-600" />
                 Delivering to: <span className="text-slate-800">Jehanabad, Bihar</span>
               </div>
               <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center sm:text-right">Prices may vary by location</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
