"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Fuse from "fuse.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CartDrawer from "@/components/shared/CartDrawer";
import ComparePricesModal from "@/components/pharmacy/ComparePricesModal";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { MEDICINES, type Medicine, enrichMedicineDetails } from "@/lib/medicines-data";
import { useDebounce } from "@/hooks/useDebounce";
import { 
  Search, 
  ShoppingCart, 
  ChevronRight, 
  Filter, 
  ArrowUpRight, 
  Map as MapIcon, 
  Plus,
  Minus,
  Pill,
  ShieldCheck,
  Star,
  ThumbsUp,
  Clock,
  XCircle,
  Paperclip,
  Activity,
  Heart,
  BriefcaseMedical,
  Sparkles,
  Compass,
  AlertTriangle,
  Locate,
  Zap,
  Tag,
  Truck,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MedicineImage from "@/components/shared/MedicineImage";

// ========================================================
// STORES WITH GEOGRAPHIC COORDINATES FOR DYNAMIC ROUTING
// ========================================================
interface GeocodedStore {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating: number;
  baseDeliveryFee: number;
  feePerKm: number;
  deliveryTimeBase: number; // mins per km
  city?: string;
  isInterCity?: boolean;
}

const TOWER_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "Tower C-4 (New Delhi)": { lat: 28.5500, lng: 77.2200 },
  "Tower W-12 (Dwarka)": { lat: 28.5700, lng: 77.0600 },
  "Tower N-2 (Connaught Place)": { lat: 28.6300, lng: 77.2200 },
  "Tower B-1 (Rohini)": { lat: 28.7000, lng: 77.1000 }
};

const GEO_STORES: GeocodedStore[] = [
  {
    id: "store_a",
    name: "Apollo Pharmacy (Store A)",
    lat: 28.5562,
    lng: 77.2293,
    rating: 4.7,
    baseDeliveryFee: 15,
    feePerKm: 5,
    deliveryTimeBase: 8 // minutes per km
  },
  {
    id: "store_b",
    name: "Wellness Forever (Store B)",
    lat: 28.5630,
    lng: 77.2185,
    rating: 4.5,
    baseDeliveryFee: 20,
    feePerKm: 4,
    deliveryTimeBase: 10
  },
  {
    id: "store_c",
    name: "Ajay Medical Hall (Store C)",
    lat: 28.5482,
    lng: 77.2514,
    rating: 4.6,
    baseDeliveryFee: 10,
    feePerKm: 6,
    deliveryTimeBase: 7
  },
  {
    id: "store_d",
    name: "Hindustan Medical Hall (Store D)",
    lat: 28.5675,
    lng: 77.2012,
    rating: 4.8,
    baseDeliveryFee: 12,
    feePerKm: 5,
    deliveryTimeBase: 9
  },
  {
    id: "store_gaya",
    name: "Gaya Medicos (Gaya - Next Closest)",
    lat: 28.2500, // ~33 km away
    lng: 77.2200,
    rating: 4.9,
    baseDeliveryFee: 50,
    feePerKm: 8,
    deliveryTimeBase: 12,
    city: "Gaya",
    isInterCity: true
  },
  {
    id: "store_patna",
    name: "Patna Central Pharmacy (Patna - Next Closest)",
    lat: 28.9500, // ~45 km away
    lng: 77.3000,
    rating: 4.8,
    baseDeliveryFee: 80,
    feePerKm: 10,
    deliveryTimeBase: 15,
    city: "Patna",
    isInterCity: true
  }
];

// Map defining which medicines are ONLY available in external cities (Gaya/Patna) due to local out-of-stock
const MEDICINE_AVAILABILITY: Record<string, string[]> = {
  m3: ["store_gaya"],    // Azithral 500 only in Gaya
  m7: ["store_gaya"],    // Telmisartan 40 only in Gaya
  m10: ["store_gaya"],   // Betadine Ointment only in Gaya
  m13: ["store_patna"],  // Augmentin 625 only in Patna
  m15: ["store_patna"]   // Atorvastatin 10 only in Patna
};

// Build Fuse index once for search
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

const HEALTH_CONCERNS = [
  { id: "All", name: "All", dbCategory: "All", icon: "🔬" },
  { id: "Diabetes", name: "Diabetes", dbCategory: "Diabetes", icon: "🩸" },
  { id: "Heart", name: "Heart Care", dbCategory: "Heart & BP", icon: "❤️" },
  { id: "Pain", name: "Pain Relief", dbCategory: "Pain Relief", icon: "💊" },
  { id: "Vitamins", name: "Multivitamins", dbCategory: "Vitamins & Supplements", icon: "🔋" },
  { id: "Thyroid", name: "Thyroid Care", dbCategory: "Thyroid Care", icon: "🦋" },
  { id: "Cancer", name: "Cancer Support", dbCategory: "Cancer Support", icon: "🎗️" },
  { id: "Neuro", name: "Neuro & Brain", dbCategory: "Neuro & Brain", icon: "🧠" },
  { id: "ColdFever", name: "Cold & Fever", dbCategory: "Cold & Fever", icon: "🤒" },
  { id: "WomensHealth", name: "Women Health", dbCategory: "Women Health", icon: "🤰" },
  { id: "ChildCare", name: "Child Care", dbCategory: "Child Care", icon: "👶" },
  { id: "Ayurveda", name: "Ayurveda & Herbal", dbCategory: "Ayurveda & Herbal", icon: "🌿" }
];

// Haversine distance formula
function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function MedicinesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // slideshow state for Farmplus-inspired hero
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Core System States
  const [routingMode, setRoutingMode] = useState<"FASTEST" | "CHEAPEST">("CHEAPEST");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<"IDLE" | "SCANNING" | "GPS_ACTIVE" | "FALLBACK">("IDLE");
  const [selectedTower, setSelectedTower] = useState("Tower C-4 (New Delhi)");
  const [isRouting, setIsRouting] = useState(true);

  // Initialize medicines list
  const [medicinesList, setMedicinesList] = useState<Medicine[]>(() => {
    return MEDICINES;
  });

  // Filters & Search
  const initialSearch = searchParams.get("search") || searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);

  // Sync search state with URL parameter if it changes
  useEffect(() => {
    const urlSearch = searchParams.get("search") || searchParams.get("q") || "";
    setSearch(urlSearch);
  }, [searchParams]);

  // Automatically open prescription upload modal if upload=true is in the query params
  useEffect(() => {
    if (searchParams.get("upload") === "true") {
      setPrescriptionOpen(true);
    }
  }, [searchParams]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [selectedDetailsMedicine, setSelectedDetailsMedicine] = useState<Medicine | null>(null);
  const [prescriptionOpen, setPrescriptionOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState({ status: "", progress: 0 });
  const [detectedMedicines, setDetectedMedicines] = useState<Medicine[]>([]);
  const [prescriptionFilters, setPrescriptionFilters] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);
  const [sortByPrice, setSortByPrice] = useState<"none" | "asc" | "desc">("none");
  
  // Cart Actions
  const { cartItems, cartCount, cartTotal, addItem, updateQuantity } = useCart();

  // ========================================================
  // GEOLOCATION (GPS) PIPELINE
  // ========================================================
  const fetchGPSLocation = useCallback(() => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      setLocationStatus("FALLBACK");
      // Load fallback tower coordinates
      const coords = TOWER_COORDINATES[selectedTower] || TOWER_COORDINATES["Tower C-4 (New Delhi)"];
      setUserLocation(coords);
      return;
    }

    setLocationStatus("SCANNING");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationStatus("GPS_ACTIVE");
      },
      (error) => {
        console.warn("GPS Permission Denied / Timed out. Engaging Tower Fallback.", error);
        setLocationStatus("FALLBACK");
        // Load fallback tower coordinates
        const coords = TOWER_COORDINATES[selectedTower] || TOWER_COORDINATES["Tower C-4 (New Delhi)"];
        setUserLocation(coords);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  }, [selectedTower]);

  // Trigger GPS handshake on mount & when selected tower fallback changes
  useEffect(() => {
    fetchGPSLocation();
  }, [fetchGPSLocation]);

  // Curated Medicine Image Resolution Pipeline
  useEffect(() => {
    // Find medicines that were initialized without an image (index % 3 === 0)
    const missingImages = MEDICINES.filter((_, index) => index % 3 === 0);
    missingImages.forEach(async (med) => {
      try {
        const res = await fetch("/api/medicines/resolve-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ medicineName: med.name, medicineId: med.id, salt: med.salt, category: med.category })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          console.log(`[Image Resolver] Updated ${med.name}:`, data.imageUrl);
          // Dynamically update local state to fade in the resolved image and set metadata properties
          setMedicinesList(prev => prev.map(m => m.id === med.id ? { 
            ...m, 
            image: data.imageUrl,
            isAiGenerated: data.isAiGenerated,
            aiDisclaimer: data.aiDisclaimer 
          } : m));
        }
      } catch (err) {
        console.warn("Image resolution failure for", med.name, err);
      }
    });
  }, []);

  // Simulate routing handshake animation on mode switch or location changes
  useEffect(() => {
    setIsRouting(true);
    const timer = setTimeout(() => {
      setIsRouting(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, [routingMode, userLocation]);

  // Resolve store details dynamically based on active GPS coordinates
  const resolvedStores = useMemo(() => {
    if (!userLocation) return GEO_STORES.map(s => ({ ...s, distance: 1.5, deliveryFee: s.baseDeliveryFee, eta: 15 }));
    
    return GEO_STORES.map(store => {
      const distance = getHaversineDistance(userLocation.lat, userLocation.lng, store.lat, store.lng);
      const deliveryFee = Math.round(store.baseDeliveryFee + distance * store.feePerKm);
      const eta = Math.round(distance * store.deliveryTimeBase) + 4; // base prep time is 4 mins
      return {
        ...store,
        distance,
        deliveryFee,
        eta
      };
    });
  }, [userLocation]);

  // ========================================================
  // ROUTING ALGORITHM (FASTEST vs CHEAPEST)
  // ========================================================
  const getMappedStore = useCallback((medicine: Medicine) => {
    // Check if there are specific store restrictions for this medicine (inter-city sourcing)
    const allowedStoreIds = MEDICINE_AVAILABILITY[medicine.id];
    
    // Filter resolvedStores to only allowed stores
    const availableStores = allowedStoreIds 
      ? resolvedStores.filter(store => allowedStoreIds.includes(store.id))
      : resolvedStores.filter(store => !store.isInterCity); // Local stores by default
    
    // If no stores found (fallback to all)
    const targetStores = availableStores.length > 0 ? availableStores : resolvedStores;

    // 1. FASTEST MODE: Strict Min(Distance) matching
    if (routingMode === "FASTEST") {
      const sortedByDistance = [...targetStores].sort((a, b) => a.distance - b.distance);
      const chosenStore = sortedByDistance[0] || resolvedStores[0];
      return {
        store: chosenStore,
        eta: chosenStore.eta,
        distance: chosenStore.distance,
        price: medicine.price, // Uses catalog price
        mrp: medicine.mrp,
        discount: medicine.discount,
        isInterCity: !!chosenStore.isInterCity,
        city: chosenStore.city || ""
      };
    }

    // 2. CHEAPEST MODE: Split & Price Optimization matching
    let bestStore = targetStores[0] || resolvedStores[0];
    let bestTotalCost = Infinity;
    let finalPrice = medicine.price;
    let finalMrp = medicine.mrp;
    let finalDiscount = medicine.discount;

    targetStores.forEach(store => {
      // Pricing coefficients simulating price difference across retailers
      const coefficients: Record<string, number> = {
        store_a: 1.0,
        store_b: 0.94,
        store_c: 1.05,
        store_d: 0.88,
        store_gaya: 0.92,
        store_patna: 0.90
      };
      const coef = coefficients[store.id] || 1.0;
      const storeItemPrice = Math.round(medicine.price * coef);
      const storeItemMrp = Math.round(medicine.mrp * coef);
      const storeTotalCost = storeItemPrice + store.deliveryFee;

      if (storeTotalCost < bestTotalCost) {
        bestTotalCost = storeTotalCost;
        bestStore = store;
        finalPrice = storeItemPrice;
        finalMrp = storeItemMrp;
        finalDiscount = Math.round(((storeItemMrp - storeItemPrice) / storeItemMrp) * 100);
      }
    });

    return {
      store: bestStore,
      eta: bestStore.eta,
      distance: bestStore.distance,
      price: finalPrice,
      mrp: finalMrp,
      discount: finalDiscount,
      isInterCity: !!bestStore.isInterCity,
      city: bestStore.city || ""
    };
  }, [resolvedStores, routingMode]);

  const debouncedSearch = useDebounce(search, 300);
  const [filtered, setFiltered] = useState<Medicine[]>(MEDICINES);

  useEffect(() => {
    let results: Medicine[] = medicinesList;
    
    // 1. Search filter
    if (debouncedSearch.trim()) {
      // Find matching items from fuseIndex, but map them to the items in medicinesList
      // so we keep the updated image URL!
      const searchResults = fuseIndex.search(debouncedSearch).map((r) => r.item);
      results = searchResults.map(sr => medicinesList.find(m => m.id === sr.id) || sr);
    }

    // 2. Prescription filter override
    if (prescriptionFilters.length > 0) {
      results = results.filter(m => prescriptionFilters.includes(m.id));
    }
    
    // 3. Category (Disease-wise) filter
    if (activeCategory !== "All") {
      const activeConcern = HEALTH_CONCERNS.find((c) => c.id === activeCategory);
      if (activeConcern && activeConcern.dbCategory !== "All") {
        results = results.filter((m) => m.category === activeConcern.dbCategory);
      }
    }

    // 4. Brand-wise filter
    if (selectedBrand !== "All") {
      results = results.filter(m => m.manufacturer.toLowerCase() === selectedBrand.toLowerCase());
    }

    // 5. Price-wise range filter (Flipkart-style slider)
    results = results.filter(m => m.price >= minPrice && m.price <= maxPrice);

    // 6. Price-wise sort (based on catalog price)
    if (sortByPrice !== "none") {
      results = [...results].sort((a, b) => {
        return sortByPrice === "asc" ? a.price - b.price : b.price - a.price;
      });
    }

    setFiltered(results);
  }, [
    debouncedSearch, 
    activeCategory, 
    prescriptionFilters, 
    medicinesList, 
    selectedBrand, 
    minPrice,
    maxPrice,
    sortByPrice
  ]);

  // Adjust card highlight themes dynamically based on chosen routingMode
  const activeColor = routingMode === "FASTEST" ? "text-amber-500 bg-amber-50 border-amber-200" : "text-emerald-500 bg-emerald-50 border-emerald-250";
  const activeBtnColor = routingMode === "FASTEST" ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white";

  return (
    <div className="flex flex-col min-h-screen bg-[#FCFBF9] font-sans antialiased text-[#554D45] pb-24">
      
      {/* 1. Top Navigation & Alert Bar */}
      <section className="bg-[#554D45] text-white py-3.5 px-4 sm:px-6 lg:px-8 border-b border-[#3e3832]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FB6C3F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FB6C3F]"></span>
            </span>
            <p className="text-xs font-bold tracking-wide text-stone-200">
              ⚡ FarmPlus Pharmacy: Streamlined digital delivery network active.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Geolocation status indicator */}
            <button 
              onClick={fetchGPSLocation}
              className="flex items-center gap-1.5 text-[10px] uppercase font-black text-stone-200 bg-[#5B8C5A] hover:bg-[#4a7249] px-3 py-1.5 rounded-full transition-all shadow-sm"
            >
              <Locate className={`w-3.5 h-3.5 ${locationStatus === "SCANNING" ? "animate-spin text-white" : "text-[#FCFBF9]"}`} />
              <span>{locationStatus === "GPS_ACTIVE" ? "GPS Active" : "Fix Geolocation"}</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black text-stone-300">Active Node:</span>
              <select
                value={selectedTower}
                onChange={(e) => {
                  setSelectedTower(e.target.value);
                  setLocationStatus("FALLBACK");
                }}
                className="bg-[#665d54] border border-[#786d63] text-[#FCFBF9] rounded-full px-3 py-0.5 text-xs font-black focus:outline-none focus:border-[#5B8C5A] cursor-pointer"
              >
                {Object.keys(TOWER_COORDINATES).map((tower) => (
                  <option key={tower} value={tower}>{tower.replace(" (New Delhi)", "")}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Farmplus-Inspired Hero Banner Slider */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#fbf4ed] via-[#f7efe6] to-[#FCFBF9] min-h-[480px] flex items-center border-b border-stone-200/50">
        
        {/* Decorative organic background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5B8C5A]/[0.04] rounded-full translate-x-1/4 -translate-y-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FB6C3F]/[0.03] rounded-full -translate-x-1/4 translate-y-1/4 blur-3xl pointer-events-none" />

        <div className="relative w-full z-10">
          <AnimatePresence mode="wait">
            {currentSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 rounded-full px-4.5 py-1.5 shadow-sm">
                    <Compass className="h-3.5 w-3.5 text-[#5B8C5A] animate-spin" />
                    <span className="text-xs font-extrabold text-[#5B8C5A] tracking-wider uppercase">FarmPlus Quick-Pharmacy Hub</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#554D45] tracking-tight leading-[1.05]">
                    Streamlining <br />
                    <span className="text-[#5B8C5A]">Medicine Supply</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#776c60] leading-relaxed max-w-xl font-medium">
                    One-stop platform connecting patients to chemist networks across the city via technology-driven solutions! Get automated price partitions and swift deliveries.
                  </p>
                  <div className="pt-2">
                    <a href="#chemist-catalog" className="inline-flex items-center justify-center rounded-full bg-[#5B8C5A] px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#5B8C5A]/25 transition hover:bg-[#4a7249]">
                      Browse Molecules
                      <ChevronRight className="ml-2 w-4 h-4" />
                    </a>
                  </div>
                </div>
                <div className="lg:col-span-5 hidden lg:flex justify-center">
                  <div className="relative w-72 h-72 rounded-[2.5rem] bg-[#5B8C5A]/10 border border-[#5B8C5A]/25 p-6 flex items-center justify-center shadow-inner">
                    <div className="text-8xl filter drop-shadow-md">🩺</div>
                    <div className="absolute -top-4 -right-4 bg-white border border-[#5B8C5A]/20 rounded-2xl p-3.5 shadow-md text-center">
                      <p className="text-xl font-black text-[#5B8C5A]">100%</p>
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400">Genuine Meds</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 1 && (
              <motion.div
                key="slide-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-[#FB6C3F]/10 border border-[#FB6C3F]/20 rounded-full px-4.5 py-1.5 shadow-sm">
                    <Zap className="h-3.5 w-3.5 text-[#FB6C3F] animate-pulse" />
                    <span className="text-xs font-extrabold text-[#FB6C3F] tracking-wider uppercase">Linear Cost Optimizer</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#554D45] tracking-tight leading-[1.05]">
                    Hyper-Local <br />
                    <span className="text-[#FB6C3F]">Speed & Value Routing</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#776c60] leading-relaxed max-w-xl font-medium">
                    Choose between Emergency Express and Value Smart routes. Our algorithm splits your cart across local chemists to ensure you secure the lowest overall bill.
                  </p>
                  <div className="pt-2">
                    <Link href="/medicines/optimize" className="inline-flex items-center justify-center rounded-full bg-[#FB6C3F] px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-[#FB6C3F]/25 transition hover:bg-[#e0592b]">
                      Launch Optimizer Lab
                      <ArrowUpRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
                <div className="lg:col-span-5 hidden lg:flex justify-center">
                  <div className="relative w-72 h-72 rounded-[2.5rem] bg-[#FB6C3F]/10 border border-[#FB6C3F]/25 p-6 flex items-center justify-center shadow-inner">
                    <div className="text-8xl filter drop-shadow-md">⚡</div>
                    <div className="absolute -bottom-4 -left-4 bg-white border border-[#FB6C3F]/20 rounded-2xl p-3.5 shadow-md text-center">
                      <p className="text-xl font-black text-[#FB6C3F]">~12%</p>
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400">Average Savings</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentSlide === 2 && (
              <motion.div
                key="slide-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-6">
                  <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-150 rounded-full px-4.5 py-1.5 shadow-sm">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600 animate-pulse" />
                    <span className="text-xs font-extrabold text-indigo-600 tracking-wider uppercase">AI Tesseract Scanner</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#554D45] tracking-tight leading-[1.05]">
                    Instant AI-OCR <br />
                    <span className="text-indigo-600">Prescription Audits</span>
                  </h1>
                  <p className="text-sm sm:text-base text-[#776c60] leading-relaxed max-w-xl font-medium">
                    Upload handwritten notes or digital PDFs. Our integrated AI-OCR engine decodes doctor instructions and flags molecules in nearby inventories instantly.
                  </p>
                  <div className="pt-2">
                    <button onClick={() => setPrescriptionOpen(true)} className="inline-flex items-center justify-center rounded-full bg-indigo-600 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700">
                      Scan Prescription
                      <Paperclip className="ml-2 w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="lg:col-span-5 hidden lg:flex justify-center">
                  <div className="relative w-72 h-72 rounded-[2.5rem] bg-indigo-50 border border-indigo-100 p-6 flex items-center justify-center shadow-inner">
                    <div className="text-8xl filter drop-shadow-md">📋</div>
                    <div className="absolute -top-4 -left-4 bg-white border border-indigo-100 rounded-2xl p-3.5 shadow-md text-center">
                      <p className="text-xl font-black text-indigo-600">Auto</p>
                      <p className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400">Compliance Mapping</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Curved Wave SVG Page Divider transition */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none z-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[50px] text-[#FCFBF9] fill-[#FCFBF9]">
            <path d="M0,0 C150,90 350,120 600,100 C850,80 1050,110 1200,90 L1200,120 L0,120 Z"></path>
          </svg>
        </div>

      </section>

      {/* 3. Farmplus-Style Values Section */}
      <section className="py-20 bg-[#FCFBF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-[#554D45] tracking-tight leading-tight">
              Our Values: <span className="text-[#5B8C5A]">Ensuring Optimum Care</span>
            </h2>
            <div className="h-1 w-16 bg-[#5B8C5A] mx-auto mt-4 rounded-full" />
            <p className="text-xs text-stone-400 mt-3 uppercase tracking-wider font-bold">Standardizing health delivery through technology</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Value Card 1 */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 flex items-center justify-center text-[#5B8C5A] shrink-0 group-hover:bg-[#5B8C5A]/20 transition-colors">
                <Pill className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#554D45] text-base">Complete Medicine Basket</h4>
                <p className="text-xs text-[#776c60] leading-relaxed">
                  Browse over 15,000+ molecules, health syrups, tablet strips, and supplements consolidated under a simple search catalog.
                </p>
              </div>
            </div>

            {/* Value Card 2 */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 flex items-center justify-center text-[#5B8C5A] shrink-0 group-hover:bg-[#5B8C5A]/20 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#554D45] text-base">Premium Quality Guarantee</h4>
                <p className="text-xs text-[#776c60] leading-relaxed">
                  Every connected vendor is a 100% verified pharmacy holding authentic drug license credentials and GSTIN certificates.
                </p>
              </div>
            </div>

            {/* Value Card 3 */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 flex items-center justify-center text-[#5B8C5A] shrink-0 group-hover:bg-[#5B8C5A]/20 transition-colors">
                <ThumbsUp className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#554D45] text-base">Empowered Patient Rights</h4>
                <p className="text-xs text-[#776c60] leading-relaxed">
                  Full pricing breakdowns and catalog transparency. No hidden markups or arbitrary local retailer pricing surges.
                </p>
              </div>
            </div>

            {/* Value Card 4 */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 flex items-center justify-center text-[#5B8C5A] shrink-0 group-hover:bg-[#5B8C5A]/20 transition-colors">
                <Truck className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#554D45] text-base">Efficient Logistics Router</h4>
                <p className="text-xs text-[#776c60] leading-relaxed">
                  Hyper-local cell-tower triangulation routes orders to the closest store, reducing transit time and final delivery fees.
                </p>
              </div>
            </div>

            {/* Value Card 5 */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 flex items-center justify-center text-[#5B8C5A] shrink-0 group-hover:bg-[#5B8C5A]/20 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#554D45] text-base">Genuine Batch Verification</h4>
                <p className="text-xs text-[#776c60] leading-relaxed">
                  Every order undergoes strict compliance audits by certified pharmacists to check prescriptions, batch numbers, and expiries.
                </p>
              </div>
            </div>

            {/* Value Card 6 */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-8 shadow-sm hover:shadow-md transition-all group flex items-start gap-5">
              <div className="h-12 w-12 rounded-2xl bg-[#5B8C5A]/10 border border-[#5B8C5A]/20 flex items-center justify-center text-[#5B8C5A] shrink-0 group-hover:bg-[#5B8C5A]/20 transition-colors">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-[#554D45] text-base">Superior Technology Solutions</h4>
                <p className="text-xs text-[#776c60] leading-relaxed">
                  Integrated OCR prescription reading models, dynamic split-cost optimization engines, and GPS tracking interfaces.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Farmplus-Style Presence & Counters Section */}
      <section className="py-20 bg-gradient-to-br from-[#fbf4ed] to-[#FCFBF9] border-t border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-[#554D45] tracking-tight">
              Our Presence: <span className="text-[#5B8C5A]">Reaching Every Corner</span>
            </h2>
            <div className="h-1 w-16 bg-[#5B8C5A] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Left side Counters */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-6">
              
              {/* Stat Counter 1 */}
              <div className="bg-white border border-[#f0eae1] rounded-[1.75rem] p-6 shadow-sm text-center">
                <h3 className="text-4xl font-black text-[#5B8C5A] tracking-tighter">18+</h3>
                <p className="text-[10px] font-black text-[#554D45] uppercase tracking-wider mt-2">Geographical Nodes</p>
                <span className="text-[9px] text-stone-400 block mt-1">Expanding across Bihar & Delhi</span>
              </div>

              {/* Stat Counter 2 */}
              <div className="bg-white border border-[#f0eae1] rounded-[1.75rem] p-6 shadow-sm text-center">
                <h3 className="text-4xl font-black text-[#5B8C5A] tracking-tighter">8L+</h3>
                <p className="text-[10px] font-black text-[#554D45] uppercase tracking-wider mt-2">Empowered Patients</p>
                <span className="text-[9px] text-stone-400 block mt-1">Trusted medical fulfillment</span>
              </div>

              {/* Stat Counter 3 */}
              <div className="bg-white border border-[#f0eae1] rounded-[1.75rem] p-6 shadow-sm text-center">
                <h3 className="text-4xl font-black text-[#5B8C5A] tracking-tighter">5k+</h3>
                <p className="text-[10px] font-black text-[#554D45] uppercase tracking-wider mt-2">Partner Chemists</p>
                <span className="text-[9px] text-stone-400 block mt-1">Robust local inventory nodes</span>
              </div>

              {/* Stat Counter 4 */}
              <div className="bg-white border border-[#f0eae1] rounded-[1.75rem] p-6 shadow-sm text-center">
                <h3 className="text-4xl font-black text-[#5B8C5A] tracking-tighter">100%</h3>
                <p className="text-[10px] font-black text-[#554D45] uppercase tracking-wider mt-2">Rx Compliance</p>
                <span className="text-[9px] text-stone-400 block mt-1">Fully audited prescription checks</span>
              </div>

            </div>

            {/* Right side graphic decoration */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-6 w-full max-w-lg shadow-sm flex flex-col items-center">
                <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-gradient-to-br from-[#fcf6ee] to-[#f8f0e5] relative overflow-hidden">
                  {/* Stylized local map illustration */}
                  <Compass className="w-16 h-16 text-[#5B8C5A] opacity-35 animate-spin" />
                  <div className="absolute top-8 left-16 h-2 w-2 rounded-full bg-[#FB6C3F] animate-ping" />
                  <div className="absolute bottom-12 right-24 h-2 w-2 rounded-full bg-[#5B8C5A] animate-ping" />
                  <div className="absolute top-16 right-16 h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                </div>
                <h4 className="font-extrabold text-xs text-[#554D45] uppercase tracking-wider mt-4">Real-Time Tower Nodes Coverage Map</h4>
                <p className="text-[10px] text-stone-400 text-center mt-1 leading-normal">
                  Our system traces routing coefficients by scanning browser GPS telemetry against local grid towers.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Main Product Catalog & Search Section */}
      <section id="chemist-catalog" className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Toggle Mode and Catalog Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[#f0eae1] pb-6 mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#554D45] tracking-tight">Chemist Routing Catalog</h2>
            <p className="text-xs text-stone-400 mt-0.5">Automated linear pricing partitions matching local inventories</p>
          </div>

          {/* Farmplus-Inspired Slide Active Mode Toggle */}
          <div className="bg-stone-100 border border-stone-200/60 p-1 rounded-full flex shadow-inner">
            <button
              onClick={() => setRoutingMode("FASTEST")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-black transition-all ${
                routingMode === "FASTEST"
                  ? "bg-[#FB6C3F] text-white shadow-md"
                  : "text-stone-500 hover:text-stone-850"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Emergency Express (Fastest)</span>
            </button>
            
            <button
              onClick={() => setRoutingMode("CHEAPEST")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-black transition-all ${
                routingMode === "CHEAPEST"
                  ? "bg-[#5B8C5A] text-white shadow-md"
                  : "text-stone-500 hover:text-stone-850"
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Value Smart (Cheapest)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Inputs (Search & Filters) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search Bar Input */}
            <div className="relative flex items-center bg-white border border-[#f0eae1] rounded-[1.25rem] p-1.5 shadow-sm focus-within:border-[#5B8C5A] focus-within:ring-2 focus-within:ring-[#5B8C5A]/10 transition-all">
              <Search className="ml-4 h-5 w-5 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="Search for tablets, syrups, or healthcare molecules..."
                className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 py-2.5 text-sm text-[#554D45] placeholder-stone-400 font-bold"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Health Category List Tabs (Disease-wise) */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block px-1">Filter by Condition</span>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {HEALTH_CONCERNS.map((c) => {
                  const isActive = activeCategory === c.id;
                  const activeColorClass = routingMode === "FASTEST" ? "bg-[#FB6C3F] border-[#FB6C3F]" : "bg-[#5B8C5A] border-[#5B8C5A]";
                  return (
                    <button
                      key={c.id}
                      onClick={() => setActiveCategory(c.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-black transition-all shrink-0 ${
                        isActive 
                          ? `${activeColorClass} text-white shadow-sm` 
                          : "bg-white border-[#f0eae1] text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      <span>{c.icon}</span>
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand & Price Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-[#f0eae1] rounded-[1.75rem] p-4.5 shadow-sm">
              {/* Brand Filter */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 px-1">Filter by Brand</span>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="bg-[#FCFBF9] border border-[#f0eae1] rounded-xl px-3 py-2 text-xs font-bold text-[#554D45] focus:outline-none focus:border-[#5B8C5A] cursor-pointer"
                >
                  <option value="All">All Brands</option>
                  <option value="GSK">GSK</option>
                  <option value="Cipla">Cipla</option>
                  <option value="Abbott">Abbott</option>
                  <option value="Sun Pharma">Sun Pharma</option>
                  <option value="Micro Labs">Micro Labs</option>
                  <option value="Sanofi">Sanofi</option>
                  <option value="Pfizer">Pfizer</option>
                </select>
              </div>

              {/* Flipkart-Style Price Slider Filter */}
              <div className="flex flex-col gap-1.5 sm:col-span-1">
                <div className="flex justify-between items-center text-xs font-extrabold text-[#554D45] px-1">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400">Price Range</span>
                  <span className="text-emerald-700 font-extrabold">₹{minPrice} - ₹{maxPrice}</span>
                </div>
                <div className="relative w-full h-2 bg-stone-100 rounded-full mt-2.5 px-0.5">
                  {/* Highlighted track */}
                  <div 
                    className="absolute h-full bg-[#5B8C5A] rounded-full" 
                    style={{
                      left: `${(minPrice / 300) * 100}%`,
                      right: `${100 - (maxPrice / 300) * 100}%`
                    }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={minPrice}
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), maxPrice - 10);
                      setMinPrice(val);
                    }}
                    className="absolute w-full h-2 top-0 left-0 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#5B8C5A] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md"
                  />
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), minPrice + 10);
                      setMaxPrice(val);
                    }}
                    className="absolute w-full h-2 top-0 left-0 appearance-none bg-transparent pointer-events-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#5B8C5A] [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:shadow-md"
                  />
                </div>
                <div className="flex justify-between text-[9px] text-stone-400 font-extrabold px-1 mt-1.5">
                  <span>Min: ₹0</span>
                  <span>Max: ₹300+</span>
                </div>
              </div>

              {/* Sort by Price */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 px-1">Sort by Price</span>
                <select
                  value={sortByPrice}
                  onChange={(e) => setSortByPrice(e.target.value as any)}
                  className="bg-[#FCFBF9] border border-[#f0eae1] rounded-xl px-3 py-2 text-xs font-bold text-[#554D45] focus:outline-none focus:border-[#5B8C5A] cursor-pointer"
                >
                  <option value="none">Default Sort</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Inputs (Prescription CTA card) */}
          <div className="lg:col-span-4">
            <div className="border-2 border-dashed border-[#FBB59E] bg-[#fbf4ed]/40 rounded-[2rem] p-6 flex flex-col justify-between h-full group hover:border-[#FB6C3F] hover:bg-[#fbf4ed]/60 transition-all shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-white text-[#FB6C3F] border border-[#f0eae1] rounded-2xl shrink-0 shadow-sm">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-[#554D45]">Have a Doctor&apos;s Prescription?</h3>
                  <p className="text-[10px] text-stone-400 mt-1 leading-relaxed">
                    Attach files or snapshots to auto-route to compliant pharmacists.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPrescriptionOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-extrabold text-xs shadow-sm transition-all active:scale-95 border-none"
              >
                Upload Prescription for Instant Pharmacy Routing
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* 6. Product Cards Grid & Sidebars */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar workflow */}
          <aside className="lg:col-span-3 space-y-6">
            
            {/* Guide widget */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-1.5 w-7 bg-[#5B8C5A] rounded-full" />
                <span className="text-[10px] font-black text-[#5B8C5A] uppercase tracking-widest">Routing Protocol</span>
              </div>
              
              <h3 className="font-extrabold text-sm text-[#554D45] mb-4">Order Pipeline Steps</h3>
              
              <div className="relative pl-6 space-y-6 border-l border-stone-200 text-xs">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full border-2 border-[#5B8C5A] bg-white flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#5B8C5A]" />
                  </div>
                  <h4 className="font-extrabold text-stone-850">1. Order Dispatch to Nearest Store</h4>
                  <p className="text-[10px] text-stone-400 mt-1">Order hits the localized routing queue based on search radius.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full border-2 border-[#FB6C3F] bg-white flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-[#FB6C3F] animate-ping" />
                  </div>
                  <h4 className="font-extrabold text-stone-850">2. Automated Prescription Audit</h4>
                  <p className="text-[10px] text-stone-400 mt-1">AI scans prescription upload to ensure compliance before packaging.</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 h-4 w-4 rounded-full border-2 border-stone-200 bg-white flex items-center justify-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-stone-200" />
                  </div>
                  <h4 className="font-extrabold text-stone-800">3. Flash Rider Dispatched</h4>
                  <p className="text-[10px] text-stone-400 mt-1">Delivery agent dispatched within 10 minutes of confirmation.</p>
                </div>
              </div>
            </div>

            {/* Delivery Tariffs Widget */}
            <div className="bg-white border border-[#f0eae1] rounded-[2rem] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-7 bg-[#554D45] rounded-full" />
                <span className="text-[10px] font-black text-stone-450 uppercase tracking-widest">Active Nodes</span>
              </div>
              <h3 className="font-extrabold text-sm text-[#554D45]">Delivery Tariffs & Distance</h3>
              
              <div className="space-y-3">
                {resolvedStores.map(store => (
                  <div key={store.id} className="bg-[#FCFBF9] border border-[#f0eae1] rounded-2xl p-3.5 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-stone-800 truncate max-w-[130px]">{store.name}</p>
                      <span className="text-[9px] font-bold text-stone-400 uppercase">📍 {store.distance.toFixed(2)} km away</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[#554D45]">₹{store.deliveryFee}</p>
                      <span className="text-[9px] font-bold text-stone-500 uppercase">Fee</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </aside>

          {/* Product cards */}
          <div className="lg:col-span-9">
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs font-bold text-stone-400">
                Found <span className="text-[#554D45] font-extrabold">{filtered.length} molecules</span> in search radius
              </p>
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((medicine) => {
                  const cartItem = cartItems.find(i => i.medicine.id === medicine.id);
                  const qtyInCart = cartItem ? cartItem.quantity : 0;
                  
                  // Run routing algorithm calculations dynamically
                  const routeDetails = getMappedStore(medicine);
                  
                  const activeColorClass = routingMode === "FASTEST" ? "bg-[#FB6C3F] hover:bg-[#e0592b]" : "bg-[#5B8C5A] hover:bg-[#4a7249]";
                  const counterColorClass = routingMode === "FASTEST" ? "bg-[#FB6C3F] border-[#FB6C3F]" : "bg-[#5B8C5A] border-[#5B8C5A]";

                  return (
                    <div 
                      key={medicine.id}
                      onClick={() => setSelectedDetailsMedicine(medicine)}
                      className="bg-white border border-[#f0eae1] rounded-[2rem] p-5 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group relative cursor-pointer"
                    >
                      {/* Top elements */}
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-3">
                          <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-wider">
                            {medicine.manufacturer}
                          </span>
                          
                          {/* Rx sticker */}
                          {medicine.requiresPrescription ? (
                            <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 rounded-md px-1.5 py-0.5">
                              [Rx] Required
                            </span>
                          ) : (
                            <span className="text-[9px] font-extrabold text-stone-400 bg-stone-50 border border-stone-150 rounded-md px-1.5 py-0.5">
                              OTC
                            </span>
                          )}
                        </div>

                        {/* Medicine Image */}
                        <div className="relative h-32 w-full bg-[#FCFBF9] rounded-2xl mb-4 overflow-hidden p-2 flex items-center justify-center border border-[#f0eae1]">
                          <MedicineImage 
                            src={medicine.image}
                            category={medicine.category}
                            alt={medicine.name}
                            className="h-28 w-28"
                          />
                          {medicine.isAiGenerated && (
                            <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white border border-slate-700/60 rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wide backdrop-blur-sm shadow-sm">
                              🎨 AI Generated
                            </span>
                          )}
                        </div>

                        {/* Details */}
                        <h3 className="font-extrabold text-base text-[#554D45] group-hover:text-[#5B8C5A] transition-colors leading-snug">
                          {medicine.name}
                        </h3>
                        <p className="text-[11px] text-stone-400 font-medium mt-1 mb-2">
                          {medicine.dosage}
                        </p>

                        {/* AI Generated image disclaimer */}
                        {medicine.isAiGenerated && (
                          <div className="text-[9px] text-amber-700 bg-amber-50/50 border border-amber-100/60 rounded-xl px-3 py-2 mb-3 font-semibold leading-normal">
                            💡 {medicine.aiDisclaimer || "This color or image of medicine may be different. This is an AI-generated image."}
                          </div>
                        )}

                        {/* Routing information block */}
                        <div className={`border rounded-2xl p-3.5 text-xs mb-4 ${routeDetails.isInterCity ? "bg-amber-50/60 border-amber-200" : "bg-[#FCFBF9] border-[#f0eae1]"}`}>
                          {isRouting ? (
                            <div className="flex items-center gap-2 text-[#5B8C5A] font-extrabold animate-pulse">
                              <div className="h-1.5 w-1.5 rounded-full bg-[#5B8C5A] animate-ping" />
                              <span>Scanning local stores...</span>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] text-stone-500 font-extrabold">
                                <span className="truncate">🏪 {routeDetails.store.name}</span>
                                <span className={`${routeDetails.isInterCity ? "text-amber-600" : "text-[#5B8C5A]"} shrink-0 ml-1`}>⏱️ {routeDetails.eta} mins</span>
                              </div>
                              <div className="flex justify-between text-[9px] text-[#776c60] font-bold">
                                <span>📍 {routeDetails.distance.toFixed(1)} km away</span>
                                <span className={routeDetails.isInterCity ? "text-amber-700 font-extrabold" : ""}>Del: ₹{routeDetails.store.deliveryFee}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Mode Tag Indicator */}
                        {!isRouting && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {routeDetails.isInterCity ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-750 bg-amber-55 border border-amber-200 px-2 py-0.5 rounded-full">
                                📦 Sourced from {routeDetails.city} (Next Closest)
                              </span>
                            ) : routingMode === "FASTEST" ? (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#FB6C3F] bg-[#FB6C3F]/5 border border-[#FB6C3F]/20 px-2 py-0.5 rounded-full">
                                ⚡ Fastest Route Mapped
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[9px] font-black text-[#5B8C5A] bg-[#5B8C5A]/5 border border-[#5B8C5A]/20 px-2 py-0.5 rounded-full">
                                💰 Lowest Price Guaranteed
                              </span>
                            )}
                          </div>
                        )}

                        {/* Limited stock / Intercity warning fallback */}
                        {routeDetails.isInterCity ? (
                          <div className="flex items-start gap-1.5 text-[9px] font-extrabold text-amber-750 bg-amber-50/50 rounded-lg px-2.5 py-1.5 mb-4 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 shrink-0 text-amber-600 mt-0.5" />
                            <span>Out of stock in your selected tower. Express sourcing from {routeDetails.city} node.</span>
                          </div>
                        ) : medicine.availability === "Limited Stock" ? (
                          <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#FB6C3F] bg-[#FB6C3F]/5 rounded-lg px-2.5 py-1 mb-4 border border-[#FB6C3F]/10">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Only 2 items left at store</span>
                          </div>
                        ) : null}
                      </div>

                      {/* Pricing and Action row */}
                      <div className="mt-auto border-t border-stone-100 pt-4 flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5 mb-0.5">
                            <span className="text-lg font-black text-[#554D45]">₹{routeDetails.price}</span>
                            <span className="text-xs text-stone-400 line-through font-semibold">₹{routeDetails.mrp}</span>
                          </div>
                          <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
                            {routeDetails.discount}% OFF
                          </span>
                        </div>

                        {/* Add to Cart controller */}
                        <div>
                          {qtyInCart === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addItem(medicine);
                              }}
                              className={`rounded-full py-2.5 px-5 font-black text-xs transition-all active:scale-95 shadow-sm border-none text-white ${activeColorClass}`}
                            >
                              ADD TO CART
                            </button>
                          ) : (
                            <div 
                              onClick={(e) => e.stopPropagation()}
                              className={`flex items-center rounded-full overflow-hidden text-xs shadow-sm ${counterColorClass} text-white`}
                            >
                              <button 
                                onClick={() => updateQuantity(medicine.id, qtyInCart - 1)}
                                className="px-3 py-2 hover:bg-black/10 transition-all font-black text-sm"
                              >
                                <Minus className="w-3 h-3" strokeWidth={3} />
                              </button>
                              <span className="px-2.5 font-extrabold text-xs">{qtyInCart}</span>
                              <button 
                                onClick={() => updateQuantity(medicine.id, qtyInCart + 1)}
                                className="px-3 py-2 hover:bg-black/10 transition-all font-black text-sm"
                              >
                                <Plus className="w-3 h-3" strokeWidth={3} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-stone-200 max-w-xl mx-auto shadow-sm">
                <div className="text-5xl mb-4">🔬</div>
                <h3 className="font-black text-lg text-[#554D45]">No active stock in selected radius</h3>
                <p className="text-stone-400 text-xs mt-1 max-w-xs mx-auto">
                  Adjust active cell-tower location area or modify your search query.
                </p>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* Floating Shopping Cart Summary Bar for Mobile */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div 
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className={`fixed bottom-4 left-4 right-4 md:hidden text-white rounded-2xl shadow-xl flex items-center justify-between p-4.5 z-40 border ${
              routingMode === "FASTEST" ? "bg-[#FB6C3F] border-[#e0592b]" : "bg-[#5B8C5A] border-[#4a7249]"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-xl relative">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 flex items-center justify-center p-0.5 text-[8px] font-black bg-rose-500 text-white rounded-full">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-xs font-bold opacity-90">Shopping Cart</p>
                <p className="text-sm font-black">₹{cartTotal} Total</p>
              </div>
            </div>
            
            <button 
              onClick={() => setCartOpen(true)}
              className="bg-white text-slate-900 font-black text-xs px-6 py-2.5 rounded-xl transition-all active:scale-95 shadow"
            >
              Proceed
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedDetailsMedicine && (() => {
        const cartItem = cartItems.find(i => i.medicine.id === selectedDetailsMedicine.id);
        const qtyInCart = cartItem ? cartItem.quantity : 0;
        const routeDetails = getMappedStore(selectedDetailsMedicine);
        const activeColorClass = routingMode === "FASTEST" ? "bg-[#FB6C3F] hover:bg-[#e0592b]" : "bg-[#5B8C5A] hover:bg-[#4a7249]";
        const counterColorClass = routingMode === "FASTEST" ? "bg-[#FB6C3F] border-[#FB6C3F]" : "bg-[#5B8C5A] border-[#5B8C5A]";
        const enrichedMed = enrichMedicineDetails(selectedDetailsMedicine);
        
        return (
          <Dialog 
            open={!!selectedDetailsMedicine} 
            onOpenChange={(open) => {
              if (!open) setSelectedDetailsMedicine(null);
            }}
          >
            <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-auto p-0 rounded-[2.5rem] border-[#f0eae1] bg-white shadow-2xl flex flex-col gap-0">
              
              {/* Header Image/Emoji banner (Premium Card Style) */}
              <div className="relative w-full h-56 bg-[#FCFBF9] flex items-center justify-center border-b border-[#f0eae1] p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#f0eae1_1px,_transparent_1px)] [background-size:20px_20px] opacity-40" />
                
                {/* Brand and Category tags at top */}
                <div className="absolute top-5 left-6 right-6 flex justify-between items-center z-10">
                  <span className="text-[10px] text-stone-400 font-extrabold uppercase tracking-widest bg-white border border-[#f0eae1] px-3 py-1 rounded-full shadow-sm">
                    {selectedDetailsMedicine.manufacturer}
                  </span>
                  
                  {selectedDetailsMedicine.requiresPrescription ? (
                    <Badge className="bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-50 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      [Rx] Prescription Required
                    </Badge>
                  ) : (
                    <Badge className="bg-stone-50 border border-stone-150 text-stone-500 hover:bg-stone-50 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                      OTC Medicine
                    </Badge>
                  )}
                </div>

                {/* Circular image floating in the center */}
                <div className="relative h-32 w-32 bg-white rounded-3xl border border-[#f0eae1] p-3 flex items-center justify-center shadow-md mt-6">
                  <MedicineImage 
                    src={selectedDetailsMedicine.image}
                    category={selectedDetailsMedicine.category}
                    alt={selectedDetailsMedicine.name}
                    className="h-26 w-26 object-contain"
                  />
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Title & Dosage */}
                <div className="space-y-1">
                  <h3 className="font-extrabold text-2xl text-[#554D45] leading-snug">
                    {selectedDetailsMedicine.name}
                  </h3>
                  <p className="text-xs text-stone-400 font-bold">
                    {selectedDetailsMedicine.dosage}
                  </p>
                </div>

                {/* Composition/Salt */}
                <div className="p-4 rounded-2xl bg-[#FCFBF9] border border-[#f0eae1] space-y-1">
                  <span className="text-[9px] text-stone-400 font-extrabold uppercase tracking-wider block">Chemical Molecules (Salt)</span>
                  <span className="font-extrabold text-[#554D45] text-sm leading-normal block">
                    🧪 {selectedDetailsMedicine.salt}
                  </span>
                </div>

                {/* Primary Uses & Side Effects */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Medical Uses */}
                  <div className="p-4.5 rounded-2xl bg-emerald-50/20 border border-emerald-100/50 space-y-2 flex-1">
                    <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      👍 Medical Uses
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {enrichedMed.medicalUses.map((use, i) => (
                        <li key={i} className="text-xs font-semibold text-stone-600 flex items-start gap-1.5">
                          <span className="text-emerald-600 mt-0.5">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Side Effects */}
                  <div className="p-4.5 rounded-2xl bg-rose-50/20 border border-rose-100/50 space-y-2 flex-1">
                    <span className="text-[10px] text-rose-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
                      ⚠️ Side Effects
                    </span>
                    <ul className="space-y-1.5 pl-1">
                      {enrichedMed.sideEffects.map((effect, i) => (
                        <li key={i} className="text-xs font-semibold text-stone-600 flex items-start gap-1.5">
                          <span className="text-rose-500 mt-0.5">•</span>
                          <span>{effect}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Substitutes */}
                <div className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block px-1">Equivalent Substitutes</span>
                  <div className="flex flex-wrap gap-2 p-3 bg-[#FCFBF9] border border-[#f0eae1] rounded-2xl">
                    {enrichedMed.substitutes.map((sub, i) => (
                      <span key={i} className="text-xs font-extrabold bg-white border border-[#f0eae1] text-stone-600 hover:text-[#5B8C5A] hover:border-[#5B8C5A]/35 hover:shadow-sm px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 select-none">
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
                    <div className="p-3.5 bg-[#FCFBF9] border border-[#f0eae1] rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase">Alcohol</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          enrichedMed.safetyWarnings.alcohol.toLowerCase().startsWith("unsafe")
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {enrichedMed.safetyWarnings.alcohol.toLowerCase().startsWith("unsafe") ? "Unsafe" : "Caution"}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-650 leading-relaxed pt-1">{enrichedMed.safetyWarnings.alcohol}</p>
                    </div>

                    {/* Pregnancy */}
                    <div className="p-3.5 bg-[#FCFBF9] border border-[#f0eae1] rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-stone-400 font-extrabold uppercase">Pregnancy</span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                          enrichedMed.safetyWarnings.pregnancy.toLowerCase().startsWith("unsafe")
                            ? "bg-rose-50 text-rose-600 border border-rose-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        }`}>
                          {enrichedMed.safetyWarnings.pregnancy.toLowerCase().startsWith("unsafe") ? "Unsafe" : "Safe/Caution"}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-650 leading-relaxed pt-1">{enrichedMed.safetyWarnings.pregnancy}</p>
                    </div>

                    {/* Driving */}
                    <div className="p-3.5 bg-[#FCFBF9] border border-[#f0eae1] rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#776c60] font-extrabold uppercase">Driving</span>
                        <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase px-2 py-0.5 rounded">
                          Safe
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-650 leading-relaxed pt-1">{enrichedMed.safetyWarnings.driving}</p>
                    </div>

                    {/* Kidney/Liver */}
                    <div className="p-3.5 bg-[#FCFBF9] border border-[#f0eae1] rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[#776c60] font-extrabold uppercase">Kidney & Liver</span>
                        <span className="text-[9px] font-black bg-amber-50 text-amber-600 border border-amber-100 uppercase px-2 py-0.5 rounded">
                          Caution
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-stone-650 leading-relaxed pt-1">{enrichedMed.safetyWarnings.kidneyLiver}</p>
                    </div>
                  </div>
                </div>

                {/* Hyperlocal Store Routing Details (Directly matching the style of card) */}
                <div className="space-y-2.5">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold text-stone-400 block px-1">Fulfillment Router Details</span>
                  <div className={`border rounded-[1.75rem] p-4.5 space-y-3.5 ${routeDetails.isInterCity ? "bg-amber-50/60 border-amber-250" : "bg-[#FCFBF9] border-[#f0eae1]"}`}>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-stone-150/40 pb-3">
                      <div>
                        <span className="text-[9px] text-stone-400 font-extrabold uppercase block">Fulfillment Store</span>
                        <span className="font-extrabold text-stone-850 text-xs sm:text-sm mt-0.5 flex items-center gap-1.5">
                          🏪 {routeDetails.store.name}
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[9px] text-stone-400 font-extrabold uppercase block">Delivery Duration</span>
                        <span className={`font-black ${routeDetails.isInterCity ? "text-amber-700" : "text-[#5B8C5A]"} text-xs sm:text-sm mt-0.5 flex items-center sm:justify-end gap-1.5`}>
                          ⏱️ {routeDetails.eta} mins
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-bold text-stone-650">
                      <div>
                        <span className="text-[9px] text-stone-400 font-extrabold uppercase block">Sourcing Distance</span>
                        <span className="font-extrabold text-stone-800 mt-0.5 block">📍 {routeDetails.distance.toFixed(1)} km away</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-stone-400 font-extrabold uppercase block">Delivery Charge</span>
                        <span className="font-extrabold text-stone-800 mt-0.5 block">₹{routeDetails.store.deliveryFee}</span>
                      </div>
                      {routeDetails.isInterCity && (
                        <div className="col-span-2 sm:col-span-1">
                          <span className="text-[9px] text-stone-400 font-extrabold uppercase block">Source City</span>
                          <span className="font-extrabold text-amber-700 mt-0.5 block">{routeDetails.city} Node</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Routing status & warnings */}
                <div className="flex flex-wrap gap-2">
                  {routeDetails.isInterCity ? (
                    <div className="flex items-start gap-2 text-[10px] font-extrabold text-amber-750 bg-amber-50/50 rounded-xl p-3 border border-amber-200 w-full">
                      <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                      <span>Out of stock locally. Sourced from the next closest node in {routeDetails.city}. Delivery fees adjusted dynamically.</span>
                    </div>
                  ) : selectedDetailsMedicine.availability === "Limited Stock" ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#FB6C3F] bg-[#FB6C3F]/5 rounded-xl px-3 py-2 border border-[#FB6C3F]/10 w-full">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Only 2 items left at the selected store counter.</span>
                    </div>
                  ) : null}

                  {!routeDetails.isInterCity && (
                    <div className="flex flex-wrap gap-1.5 w-full">
                      {routingMode === "FASTEST" ? (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#FB6C3F] bg-[#FB6C3F]/5 border border-[#FB6C3F]/20 px-3 py-1 rounded-full">
                          ⚡ Express Emergency Routing Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold text-[#5B8C5A] bg-[#5B8C5A]/5 border border-[#5B8C5A]/20 px-3 py-1 rounded-full">
                          💰 Lowest Price Guarantee Active
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Price and quantity controller section */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-stone-150">
                  <div className="flex flex-col">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Best Price</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-black text-[#554D45]">
                        ₹{routeDetails.price}
                      </span>
                      <span className="text-sm text-stone-400 line-through font-semibold">
                        ₹{routeDetails.mrp}
                      </span>
                      <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 text-xs font-black border border-emerald-100">
                        {routeDetails.discount}% OFF
                      </Badge>
                    </div>
                    {routeDetails.mrp - routeDetails.price > 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
                        You save ₹{routeDetails.mrp - routeDetails.price}!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    {qtyInCart === 0 ? (
                      <Button
                        size="lg"
                        className={`w-full sm:w-auto font-black h-12 text-xs transition-all active:scale-[0.98] shadow-md text-white rounded-xl ${activeColorClass} px-8 border-none`}
                        onClick={() => addItem(selectedDetailsMedicine)}
                      >
                        ADD TO CART
                      </Button>
                    ) : (
                      <div className={`flex items-center rounded-xl overflow-hidden text-xs shadow-md ${counterColorClass} text-white h-12`}>
                        <button 
                          onClick={() => updateQuantity(selectedDetailsMedicine.id, qtyInCart - 1)}
                          className="px-4 py-3 hover:bg-black/10 transition-all font-black text-sm h-full flex items-center justify-center"
                        >
                          <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                        <span className="px-4 font-extrabold text-sm min-w-[36px] text-center">{qtyInCart}</span>
                        <button 
                          onClick={() => updateQuantity(selectedDetailsMedicine.id, qtyInCart + 1)}
                          className="px-4 py-3 hover:bg-black/10 transition-all font-black text-sm h-full flex items-center justify-center"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

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
            className="fixed inset-0 z-[100] flex items-center justify-center p-3.5 bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl sm:rounded-[3rem] p-4 sm:p-10 max-w-lg w-full shadow-2xl space-y-5 sm:space-y-8 relative overflow-hidden"
            >
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4">
                     <div className="h-10 w-10 sm:h-12 sm:w-12 bg-indigo-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
                        📋
                     </div>
                     <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Prescription Compliance</h3>
                  </div>
                  <button onClick={() => { setPrescriptionOpen(false); setScanning(false); }} className="text-slate-400 hover:text-slate-900 shrink-0">
                     <XCircle className="h-6 w-6" />
                  </button>
               </div>

               {!scanning ? (
                 <div className="space-y-5 sm:space-y-6">
                    <label htmlFor="file-upload" className="block border-2 border-dashed border-indigo-200 rounded-xl sm:rounded-[2.5rem] p-5 sm:p-12 text-center space-y-3 sm:space-y-4 hover:border-indigo-450 transition-colors cursor-pointer group">
                       <div className="h-14 w-14 sm:h-20 sm:w-20 bg-slate-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto text-slate-450 group-hover:text-indigo-600 transition-colors">
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
                            const words = extractedText.replace(/\n/g, " ").split(" ").filter(w => w.length > 3);
                            const matchedMeds = new Map<string, Medicine>();
                            
                            words.forEach(word => {
                              const matches = fuseIndex.search(word);
                              if (matches.length > 0 && matches[0].score !== undefined && matches[0].score <= 0.45) {
                                  matchedMeds.set(matches[0].item.id, matches[0].item);
                              }
                            });
                            
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
                      className="w-full h-12 sm:h-14 rounded-2xl font-black text-base sm:text-lg bg-[#5B8C5A] hover:bg-[#4a7249] text-white"
                      onClick={() => {
                        // Start a simulated scan with a mockup prescription for instant testing
                        setScanning(true);
                        setOcrProgress({ status: "Reading demo prescription...", progress: 10 });
                        setDetectedMedicines([]);
                        
                        setTimeout(() => {
                          setOcrProgress({ status: "Extracting active ingredients...", progress: 45 });
                        }, 800);
                        
                        setTimeout(() => {
                          setOcrProgress({ status: "Matching molecules to nearby stocks...", progress: 80 });
                        }, 1600);
                        
                        setTimeout(() => {
                          // Select some common medicines as detected (Paracetamol, Azithromycin, Telmisartan)
                          const demoMeds = MEDICINES.filter(m => 
                            m.id === "m1" || m.id === "m2" || m.id === "m3"
                          );
                          setDetectedMedicines(demoMeds);
                          setOcrProgress({ status: "Complete", progress: 100 });
                        }, 2400);
                      }}
                    >
                      Process Prescription
                    </Button>
                 </div>
               ) : (
                  <div className="space-y-6 sm:space-y-8 py-6 sm:py-10">
                     <div className="relative h-48 sm:h-64 w-full bg-slate-50 rounded-2xl sm:rounded-[2.5rem] overflow-hidden flex items-center justify-center">
                       {ocrProgress.status !== "Complete" && (
                         <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent animate-scan z-10" />
                       )}
                       <div className="text-6xl sm:text-8xl opacity-20 grayscale select-none">📄</div>
                       
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
                              className="absolute p-2 bg-emerald-600 text-white rounded-lg text-[9px] font-black uppercase shadow-lg z-20"
                            >
                              {med.name} Detected
                            </motion.div>
                          );
                       })}
                     </div>

                     <div className="text-center space-y-1.5">
                        <h4 className="text-base sm:text-lg font-black text-slate-900">
                          {ocrProgress.status === "Complete" ? "Scan Complete!" : "AI Scanning..."}
                        </h4>
                        <p className="text-xs text-slate-500 font-medium">
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
                          className="w-full h-12 sm:h-14 rounded-2xl font-black text-sm sm:text-lg gap-2 bg-[#5B8C5A] hover:bg-[#4a7249] text-white"
                          disabled={ocrProgress.status !== "Complete"}
                          onClick={() => { 
                            if (detectedMedicines.length > 0) {
                              setPrescriptionFilters(detectedMedicines.map(m => m.id));
                            }
                            setPrescriptionOpen(false); 
                            setScanning(false); 
                          }}
                        >
                           Apply Matches <ArrowUpRight className="h-5 w-5" />
                        </Button>
                     </motion.div>
                  </div>
               )}

               <div className="bg-[#FCFBF9] p-6 rounded-2xl flex items-center gap-4 border border-[#f0eae1]">
                  <ShieldCheck className="h-6 w-6 text-[#5B8C5A] shrink-0" />
                  <p className="text-xs font-bold text-stone-500 leading-relaxed">
                    Your prescription is handled securely and only shared with verified pharmacists for fulfillment.
                  </p>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standardized B2B Partner Onboarding Section */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-12 mb-6">
        <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 hover:border-slate-700 transition-all duration-300 shadow-xl group">
          <div className="flex-1 text-left">
            <h2 className="text-xl font-bold text-white">
              Local Retail Pharmacy Owner? Upgrade to an Intelligent Digital Counter.
            </h2>
            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
              Onboard your retail pharmacy medical stock indices. Get our premium, offline-first desktop POS billing software entirely free and fulfill 30-minute hyper-local patient orders (within 1-2 km).
            </p>
          </div>
          <Link href="/register/chemist" className="w-full md:w-auto shrink-0">
            <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer whitespace-nowrap">
              Register as Partner Chemist 🏪
            </button>
          </Link>
        </div>
      </div>
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
