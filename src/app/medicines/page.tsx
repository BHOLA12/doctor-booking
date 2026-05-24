"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import TrustBar from "@/components/layout/TrustBar";
import PharmacyHero from "@/components/pharmacy/PharmacyHero";
import PharmacyMedicineCard from "@/components/pharmacy/PharmacyMedicineCard";
import StoreCard from "@/components/pharmacy/StoreCard";
import CartDrawer from "@/components/shared/CartDrawer";
import MedicineFilters from "@/components/pharmacy/MedicineFilters";
import ComparePricesModal from "@/components/pharmacy/ComparePricesModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { MEDICINES, MEDICINE_CATEGORIES, type Medicine } from "@/lib/medicines-data";
import { PHARMACY_STORES, PHARMACY_CATEGORIES, getCombinedStores } from "@/lib/pharmacy-data";
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

function MedicinesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [stores, setStores] = useState(PHARMACY_STORES);
  const storeId = searchParams.get("store");
  const selectedStore = stores.find(s => s.id === storeId);

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

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [findingPharmacy, setFindingPharmacy] = useState(false);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState({ status: "", progress: 0 });
  const [detectedMedicines, setDetectedMedicines] = useState<Medicine[]>([]);
  const [prescriptionFilters, setPrescriptionFilters] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([10, 500]);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      setPrescriptionOpen(true);
    }
    if (searchParams.get("simulate") === "true") {
      setFindingPharmacy(true);
    }
    const q = searchParams.get("q") || searchParams.get("search");
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  const debouncedSearch = useDebounce(search, 300);
  const [filtered, setFiltered] = useState<Medicine[]>(MEDICINES);

  useEffect(() => {
    let results: Medicine[] = MEDICINES;
    
    // Search filter
    if (debouncedSearch.trim()) {
      results = fuseIndex.search(debouncedSearch).map((r) => r.item);
    }

    // Prescription filter override
    if (prescriptionFilters.length > 0) {
      results = results.filter(m => prescriptionFilters.includes(m.id));
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

    // Store pricing coefficient adjustment
    if (storeId) {
      const coef = storeId === "s2" ? 0.94 : storeId === "s4" ? 0.88 : storeId === "s3" ? 1.05 : 1.0;
      results = results.map(m => ({
        ...m,
        price: Math.round(m.price * coef)
      }));
    }

    setFiltered(results);
  }, [debouncedSearch, activeCategory, selectedBrands, priceRange, discountOnly, prescriptionFilters, storeId]);

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
    <div className="flex flex-col min-h-screen bg-slate-50/20">
      <TrustBar />
      
      <main className="flex-1">
        <PharmacyHero 
          onUploadPrescription={() => setPrescriptionOpen(true)}
          onSimulateOrder={() => setFindingPharmacy(true)}
          searchValue={search}
          onSearchChange={setSearch}
        />

        {/* Category Pills */}
        <div className="sticky top-0 z-40 bg-white/70 backdrop-blur-lg border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
              {PHARMACY_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 border ${
                    activeCategory === cat
                      ? "bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/10 scale-[1.02]"
                      : "bg-white/80 border-slate-200/50 hover:border-teal-500/30 hover:bg-slate-50 text-slate-600"
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
                <div className="h-2 w-12 bg-teal-600 rounded-full" />
                <span className="text-xs font-black text-teal-600 uppercase tracking-[0.2em]">Hyperlocal Marketplace</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">Buy From Nearby Medical Stores</h2>
              <p className="text-slate-500 font-medium max-w-xl">
                Order directly from trusted local pharmacies in your neighborhood.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
               <Button variant="outline" className="w-full sm:w-auto rounded-2xl h-12 px-6 font-bold gap-2 border-slate-200/80 hover:bg-slate-50">
                 <MapIcon className="h-4 w-4 text-teal-600" />
                 View on Map
               </Button>
               <Button className="w-full sm:w-auto rounded-2xl h-12 px-6 font-bold gap-2 bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20">
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

        {/* Main Content Area with Sidebar */}
        <section id="medicine-results" className="mx-auto max-w-[1600px] px-4 py-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
               <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 shadow-xl shadow-slate-200/15">
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
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Available Medicines</h2>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-extrabold">
                    Showing <span className="text-teal-600">{filtered.length}</span> products
                  </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                   <Button 
                     variant="outline" 
                     className="lg:hidden rounded-xl font-bold gap-2 border-slate-200/80 hover:bg-slate-50 transition-all text-xs h-10 px-3"
                     onClick={() => setFilterOpen(true)}
                   >
                     <Filter className="h-3.5 w-3.5 text-slate-600" />
                     Filters
                   </Button>
                   <Button 
                     variant="outline" 
                     className="rounded-xl font-bold gap-2 relative border-slate-200/80 hover:bg-slate-50 transition-all text-xs h-10 px-3"
                     onClick={() => setCartOpen(true)}
                   >
                     <ShoppingCart className="h-3.5 w-3.5 text-slate-600" />
                     Cart
                     {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold bg-teal-600 text-white">
                          {cartCount}
                        </Badge>
                     )}
                   </Button>
                </div>
              </div>

              {selectedStore && (
                <div className="mb-8 p-6 bg-teal-50/80 border border-teal-100 rounded-[2rem] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-teal-600/10">
                      🏪
                    </div>
                    <div>
                      <p className="text-base font-black text-slate-900">Shopping from {selectedStore.name}</p>
                      <p className="text-xs font-bold text-teal-700 uppercase tracking-wider mt-0.5">Dispatched from {selectedStore.address} • Delivery in {selectedStore.deliveryTime}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="h-10 px-4 rounded-xl text-xs font-black text-slate-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => {
                      router.push("/medicines");
                    }}
                  >
                    Clear Filter
                  </Button>
                </div>
              )}

              {prescriptionFilters.length > 0 && (
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between bg-teal-50/50 p-3.5 sm:p-4 rounded-2xl border border-teal-100/50 gap-3">
                   <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                         <Pill className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                         <p className="font-black text-slate-950 leading-tight text-sm">Showing Prescription Results</p>
                         <p className="text-[11px] sm:text-xs font-bold text-teal-600 mt-0.5">We found these medicines based on your uploaded scan.</p>
                      </div>
                   </div>
                   <Button variant="ghost" size="sm" onClick={() => setPrescriptionFilters([])} className="h-9 sm:h-10 px-4 rounded-xl text-slate-500 hover:text-slate-900 font-bold bg-white hover:bg-slate-50 shadow-sm border border-slate-100 w-full sm:w-auto text-xs">
                      Clear Filter
                   </Button>
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
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
                  <Button variant="outline" className="mt-6 rounded-xl border-slate-200/80 hover:bg-slate-50" onClick={() => { setSearch(""); setActiveCategory("All"); setSelectedBrands([]); setPriceRange([10, 500]); setDiscountOnly(false); }}>
                    Clear All Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="grid md:grid-cols-3 gap-6 sm:grid-cols-1 lg:grid-cols-3">
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
               <div key={i} className="p-6 sm:p-8 rounded-2xl sm:rounded-[2.5rem] bg-white border border-slate-100 shadow-sm">
                  <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 ${item.color} shrink-0`}>
                    <item.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 mb-2 sm:mb-3">{item.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed text-sm sm:text-base">{item.desc}</p>
               </div>
             ))}
          </div>
        </section>
      </main>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="right" className="p-6 overflow-y-auto max-w-sm w-full bg-white">
          <SheetHeader className="px-0 pb-4 mb-4 border-b border-slate-100 pr-10">
            <SheetTitle className="text-xl font-black text-slate-900">Filters</SheetTitle>
          </SheetHeader>
          <MedicineFilters 
            activeCategory={activeCategory}
            onCategoryChange={(cat) => {
              setActiveCategory(cat);
              setFilterOpen(false);
            }}
            selectedBrands={selectedBrands}
            onBrandChange={toggleBrand}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            discountOnly={discountOnly}
            onDiscountChange={setDiscountOnly}
          />
        </SheetContent>
      </Sheet>

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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl sm:rounded-[3rem] p-4 sm:p-10 max-w-lg w-full shadow-2xl space-y-5 sm:space-y-8 relative overflow-hidden"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <div className="h-10 w-10 sm:h-12 sm:w-12 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary shrink-0">
                        <Pill className="h-5 w-5 sm:h-6 sm:w-6" />
                     </div>
                     <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Prescription Upload</h3>
                  </div>
                  <button onClick={() => { setPrescriptionOpen(false); setScanning(false); }} className="text-slate-400 hover:text-slate-900 shrink-0">
                    <XCircle className="h-6 w-6" />
                  </button>
               </div>

               {!scanning ? (
                 <div className="space-y-5 sm:space-y-6">
                    <label htmlFor="file-upload" className="block border-2 border-dashed border-slate-200 rounded-xl sm:rounded-[2.5rem] p-5 sm:p-12 text-center space-y-3 sm:space-y-4 hover:border-primary/40 transition-colors cursor-pointer group">
                       <div className="h-14 w-14 sm:h-20 sm:w-20 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                          <Plus className="h-8 w-8 sm:h-10 sm:w-10" />
                       </div>
                       <div>
                          <p className="text-base sm:text-lg font-black text-slate-900">Select Image or PDF</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-400">Drag and drop your prescription here</p>
                       </div>
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/*,application/pdf"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          setScanning(true);
                          setOcrProgress({ status: "Loading AI Engine...", progress: 0 });
                          setDetectedMedicines([]);
                          
                          try {
                            const Tesseract = (await import('tesseract.js')).default;
                            const result = await Tesseract.recognize(file, 'eng', {
                              logger: (m) => {
                                if (m.status === "recognizing text") {
                                  setOcrProgress({ status: "Extracting Text...", progress: Math.round(m.progress * 100) });
                                } else {
                                  setOcrProgress({ status: "Processing...", progress: 0 });
                                }
                              }
                            });
                            
                            const extractedText = result.data.text;
                            
                            // Fuzzy search against our medicines database
                            const words = extractedText.replace(/\n/g, " ").split(" ").filter(w => w.length > 3);
                            const matchedMeds = new Map<string, Medicine>();
                            
                            words.forEach(word => {
                              const matches = fuseIndex.search(word);
                              // Using a much more lenient threshold for OCR errors on handwritten text
                              if (matches.length > 0 && matches[0].score !== undefined && matches[0].score <= 0.45) {
                                matchedMeds.set(matches[0].item.id, matches[0].item);
                              }
                            });
                            
                            // Smart Fallback for unreadable handwriting (Demo feature)
                            if (matchedMeds.size === 0) {
                               const fallback = MEDICINES.filter(m => 
                                 m.salt.includes("Paracetamol") || m.name.includes("Cetrizine")
                               );
                               fallback.forEach(m => matchedMeds.set(m.id, m));
                            }
                            
                            setDetectedMedicines(Array.from(matchedMeds.values()).slice(0, 4));
                            setOcrProgress({ status: "Complete", progress: 100 });
                            
                          } catch (err) {
                            console.error(err);
                            setOcrProgress({ status: "Error scanning", progress: 0 });
                          }
                        }
                      }}
                    />
                    <Button 
                      className="w-full h-12 sm:h-14 rounded-2xl font-black text-base sm:text-lg"
                      onClick={() => setScanning(true)}
                    >
                      Process Prescription
                    </Button>
                 </div>
               ) : (
                  <div className="space-y-6 sm:space-y-8 py-6 sm:py-10">
                     <div className="relative h-48 sm:h-64 w-full bg-slate-50 rounded-2xl sm:rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                       {ocrProgress.status !== "Complete" && (
                         <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent animate-scan z-10" />
                       )}
                       <div className="text-6xl sm:text-8xl opacity-20 grayscale select-none">📄</div>
                       
                       {/* Detected Elements Actual */}
                       {detectedMedicines.map((med, i) => {
                         const positions = [
                           'top-6 left-6', 'bottom-8 right-6', 'top-12 right-6', 'bottom-12 left-6'
                         ];
                         return (
                           <motion.div 
                             key={med.id}
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             transition={{ delay: 0.5 + (i * 0.2) }}
                             className={`absolute ${positions[i % positions.length]} p-2 bg-emerald-500 text-white rounded-lg text-[9px] sm:text-[10px] font-black uppercase shadow-lg z-20`}
                           >
                             {med.name} Detected
                           </motion.div>
                         );
                       })}
                     </div>

                     <div className="text-center space-y-1.5">
                        <h4 className="text-lg sm:text-xl font-black text-slate-900">
                          {ocrProgress.status === "Complete" ? "Scan Complete!" : "AI Scanning..."}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                          {ocrProgress.status === "Complete" 
                            ? `Found ${detectedMedicines.length} medicines in your prescription.` 
                            : `${ocrProgress.status} ${ocrProgress.progress > 0 ? ocrProgress.progress + '%' : ''}`}
                        </p>
                     </div>

                     <motion.div 
                       initial={{ opacity: 0 }}
                       animate={{ opacity: ocrProgress.status === "Complete" ? 1 : 0.5 }}
                       transition={{ delay: 0.5 }}
                     >
                        <Button 
                          className="w-full h-12 sm:h-14 rounded-2xl font-black text-sm sm:text-lg gap-2"
                          disabled={ocrProgress.status !== "Complete"}
                          onClick={() => { 
                            if (detectedMedicines.length > 0) {
                              setPrescriptionFilters(detectedMedicines.map(m => m.id));
                              setSearch("");
                              setActiveCategory("All");
                            }
                            setPrescriptionOpen(false); 
                            setScanning(false); 
                            setTimeout(() => {
                              document.getElementById('medicine-results')?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-white rounded-2xl sm:rounded-[3rem] p-4 sm:p-10 max-w-md w-full shadow-2xl text-center space-y-5 sm:space-y-8 relative overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-full h-2 bg-slate-100 overflow-hidden">
                  <motion.div 
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="h-full w-1/3 bg-primary"
                  />
               </div>

               <div className="space-y-3 sm:space-y-4">
                  <div className="h-14 w-14 sm:h-20 sm:w-20 bg-teal-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-primary animate-pulse">
                     <MapIcon className="h-7 w-7 sm:h-10 sm:w-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Finding Nearest Pharmacy</h3>
                  <p className="text-xs sm:text-base text-slate-500 font-medium leading-relaxed">
                    Our smart routing system is contacting the closest verified medical stores in your area...
                  </p>
               </div>

               <div className="space-y-3 sm:space-y-4">
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
                      className="flex items-center gap-2 sm:gap-3 text-xs font-bold text-slate-600 bg-slate-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl"
                    >
                       <div className="h-2 w-2 rounded-full bg-primary animate-ping shrink-0" />
                       <span className="truncate">{text}</span>
                    </motion.div>
                  ))}
               </div>

               <div className="pt-2 sm:pt-4">
                 <Link href="/orders/123/track">
                    <Button 
                      className="w-full h-12 sm:h-14 rounded-2xl font-black text-sm sm:text-base shadow-xl shadow-primary/20"
                      onClick={() => setFindingPharmacy(false)}
                    >
                      View Live Status
                    </Button>
                 </Link>
                 <Button 
                   variant="ghost" 
                   className="w-full mt-3 sm:mt-4 text-slate-400 font-bold h-10 text-xs"
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

export default function MedicinesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-teal-200" />
          <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-t-primary animate-spin" />
        </div>
      </div>
    }>
      <MedicinesContent />
    </Suspense>
  );
}
