"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Truck, ShieldCheck, CheckCircle2, Navigation } from "lucide-react";
import Image from "next/image";
import { PharmacyStore } from "@/lib/pharmacy-data";
import StoreDetailsModal from "./StoreDetailsModal";
import StoreCompareModal from "./StoreCompareModal";

type Props = {
  store: PharmacyStore;
};

export default function StoreCard({ store }: Props) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  const handleOrder = () => {
    router.push(`/medicines?store=${store.id}`);
  };

  return (
    <>
      <Card className="group relative bg-white border border-slate-100 rounded-[2.25rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:border-teal-500/25 transition-all duration-500">
        <CardContent className="p-0 flex flex-col md:flex-row">
          
          {/* Store Image */}
          <div className="relative w-full md:w-52 h-44 md:h-auto overflow-hidden bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100/80">
            <Image 
              src={store.image} 
              alt={store.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {store.isOpen ? (
              <div className="absolute top-4 left-4">
                <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md shadow-emerald-500/20">Open Now</Badge>
              </div>
            ) : (
              <div className="absolute top-4 left-4">
                <Badge variant="destructive" className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md shadow-red-500/20">Closed</Badge>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-extrabold text-slate-800 group-hover:text-teal-600 transition-colors truncate">{store.name}</h3>
                  {store.isVerified && (
                    <Badge className="bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100/50 p-1 rounded-full shadow-sm shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold text-slate-400 min-w-0">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-teal-600 shrink-0" />
                  <span className="truncate flex-1 min-w-0">{store.address}</span>
                  <span className="text-slate-200 shrink-0">•</span>
                  <span className="text-teal-600 font-extrabold shrink-0">{store.distance}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex flex-col items-start md:items-end">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-xl border border-amber-100/80 shadow-sm shadow-amber-500/[0.02]">
                    <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                    <span className="text-sm font-extrabold">{store.rating}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider pl-1 md:pl-0">{store.reviews} Reviews</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-6 py-3.5 sm:py-5 border-y border-slate-100/80">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Medicine Stock</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className={`h-4 w-4 ${store.medicineStock === 'Available' ? 'text-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'text-amber-500'}`} />
                  <span className="text-sm font-extrabold text-slate-700">{store.medicineStock}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Delivery Time</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-teal-600" />
                  <span className="text-sm font-extrabold text-slate-700">{store.deliveryTime}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">GST Status</span>
                <div className="flex items-center gap-1.5">
                  <Badge variant="outline" className="text-[9px] font-extrabold border-slate-200/80 text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md">GST VERIFIED</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Features</span>
                <div className="flex items-center gap-2.5 pt-0.5">
                  {store.isFreeDelivery && (
                    <span title="Free Delivery" className="p-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100/50 shadow-sm"><Truck className="h-4 w-4" /></span>
                  )}
                  {store.isPickupAvailable && (
                    <span title="Pickup Available" className="p-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-100/50 shadow-sm"><Navigation className="h-4 w-4" /></span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-1.5 sm:pt-2 w-full">
              <Button 
                size="lg" 
                className="w-full sm:w-auto rounded-2xl px-8 h-12 font-extrabold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
                onClick={handleOrder}
              >
                Order From This Store
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto rounded-2xl px-6 h-12 font-bold border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]" 
                onClick={() => setShowDetails(true)}
              >
                View Store
              </Button>
              <Button 
                variant="ghost" 
                size="lg" 
                className="w-full sm:w-auto rounded-2xl px-6 h-12 font-bold text-slate-500 hover:text-teal-600 hover:bg-teal-50/50 transition-all duration-300" 
                onClick={() => setShowCompare(true)}
              >
                Compare Prices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <StoreDetailsModal 
        isOpen={showDetails} 
        onClose={() => setShowDetails(false)} 
        store={store} 
        onOrder={handleOrder}
      />

      <StoreCompareModal 
        isOpen={showCompare} 
        onClose={() => setShowCompare(false)} 
        store={store} 
        onOrder={handleOrder}
      />
    </>
  );
}
