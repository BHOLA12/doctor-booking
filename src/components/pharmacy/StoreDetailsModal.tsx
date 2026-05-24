"use client";

import { X, MapPin, Star, Clock, Truck, Navigation, ShieldCheck, CheckCircle2, Phone, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { PharmacyStore } from "@/lib/pharmacy-data";
import Image from "next/image";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  store: PharmacyStore;
  onOrder: () => void;
}

export default function StoreDetailsModal({ isOpen, onClose, store, onOrder }: Props) {
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
            className="relative bg-white w-full max-w-lg mx-auto rounded-[2.5rem] shadow-2xl overflow-hidden z-10"
          >
            {/* Header banner image */}
            <div className="relative h-44 w-full bg-slate-100">
              <Image
                src={store.image}
                alt={store.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              
              <button
                onClick={onClose}
                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-colors border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black">{store.name}</h3>
                  {store.isVerified && (
                    <ShieldCheck className="h-5 w-5 text-teal-400 fill-teal-400/20" />
                  )}
                </div>
                <p className="text-xs text-white/80 font-medium flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-teal-400" />
                  {store.address} • {store.distance}
                </p>
              </div>
            </div>

            {/* Content body */}
            <div className="p-6 md:p-8 space-y-6">
              {/* Top Details & Rating Row */}
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl border border-amber-100/60 shadow-sm">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-extrabold">{store.rating}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">{store.reviews} Reviews</span>
                </div>
                <Badge className={store.isOpen ? "bg-emerald-500 text-white border-none shadow-md shadow-emerald-500/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider" : "bg-red-500 text-white border-none shadow-md shadow-red-500/10 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"}>
                  {store.isOpen ? "Open Now" : "Closed"}
                </Badge>
              </div>

              {/* Delivery Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Time</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="h-4 w-4 text-teal-600" />
                    <span className="text-sm font-extrabold text-slate-800">{store.deliveryTime}</span>
                  </div>
                </div>
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/60 flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medicine Stock</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <CheckCircle2 className={`h-4 w-4 ${store.medicineStock === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`} />
                    <span className="text-sm font-extrabold text-slate-800">{store.medicineStock}</span>
                  </div>
                </div>
              </div>

              {/* Compliance & Verification Info */}
              <div className="space-y-3 bg-teal-50/30 p-5 rounded-3xl border border-teal-100/50">
                <h4 className="text-xs font-black text-teal-800 uppercase tracking-wider">License & Verification</h4>
                <div className="grid grid-cols-2 gap-y-2 text-xs font-bold text-slate-600 pt-1">
                  <div>GST Status:</div>
                  <div className="text-teal-700 font-extrabold uppercase">GST VERIFIED</div>
                  <div>DL No (Form 20):</div>
                  <div className="font-mono text-slate-800">DL-20-84725/2026</div>
                  <div>DL No (Form 21):</div>
                  <div className="font-mono text-slate-800">DL-21-84726/2026</div>
                  <div>Regd. Pharmacist:</div>
                  <div className="text-slate-800 font-extrabold">PHARM-8472-A</div>
                </div>
              </div>

              {/* Features and Timings */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Calendar className="h-4 w-4 text-teal-600" />
                    <span>Business Hours</span>
                  </div>
                  <span className="font-extrabold text-slate-800">8:00 AM - 11:00 PM</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold">
                    <Phone className="h-4 w-4 text-teal-600" />
                    <span>Contact Number</span>
                  </div>
                  <span className="font-extrabold text-slate-800">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                  {store.isFreeDelivery && (
                    <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100/50">
                      <Truck className="h-3.5 w-3.5" /> Free Delivery
                    </span>
                  )}
                  {store.isPickupAvailable && (
                    <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-[11px] font-bold border border-blue-100/50">
                      <Navigation className="h-3.5 w-3.5" /> Pickup Available
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold border-slate-200/80 hover:bg-slate-50 transition-all" onClick={onClose}>
                  Back
                </Button>
                <Button className="flex-[2] rounded-2xl h-12 font-black bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20 transition-all duration-200 active:scale-[0.98]" onClick={onOrder}>
                  Order From This Store
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
