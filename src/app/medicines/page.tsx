"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrustBar from "@/components/layout/TrustBar";
import PharmacyMedicineCard from "@/components/pharmacy/PharmacyMedicineCard";
import StoreCard from "@/components/pharmacy/StoreCard";
import CartDrawer from "@/components/shared/CartDrawer";
import MedicineFilters from "@/components/pharmacy/MedicineFilters";
import ComparePricesModal from "@/components/pharmacy/ComparePricesModal";
import { useCart } from "@/context/CartContext";
import { MEDICINES, MEDICINE_CATEGORIES, type Medicine } from "@/lib/medicines-data";
import { PHARMACY_STORES, PHARMACY_CATEGORIES } from "@/lib/pharmacy-data";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  Search, 
  ShoppingCart, 
  Pill, 
  ChevronRight, 
  Filter, 
  ArrowUpRight, 
  Map as MapIcon, 
  Plus,
  ShieldCheck,
  Star,
  Clock,
  XCircle,
  Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Build Fuse index once
const fuseIndex = new Fuse<Medicine>(MEDICINES, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "salt", weight: 0.3 },
    { name: "category", weight: 0.1 },
    { name: "manufacturer", weight: 0.1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

export default function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [findingPharmacy, setFindingPharmacy] = useState(false);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 500]);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const { cartCount } = useCart();

  const debouncedSearch = useDebounce(search, 300);
  const [filtered, setFiltered] = useState<Medicine[]>(MEDICINES);

  useEffect(() => {
    let results: Medicine[] = MEDICINES;
    
    // Search filter
    if (debouncedSearch.trim()) {
      results = fuseIndex.search(debouncedSearch).map((r) => r.item);
    }
    
    // Category filter
    if (activeCategory !== "All") {
      results = results.filter((m) => m.category === activeCategory);
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      results = results.filter((m) => selectedBrands.includes(m.manufacturer));
    }

    // Price filter
    results = results.filter((m) => m.price >= priceRange[0] && m.price <= priceRange[1]);

    // Discount filter
    if (discountOnly) {
      results = results.filter((m) => m.discount >= 10);
    }

    setFiltered(results);
  }, [debouncedSearch, activeCategory, selectedBrands, priceRange, discountOnly]);

  const handleCompare = useCallback((medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowComparison(true);
  }, []);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <TrustBar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-[#F1FAF9] py-12 lg:py-24">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#10b981_0.5px,_transparent_0.5px)] [background-size:32px_32px] opacity-[0.03]" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <Badge variant="secondary" className="bg-white/80 text-teal-700 border-teal-100 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                    <LinkIcon className="h-3 w-3 mr-2" />
                    Online Pharmacy
                  </Badge>
                  <h1 className="text-6xl lg:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                    Your Health, <br />
                    <span className="text-primary italic font-serif">Delivered</span> Fast.
                  </h1>
                  <p className="text-lg text-slate-500 font-bold max-w-lg leading-relaxed">
                    Search from thousands of medicines. Get them delivered from your favorite local pharmacies in under an hour.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="relative group max-w-xl">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search by medicine name or salt..." 
                    className="w-full h-16 pl-16 pr-6 rounded-[2rem] bg-white border-transparent shadow-2xl shadow-slate-200/50 focus:border-primary/30 transition-all text-lg font-bold placeholder:text-slate-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-8 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 shadow-inner">
                      <ShieldCheck className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">100% Genuine</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Products</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 shadow-inner">
                      <ShoppingCart className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Fast Delivery</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Within 60 mins</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                  <Button 
                    className="h-14 rounded-2xl bg-primary/20 text-primary font-black hover:bg-primary/30 px-10 text-sm tracking-widest uppercase shrink-0"
                    onClick={() => setFindingPharmacy(true)}
                  >
                    Simulate Smart Order
                  </Button>
                </div>
              </div>

              {/* Right Side: 3D Image & Floating Card */}
              <div className="relative h-[500px] flex items-center justify-center lg:justify-end">
                 {/* 3D Illustration */}
                 <div className="absolute right-0 bottom-0 w-full max-w-[600px] h-full pointer-events-none select-none flex justify-end">
                    <div className="relative h-full aspect-square">
                      <Image 
                        src="/pharmacy-hero.png" 
                        alt="3D Medicines" 
                        fill 
                        className="object-contain object-right-bottom drop-shadow-[0_35px_35px_rgba(0,0,0,0.1)]"
                        priority
                      />
                      
                      {/* DocBook Text Overlay on Bag */}
                      <div className="absolute z-10 flex flex-col items-center justify-center transform -rotate-1 pointer-events-none w-[20%] left-[32%] bottom-[35%]">
                        <div className="bg-[#f2f4f3] w-full pt-1 pb-1 flex flex-col items-center shadow-[inset_0_0_10px_rgba(255,255,255,0.8)]">
                           <span className="text-[#059669] font-black text-xs sm:text-lg tracking-tight leading-none mb-0.5" style={{ textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}>DocBook</span>
                           <span className="text-[#059669] font-bold text-[4px] sm:text-[5px] tracking-[0.2em] uppercase opacity-80">Medicine & Care</span>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Floating Prescription Card */}
                 <motion.div 
                   initial={{ x: 20, opacity: 0 }}
                   animate={{ x: 0, opacity: 1 }}
                   className="absolute bottom-10 left-0 lg:-left-12 z-10 bg-white/40 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 flex items-center gap-6 max-w-sm hover:bg-white/50 transition-colors"
                 >
                     <div className="text-3xl bg-orange-50/80 h-14 w-14 flex items-center justify-center rounded-2xl shadow-inner shrink-0 backdrop-blur-sm">📦</div>
                     <div className="space-y-3">
                        <Badge variant="secondary" className="bg-teal-50/80 backdrop-blur-md text-teal-700 border-teal-100/50 px-3 py-0.5 text-[9px] font-black uppercase tracking-widest">
                           Prescription Order
                        </Badge>
                        <p className="text-slate-700 font-extrabold text-xs leading-tight drop-shadow-sm">
                           Upload your prescription and we'll find stores for you.
                        </p>
                        <Button 
                          size="sm"
                          className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 bg-primary/90 hover:bg-primary"
                          onClick={() => setPrescriptionOpen(true)}
                        >
                          Upload Now
                        </Button>
                     </div>
                 </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Pills */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-border/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
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
                <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">Hyperlocal Marketplace</span>
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Buy From Nearby Medical Stores</h2>
              <p className="text-slate-500 font-medium max-w-xl">
                Order directly from trusted local pharmacies in your neighborhood.
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

        {/* Main Content Area with Sidebar */}
        <section className="mx-auto max-w-[1600px] px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 shrink-0">
               <div className="sticky top-24">
                  <MedicineFilters 
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                    selectedBrands={selectedBrands}
                    onBrandChange={toggleBrand}
                    priceRange={priceRange}
                    onPriceChange={setPriceRange}
                    discountOnly={discountOnly}
                    onDiscountChange={setDiscountOnly}
                  />
               </div>
            </aside>

            {/* Results section */}
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Available Medicines</h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    Showing <span className="text-primary">{filtered.length}</span> products
                  </p>
                </div>
                <div className="flex items-center gap-3">
                   <Button 
                     variant="outline" 
                     className="rounded-xl font-bold gap-2 relative border-border/60"
                     onClick={() => setCartOpen(true)}
                   >
                     <ShoppingCart className="h-4 w-4" />
                     Cart
                     {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold">
                          {cartCount}
                        </Badge>
                     )}
                   </Button>
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {filtered.map((medicine) => (
                    <PharmacyMedicineCard 
                      key={medicine.id} 
                      medicine={medicine} 
                      onCompare={handleCompare}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="text-5xl mb-4">🔍</div>
                  <p className="font-black text-xl text-slate-900">No medicines found</p>
                  <p className="text-slate-500 font-medium mt-1">Try searching for something else or clear filters.</p>
                  <Button variant="outline" className="mt-6 rounded-xl" onClick={() => { setSearch(""); setActiveCategory("All"); setSelectedBrands([]); setPriceRange([10, 500]); setDiscountOnly(false); }}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-3 gap-8">
             {[
               { 
                 icon: ShieldCheck, 
                 title: "Licensed Sellers", 
                 desc: "All partner pharmacies are licensed and strictly follow government regulations.",
                 color: "bg-blue-50 text-blue-600"
               },
               { 
                 icon: Star, 
                 title: "Verified Quality", 
                 desc: "Every medicine is checked for authenticity before dispatch.",
                 color: "bg-amber-50 text-amber-600"
               },
               { 
                 icon: Clock, 
                 title: "Instant Delivery", 
                 desc: "Get your medicines in 30-60 minutes with our hyperlocal delivery network.",
                 color: "bg-teal-50 text-teal-600"
               }
             ].map((item, i) => (
               <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
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

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      
      <ComparePricesModal 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
        medicine={selectedMedicine} 
      />

      {/* Prescription Upload Simulation Modal */}
      <AnimatePresence>
        {prescriptionOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl space-y-8 relative overflow-hidden"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <Pill className="h-6 w-6" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Prescription Upload</h3>
                  </div>
                  <button onClick={() => { setPrescriptionOpen(false); setScanning(false); }} className="text-slate-400 hover:text-slate-900">
                    <XCircle className="h-6 w-6" />
                  </button>
               </div>

               {!scanning ? (
                 <div className="space-y-6">
                    <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center space-y-4 hover:border-primary/40 transition-colors cursor-pointer group">
                       <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                          <Plus className="h-10 w-10" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-900">Select Image or PDF</p>
                          <p className="text-sm font-bold text-slate-400">Drag and drop your prescription here</p>
                       </div>
                    </div>
                    <Button 
                      className="w-full h-14 rounded-2xl font-black text-lg"
                      onClick={() => setScanning(true)}
                    >
                      Process Prescription
                    </Button>
                 </div>
               ) : (
                 <div className="space-y-8 py-10">
                    <div className="relative h-64 w-full bg-slate-50 rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                       <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent animate-scan z-10" />
                       <div className="text-8xl opacity-20 grayscale">📄</div>
                       
                       {/* Detected Elements Mock */}
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 1 }}
                         className="absolute top-10 left-10 p-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase shadow-lg"
                       >
                         Dolo 650 Detected
                       </motion.div>
                       <motion.div 
                         initial={{ opacity: 0 }}
                         animate={{ opacity: 1 }}
                         transition={{ delay: 2 }}
                         className="absolute bottom-12 right-8 p-2 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase shadow-lg"
                       >
                         Crocin Detected
                       </motion.div>
                    </div>

                    <div className="text-center space-y-2">
                       <h4 className="text-xl font-black text-slate-900">AI Scanning...</h4>
                       <p className="text-slate-500 font-medium">Extracting medicines and searching nearby stores</p>
                    </div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                    >
                       <Button 
                         className="w-full h-14 rounded-2xl font-black text-lg gap-2"
                         onClick={() => { setPrescriptionOpen(false); setScanning(false); }}
                       >
                         Show Results <ArrowUpRight className="h-5 w-5" />
                       </Button>
                    </motion.div>
                 </div>
               )}

               <div className="bg-slate-50 p-6 rounded-2xl flex items-center gap-4 border border-slate-100">
                  <ShieldCheck className="h-6 w-6 text-emerald-600" />
                  <p className="text-xs font-bold text-slate-500 leading-relaxed">
                    Your prescription is handled securely and only shared with verified pharmacists for fulfillment.
                  </p>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Routing Simulation Modal */}
      <AnimatePresence>
        {findingPharmacy && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl text-center space-y-8 relative overflow-hidden"
            >
               <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/3 bg-primary"
                  />
               </div>

               <div className="space-y-4">
                  <div className="h-20 w-20 bg-teal-50 rounded-3xl flex items-center justify-center mx-auto text-primary animate-pulse">
                     <MapIcon className="h-10 w-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Finding Nearest Pharmacy</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Our smart routing system is contacting the closest verified medical stores in your area...
                  </p>
               </div>

               <div className="space-y-4">
                  {[
                    "Checking inventory at Apollo Pharmacy...",
                    "Routing request to Wellness Forever...",
                    "Awaiting response from local stores...",
                  ].map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 1.5 }}
                      className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 p-4 rounded-2xl"
                    >
                       <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                       {text}
                    </motion.div>
                  ))}
               </div>

               <div className="pt-4">
                 <Link href="/orders/123/track">
                    <Button 
                      className="w-full h-14 rounded-2xl font-black text-base shadow-xl shadow-primary/20"
                      onClick={() => setFindingPharmacy(false)}
                    >
                      View Live Status
                    </Button>
                 </Link>
                 <Button 
                   variant="ghost" 
                   className="w-full mt-4 text-slate-400 font-bold"
                   onClick={() => setFindingPharmacy(false)}
                 >
                   Cancel Request
                 </Button>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
