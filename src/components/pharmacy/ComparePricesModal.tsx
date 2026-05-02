"use client";

import { X, Star, Clock, ShoppingCart, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { type Medicine } from "@/lib/medicines-data";

interface ComparePricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine | null;
}

const COMPARISON_DATA = [
  {
    store: "Apollo Pharmacy",
    price: 0.9, // 10% cheaper
    delivery: "15-20 mins",
    rating: 4.8,
    verified: true,
    stock: "High",
  },
  {
    store: "Wellness Forever",
    price: 1.0, // base price
    delivery: "12-15 mins",
    rating: 4.9,
    verified: true,
    stock: "Medium",
  },
  {
    store: "Local Medicos",
    price: 0.95, // 5% cheaper
    delivery: "30-45 mins",
    rating: 4.5,
    verified: true,
    stock: "Low",
  }
];

export default function ComparePricesModal({ isOpen, onClose, medicine }: ComparePricesModalProps) {
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden">
                  <img src={medicine.image} alt={medicine.name} className="h-12 w-12 object-contain" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{medicine.name}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{medicine.manufacturer} • {medicine.dosage}</p>
                </div>
              </div>
              <button onClick={onClose} className="h-12 w-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 hover:bg-slate-50 transition-colors">
                <X className="h-6 w-6 text-slate-400" />
              </button>
            </div>

            {/* Comparison List */}
            <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
               <div className="flex items-center justify-between mb-2">
                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Compare Stores Near You</p>
                 <Badge variant="outline" className="text-[10px] font-black border-slate-200">3 STORES FOUND</Badge>
               </div>

               {COMPARISON_DATA.map((item, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary/30 hover:bg-slate-50 transition-all flex items-center justify-between"
                 >
                    <div className="flex items-center gap-5">
                       <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${i === 1 ? "bg-primary text-white" : "bg-slate-100 text-slate-400"}`}>
                          <ShoppingCart className="h-6 w-6" />
                       </div>
                       <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <h4 className="font-black text-slate-900">{item.store}</h4>
                             {item.verified && <ShieldCheck className="h-4 w-4 text-emerald-500" />}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                             <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-500 text-amber-500" /> {item.rating}</span>
                             <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" /> {item.delivery}</span>
                             <span className={item.stock === "Low" ? "text-amber-500" : "text-emerald-500"}>{item.stock} Stock</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Price</p>
                          <p className="text-xl font-black text-slate-900">₹{Math.round(medicine.price * item.price)}</p>
                       </div>
                       <Button className="h-12 rounded-xl px-5 font-black gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          Order <ArrowRight className="h-4 w-4" />
                       </Button>
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                 <MapPin className="h-4 w-4" />
                 Delivering to: <span className="text-slate-900">Sector 18, Noida</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Prices may vary by location</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
