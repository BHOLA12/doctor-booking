"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Truck, ShieldCheck, CheckCircle2, Navigation } from "lucide-react";
import Image from "next/image";
import { PharmacyStore } from "@/lib/pharmacy-data";

type Props = {
  store: PharmacyStore;
};

export default function StoreCard({ store }: Props) {
  return (
    <Card className="group relative bg-white border-border/50 rounded-[2rem] overflow-hidden hover:shadow-xl transition-all duration-500">
      <CardContent className="p-0 flex flex-col md:flex-row">
        
        {/* Store Image */}
        <div className="relative w-full md:w-48 h-40 md:h-auto overflow-hidden bg-slate-100">
          <Image 
            src={store.image} 
            alt={store.name} 
            fill 
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          {store.isOpen ? (
            <div className="absolute top-4 left-4">
              <Badge className="bg-emerald-500 text-white border-none text-[10px] font-black uppercase">Open Now</Badge>
            </div>
          ) : (
            <div className="absolute top-4 left-4">
              <Badge variant="destructive" className="text-[10px] font-black uppercase">Closed</Badge>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors">{store.name}</h3>
                {store.isVerified && (
                  <ShieldCheck className="h-5 w-5 text-primary fill-primary/10" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{store.address}</span>
                <span className="text-slate-300">•</span>
                <span className="text-primary">{store.distance}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg border border-amber-100">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-sm font-black">{store.rating}</span>
                </div>
                <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{store.reviews} Reviews</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-slate-50">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Medicine Stock</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className={`h-4 w-4 ${store.medicineStock === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`} />
                <span className="text-sm font-black text-slate-700">{store.medicineStock}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Time</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-black text-slate-700">{store.deliveryTime}</span>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">GST Status</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[9px] font-black border-slate-200 text-slate-500 px-1.5 py-0">GST VERIFIED</Badge>
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Features</span>
              <div className="flex items-center gap-2">
                {store.isFreeDelivery && <Truck className="h-4 w-4 text-emerald-500" />}
                {store.isPickupAvailable && <Navigation className="h-4 w-4 text-blue-500" />}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button size="lg" className="rounded-2xl px-8 h-12 font-black shadow-lg shadow-primary/15">
              Order From This Store
            </Button>
            <Button variant="outline" size="lg" className="rounded-2xl px-6 h-12 font-bold border-border/60 hover:bg-slate-50">
              View Store
            </Button>
            <Button variant="ghost" size="lg" className="rounded-2xl px-6 h-12 font-bold text-slate-600 hover:text-primary">
              Compare Prices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
