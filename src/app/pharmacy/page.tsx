"use client";

import { useState } from "react";
import TrustBar from "@/components/layout/TrustBar";
import PharmacyNavbar from "@/components/layout/PharmacyNavbar";
import PharmacyHero from "@/components/pharmacy/PharmacyHero";
import PharmacyMedicineCard from "@/components/pharmacy/PharmacyMedicineCard";
import StoreCard from "@/components/pharmacy/StoreCard";
import Footer from "@/components/layout/Footer";
import { MEDICINES } from "@/lib/medicines-data";
import { PHARMACY_STORES, PHARMACY_CATEGORIES } from "@/lib/pharmacy-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronRight, 
  Map as MapIcon, 
  Filter, 
  Clock, 
  ShieldCheck, 
  Star,
  ArrowUpRight,
  Plus,
  MapPin
} from "lucide-react";
import Link from "next/link";

export default function PharmacyPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <TrustBar />
      <PharmacyNavbar />
      
      <main className="flex-1">
        <PharmacyHero />

        {/* Category Filter Pills */}
        <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-1">
              {PHARMACY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                      : "bg-white border-border/50 hover:border-primary/30 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Nearby Stores Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-12 bg-primary rounded-full" />
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Hyperlocal</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Buy From Nearby Medical Stores</h2>
              <p className="text-slate-500 font-medium max-w-xl">
                Get your medicines delivered from the most trusted pharmacies in your neighborhood in 30-60 mins.
              </p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="outline" className="rounded-2xl h-12 px-6 font-bold gap-2 border-border/60">
                 <MapIcon className="h-4 w-4 text-primary" />
                 View on Map
               </Button>
               <Button className="rounded-2xl h-12 px-6 font-bold gap-2 shadow-lg shadow-primary/10">
                 View All Stores <ChevronRight className="h-4 w-4" />
               </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {PHARMACY_STORES.slice(0, 3).map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
           <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/20 skew-x-12 translate-x-24 group-hover:translate-x-12 transition-transform duration-1000" />
              <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <Badge className="bg-primary text-white border-none font-black px-3 py-1">SPECIAL OFFER</Badge>
                  <h3 className="text-3xl md:text-5xl font-black text-white leading-tight">
                    Flat 25% OFF on <br />
                    First Medicine Order
                  </h3>
                  <p className="text-slate-400 font-medium text-lg">
                    Use Code: <span className="text-white font-bold tracking-widest border-b-2 border-primary pb-1">HEALTH25</span>
                  </p>
                  <Button size="lg" className="rounded-2xl h-14 px-10 font-black text-base shadow-2xl shadow-primary/40">
                    Claim Discount Now
                  </Button>
                </div>
                <div className="hidden md:flex justify-center">
                   <div className="relative">
                      <div className="absolute inset-0 bg-primary blur-3xl opacity-20 animate-pulse" />
                      <div className="text-[120px] drop-shadow-2xl grayscale group-hover:grayscale-0 transition-all duration-700">📦</div>
                   </div>
                </div>
              </div>
           </div>
        </section>

        {/* Map & Location Features */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Find Near You</h2>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Detect your location to see pharmacies delivering in your area. Live tracking available for all orders.
                </p>
                <Button className="w-full h-14 rounded-2xl font-black gap-3 shadow-xl shadow-primary/20">
                  <MapIcon className="h-5 w-5" />
                  Detect My Location
                </Button>
              </div>
              
              <div className="p-8 rounded-[2.5rem] bg-teal-900 text-white space-y-6 relative overflow-hidden">
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
                <h4 className="text-xl font-black">Live Delivery Tracking</h4>
                <p className="text-teal-100/70 text-sm font-medium">
                  Know exactly where your medicines are with real-time GPS tracking.
                </p>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
                   <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                   </div>
                   <div className="flex-1">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-primary animate-pulse" />
                      </div>
                      <p className="text-[10px] font-bold text-teal-300 mt-2 uppercase tracking-widest">Arriving in 12 mins</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
               <div className="h-full min-h-[400px] w-full rounded-[3rem] bg-slate-100 border-2 border-white shadow-inner relative overflow-hidden group">
                  {/* Mock Map Image/Pattern */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e2e8f0_1px,_transparent_1px)] [background-size:24px_24px] opacity-50" />
                  <div className="absolute top-1/2 left-1/3 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="h-12 w-12 bg-primary rounded-full flex items-center justify-center text-white shadow-xl animate-bounce">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="mt-2 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-slate-100 text-[10px] font-black uppercase">Your Location</div>
                  </div>
                  
                  {/* Store Markers */}
                  {[
                    { top: '30%', left: '60%', name: 'Apollo' },
                    { top: '70%', left: '40%', name: 'Wellness' },
                    { top: '20%', left: '80%', name: 'Local Hall' },
                  ].map((marker, i) => (
                    <div key={i} className="absolute flex flex-col items-center" style={{ top: marker.top, left: marker.left }}>
                      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-primary shadow-lg border-2 border-primary/20 hover:scale-110 transition-transform cursor-pointer">
                        <MapIcon className="h-4 w-4" />
                      </div>
                    </div>
                  ))}

                  <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-white/40 shadow-xl flex items-center justify-between">
                     <p className="text-sm font-black text-slate-900">32 Pharmacies found nearby</p>
                     <Button size="sm" variant="ghost" className="text-primary font-bold">List View</Button>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-white rounded-[4rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-12">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Trending Medicines</h2>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">Top rated by 50k+ customers</p>
            </div>
            <div className="flex items-center gap-3">
               <Button variant="ghost" className="rounded-xl font-bold text-slate-600 gap-2 hover:bg-slate-100">
                 <Filter className="h-4 w-4" />
                 Filters
               </Button>
               <div className="h-6 w-[1px] bg-slate-200" />
               <Link href="/medicines" className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
                 View All <ArrowUpRight className="h-4 w-4" />
               </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {MEDICINES.slice(0, 10).map((medicine) => (
              <PharmacyMedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Button size="lg" variant="outline" className="rounded-2xl h-14 px-12 font-black text-slate-700 border-2 border-slate-100 hover:bg-slate-50 hover:border-primary/20 group">
              Explore More Categories <Plus className="h-5 w-5 ml-2 text-primary group-hover:rotate-90 transition-transform" />
            </Button>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { 
                 icon: ShieldCheck, 
                 title: "Licensed Sellers", 
                 desc: "All our partner pharmacies are licensed and strictly follow government regulations.",
                 color: "bg-blue-50 text-blue-600"
               },
               { 
                 icon: Star, 
                 title: "Verified Quality", 
                 desc: "Every medicine is checked for authenticity and expiry date before dispatch.",
                 color: "bg-amber-50 text-amber-600"
               },
               { 
                 icon: Clock, 
                 title: "Real-time Tracking", 
                 desc: "Track your order live on the map from the pharmacy to your doorstep.",
                 color: "bg-teal-50 text-teal-600"
               }
             ].map((item, i) => (
               <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${item.color}`}>
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
               </div>
             ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
