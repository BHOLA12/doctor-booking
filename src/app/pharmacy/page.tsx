"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TrustBar from "@/components/layout/TrustBar";
import PharmacyNavbar from "@/components/layout/PharmacyNavbar";
import PharmacyHero from "@/components/pharmacy/PharmacyHero";
import PharmacyMedicineCard from "@/components/pharmacy/PharmacyMedicineCard";
import StoreCard from "@/components/pharmacy/StoreCard";
import Footer from "@/components/layout/Footer";
import { MEDICINES, type Medicine, enrichMedicineDetails } from "@/lib/medicines-data";
import { PHARMACY_STORES, PHARMACY_CATEGORIES, getCombinedStores } from "@/lib/pharmacy-data";
import ComparePricesModal from "@/components/pharmacy/ComparePricesModal";
import MedicineImage from "@/components/shared/MedicineImage";
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
  MapPin,
  ArrowRightLeft,
  Pill,
  AlertTriangle
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useCart } from "@/context/CartContext";

export default function PharmacyPage() {
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedDetailsMedicine, setSelectedDetailsMedicine] = useState<Medicine | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [stores, setStores] = useState(PHARMACY_STORES);

  useEffect(() => {
    async function loadStores() {
      try {
        const res = await fetch("/api/pharmacies");
        if (res.ok) {
          const result = await res.json();
          if (result.success && Array.isArray(result.data)) {
            const dbStores = result.data.map((pharmacy: any) => ({
              id: `db-store-${pharmacy.id}`,
              name: pharmacy.storeName,
              image: pharmacy.user?.avatar || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&h=200&auto=format&fit=crop",
              distance: "0.8 km",
              rating: pharmacy.rating || 4.5,
              reviews: pharmacy.totalReviews || 0,
              isOpen: true,
              isVerified: true,
              hasGST: !!pharmacy.gstin,
              medicineStock: "Available",
              deliveryTime: "20-30 mins",
              isFreeDelivery: true,
              isPickupAvailable: true,
              address: `${pharmacy.address}, ${pharmacy.pincode}, Jehanabad, Bihar`,
            }));

            if (dbStores.length > 0) {
              setStores(dbStores);
              return;
            }
          }
        }
      } catch (err) {
        console.error("Error loading pharmacies from database:", err);
      }
      setStores(PHARMACY_STORES);
    }

    loadStores();
  }, []);

  const handleCompare = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setShowComparison(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <TrustBar />
      <PharmacyNavbar />
      
      <main className="flex-1">
        <PharmacyHero 
          onUploadPrescription={() => router.push("/medicines?upload=true")}
          onSimulateOrder={() => router.push("/medicines?simulate=true")}
          searchValue={search}
          onSearchChange={setSearch}
          onSearch={(term) => router.push(`/medicines?q=${encodeURIComponent(term)}`)}
        />

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
            {stores.map((store) => (
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
              <PharmacyMedicineCard 
                key={medicine.id} 
                medicine={medicine} 
                onCompare={handleCompare} 
                onViewDetails={(med) => setSelectedDetailsMedicine(med)}
              />
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

      {selectedDetailsMedicine && (() => {
        const inCart = isInCart(selectedDetailsMedicine.id);
        const enrichedMed = enrichMedicineDetails(selectedDetailsMedicine);
        const fulfillmentStore = stores[0] || PHARMACY_STORES[0];
        const isFreeDelivery = fulfillmentStore.isFreeDelivery;
        const deliveryCharge = isFreeDelivery ? "FREE" : "₹25";

        return (
          <Dialog 
            open={!!selectedDetailsMedicine} 
            onOpenChange={(open) => {
              if (!open) setSelectedDetailsMedicine(null);
            }}
          >
            <DialogContent className="sm:max-w-2xl max-h-[92vh] overflow-y-auto p-0 rounded-[2rem] border-muted bg-card shadow-2xl flex flex-col gap-0">
              {/* Header Image/Emoji banner */}
              <div className="relative w-full h-52 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-slate-900 dark:to-teal-950/30 flex items-center justify-center border-b p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--border)_1px,_transparent_1px)] [background-size:20px_20px] opacity-35" />
                
                {/* RX / Discount badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {selectedDetailsMedicine.requiresPrescription ? (
                    <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 hover:bg-rose-100 border-rose-200/50 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Rx Required
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-100 border-slate-200/50 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      OTC Medicine
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/80 text-[10px] font-bold border-muted">
                    {selectedDetailsMedicine.category}
                  </Badge>
                </div>

                {/* Floating medicine image container */}
                <div className="relative h-28 w-28 bg-white dark:bg-slate-800 rounded-2xl border border-muted p-2 flex items-center justify-center shadow-md mt-4">
                  {selectedDetailsMedicine.image ? (
                    <MedicineImage 
                      src={selectedDetailsMedicine.image}
                      category={selectedDetailsMedicine.category}
                      alt={selectedDetailsMedicine.name}
                      className="h-24 w-24 object-contain"
                    />
                  ) : (
                    <span className="text-6xl drop-shadow-md select-none">{selectedDetailsMedicine.imageEmoji}</span>
                  )}
                </div>
              </div>

              {/* Scrollable Content Area */}
              <div className="p-6 sm:p-8 space-y-6">
                <DialogHeader className="space-y-2">
                  <span className="text-[10px] font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-widest block">
                    {selectedDetailsMedicine.manufacturer}
                  </span>
                  <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                    {selectedDetailsMedicine.name}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    Detailed composition, uses, side effects, substitutes, and safety warnings for {selectedDetailsMedicine.name}.
                  </DialogDescription>
                  <div className="p-4 rounded-2xl bg-muted/40 border border-muted/50 space-y-1">
                    <span className="text-[9px] text-muted-foreground font-extrabold uppercase tracking-wider block">Chemical Molecules (Salt)</span>
                    <span className="font-extrabold text-foreground text-sm leading-normal block">
                      🧪 {selectedDetailsMedicine.salt}
                    </span>
                  </div>
                </DialogHeader>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/40 border border-muted/50 text-sm">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Dosage Strength</span>
                    <span className="font-extrabold text-foreground mt-0.5 block">{selectedDetailsMedicine.dosage}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">Availability Status</span>
                    <span className="font-extrabold text-foreground mt-0.5 flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${selectedDetailsMedicine.availability === 'In Stock' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                      {selectedDetailsMedicine.availability}
                    </span>
                  </div>
                </div>

                {/* Primary Uses & Side Effects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Medical Uses */}
                  <div className="p-4 rounded-2xl bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 space-y-2 flex-1">
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      👍 Medical Uses
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {enrichedMed.medicalUses.map((use, i) => (
                        <li key={i} className="text-xs font-semibold text-muted-foreground flex items-start gap-1.5">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Side Effects */}
                  <div className="p-4 rounded-2xl bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/50 dark:border-rose-900/30 space-y-2 flex-1">
                    <span className="text-[10px] text-rose-700 dark:text-rose-400 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      ⚠️ Side Effects
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {enrichedMed.sideEffects.map((effect, i) => (
                        <li key={i} className="text-xs font-semibold text-muted-foreground flex items-start gap-1.5">
                          <span className="text-rose-500 mt-0.5">•</span>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Substitutes */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-muted-foreground block px-1">Equivalent Substitutes</span>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted/40 border border-muted/50 rounded-2xl">
                    {enrichedMed.substitutes.map((sub, i) => (
                      <span key={i} className="text-xs font-extrabold bg-card border border-muted text-muted-foreground hover:text-primary hover:border-primary/35 hover:shadow-sm px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 select-none">
                        <Pill className="h-3 w-3 text-emerald-500" />
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Safety Warnings */}
                <div className="space-y-2.5">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block px-1">Safety Warnings & Precautions</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {/* Alcohol */}
                    <div className="p-3.5 bg-muted/40 border border-muted/50 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase">Alcohol</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          enrichedMed.safetyWarnings.alcohol.toLowerCase().startsWith("unsafe")
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/50"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50"
                        }`}>
                          {enrichedMed.safetyWarnings.alcohol.toLowerCase().startsWith("unsafe") ? "Unsafe" : "Caution"}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed pt-1">{enrichedMed.safetyWarnings.alcohol}</p>
                    </div>

                    {/* Pregnancy */}
                    <div className="p-3.5 bg-muted/40 border border-muted/50 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase">Pregnancy</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          enrichedMed.safetyWarnings.pregnancy.toLowerCase().startsWith("unsafe")
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200/50"
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50"
                        }`}>
                          {enrichedMed.safetyWarnings.pregnancy.toLowerCase().startsWith("unsafe") ? "Unsafe" : "Safe/Caution"}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed pt-1">{enrichedMed.safetyWarnings.pregnancy}</p>
                    </div>

                    {/* Driving */}
                    <div className="p-3.5 bg-muted/40 border border-muted/50 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase">Driving</span>
                        <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/50 uppercase px-2 py-0.5 rounded">
                          Safe
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed pt-1">{enrichedMed.safetyWarnings.driving}</p>
                    </div>

                    {/* Kidney/Liver */}
                    <div className="p-3.5 bg-muted/40 border border-muted/50 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-muted-foreground font-extrabold uppercase">Kidney & Liver</span>
                        <span className="text-[9px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200/50 uppercase px-2 py-0.5 rounded">
                          Caution
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-muted-foreground leading-relaxed pt-1">{enrichedMed.safetyWarnings.kidneyLiver}</p>
                    </div>
                  </div>
                </div>

                {/* Hyperlocal Store Routing Details */}
                <div className="space-y-2.5">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-muted-foreground block px-1">Fulfillment Router Details</span>
                  <div className="border border-muted/50 rounded-[1.75rem] p-4.5 space-y-3.5 bg-muted/30">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-muted/50 pb-3">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Fulfillment Store</span>
                        <span className="font-extrabold text-foreground text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
                          🏪 {fulfillmentStore.name}
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Delivery Duration</span>
                        <span className="font-black text-teal-600 dark:text-teal-400 text-xs sm:text-sm mt-0.5 flex items-center sm:justify-end gap-1.5">
                          ⏱️ {fulfillmentStore.deliveryTime}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold text-muted-foreground">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Sourcing Distance</span>
                        <span className="font-extrabold text-foreground mt-0.5 block">📍 {fulfillmentStore.distance} away</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Delivery Charge</span>
                        <span className="font-extrabold text-foreground mt-0.5 block">{deliveryCharge}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase block">Status</span>
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">✓ Verified Partner</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescription Warning */}
                {selectedDetailsMedicine.requiresPrescription && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-400 leading-relaxed font-semibold flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    <span><strong>Prescription Required:</strong> You will need to upload a valid prescription from a registered medical practitioner to purchase this medicine.</span>
                  </div>
                )}

                {/* Pricing & CTA Section */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-muted/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-semibold">Best Price</span>
                    <div className="flex items-baseline gap-2.5 mt-1">
                      <span className="text-3xl font-black text-foreground">
                        ₹{selectedDetailsMedicine.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{selectedDetailsMedicine.mrp}
                      </span>
                      {selectedDetailsMedicine.discount > 0 && (
                        <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-extrabold border-0">
                          {selectedDetailsMedicine.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    {selectedDetailsMedicine.mrp - selectedDetailsMedicine.price > 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        You save ₹{selectedDetailsMedicine.mrp - selectedDetailsMedicine.price}!
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="rounded-xl font-bold h-12 gap-2"
                      onClick={() => {
                        handleCompare(selectedDetailsMedicine);
                        setSelectedDetailsMedicine(null);
                      }}
                    >
                      <ArrowRightLeft className="h-4 w-4 text-primary" />
                      Compare Prices
                    </Button>

                    <Button
                      size="lg"
                      className={`font-bold h-12 transition-all duration-300 rounded-xl px-6 gap-2 border-none active:scale-[0.98] ${
                        inCart 
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                          : "bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20"
                      }`}
                      onClick={() => {
                        addItem(selectedDetailsMedicine);
                        setSelectedDetailsMedicine(null);
                      }}
                    >
                      {inCart ? "In Cart" : (
                        <>
                          <Plus className="h-4 w-4" /> Add to Cart
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

      <ComparePricesModal 
        isOpen={showComparison} 
        onClose={() => setShowComparison(false)} 
        medicine={selectedMedicine} 
      />
    </div>
  );
}
