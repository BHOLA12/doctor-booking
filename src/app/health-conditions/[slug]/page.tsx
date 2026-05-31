"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, 
  Search, 
  LayoutGrid, 
  Building2, 
  ArrowLeft, 
  Filter,
  Package,
  TrendingUp,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ConditionMedicineCard from "@/components/medicines/ConditionMedicineCard";
import BrandCard from "@/components/medicines/BrandCard";
import BrandPickerSheet from "@/components/medicines/BrandPickerSheet";
import { 
  PROBLEM_CATEGORIES, 
  getConditionData, 
  getBrandsBySalt,
  getMedicinesByBrand,
  type ConditionMedicine
} from "@/lib/problem-categories-data";

export default function ConditionDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [navMode, setNavMode] = useState<"medicine" | "brand">("medicine");
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [apiMedicines, setApiMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Brand Picker Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeMedicine, setActiveMedicine] = useState<{ name: string; salt: string } | null>(null);

  const category = useMemo(() => 
    PROBLEM_CATEGORIES.find(c => c.slug === slug), 
  [slug]);

  const data = useMemo(() => 
    category ? getConditionData(category.slug) : null, 
  [category]);

  const searchQuery = useMemo(() => {
    if (!category) return "";
    const label = category.label;
    if (label === "Heart Care") return "Heart & BP";
    if (label === "Stomach Care") return "Digestive Health";
    if (label === "Derma Care") return "Skin Care";
    if (label === "Bone & Joint") return "Vitamins & Supplements";
    if (label === "Liver Care") return "Vitamins & Supplements";
    if (label === "Kidney Care") return "Vitamins & Supplements";
    if (label === "Neuro & Brain") return "Neuro & Brain";
    if (label === "Thyroid Care") return "Thyroid Care";
    if (label === "Women Health") return "Women Health";
    if (label === "Child Care") return "Child Care";
    if (label === "Ayurveda & Herbal") return "Ayurveda & Herbal";
    return label;
  }, [category]);

  useEffect(() => {
    if (!category || !searchQuery) return;
    async function fetchMedicines() {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?category=medicines&q=${encodeURIComponent(searchQuery)}&limit=30`);
        if (res.ok) {
          const result = await res.json();
          if (result.results && Array.isArray(result.results.medicines)) {
            setApiMedicines(result.results.medicines);
          }
        }
      } catch (err) {
        console.error("Failed to fetch medicines from search API:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMedicines();
  }, [category, searchQuery]);

  const filteredMedicines = useMemo(() => {
    if (!data) return [];
    let list = apiMedicines;
    
    if (navMode === "brand" && selectedBrand) {
      list = list.filter(m => {
        const brand = data.brands.find(b => b.id === selectedBrand);
        return m.manufacturer?.toLowerCase().includes(brand?.name.toLowerCase() || "");
      });
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.salt.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [data, apiMedicines, navMode, selectedBrand, search]);

  if (!category || !data || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading medical data...</p>
      </div>
    );
  }

  const openBrandPicker = (medicine: ConditionMedicine) => {
    setActiveMedicine({ name: medicine.name, salt: medicine.salt });
    setSheetOpen(true);
  };

  const activeBrandsForSheet = activeMedicine 
    ? getBrandsBySalt(activeMedicine.salt, category.id) 
    : [];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Category Hero Banner */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${category.color} border-b border-slate-200/50`}>
        {/* Decorative background glow shapes */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-80 w-80 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-64 w-64 bg-primary/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/40 shadow-sm hover:bg-white hover:scale-105 active:scale-95 transition-all"
            >
              <ArrowLeft className="h-5 w-5 text-slate-700" />
            </button>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/30">
              Condition Care
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-3 mb-4">
                <span className="text-4xl md:text-5xl select-none filter drop-shadow-sm">{category.emoji}</span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight animate-fade-in">
                  {category.label}
                </h1>
              </div>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                {category.description}
              </p>
              
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200/20 text-xs font-bold text-slate-700 shadow-sm">
                  <span className="text-emerald-500">✓</span> 100% Genuine Medicines
                </div>
                <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-slate-200/20 text-xs font-bold text-slate-700 shadow-sm">
                  <span className="text-emerald-500">✓</span> Verified Brands
                </div>
              </div>
            </div>

            {/* Large 3D Illustration on detail page */}
            <div className="relative flex h-36 w-36 md:h-44 md:w-44 items-center justify-center rounded-3xl bg-white border border-slate-200/60 shadow-xl shadow-slate-100/80 overflow-hidden shrink-0 transition-transform duration-500 hover:scale-105">
              {category.image ? (
                <Image 
                  src={category.image} 
                  alt={category.label} 
                  fill 
                  sizes="(max-width: 768px) 144px, 176px" 
                  className="object-contain p-3.5" 
                  priority
                />
              ) : (
                <span className="text-6xl select-none">{category.emoji}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search and Filter Controls */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <Tabs 
              value={navMode} 
              onValueChange={(v) => {
                setNavMode(v as "medicine" | "brand");
                setSelectedBrand(null);
              }}
              className="w-full md:w-auto"
            >
              <TabsList className="bg-slate-100 p-1 h-12 rounded-2xl w-full">
                <TabsTrigger value="medicine" className="rounded-xl flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                  <LayoutGrid className="h-4 w-4" /> By Medicine
                </TabsTrigger>
                <TabsTrigger value="brand" className="rounded-xl flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                  <Building2 className="h-4 w-4" /> By Brand
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder={`Search in ${category.label}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-12 rounded-2xl border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 transition-all font-medium text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for Brands Flow */}
          {navMode === "brand" && (
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-40 space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Top Brands</h3>
                  {selectedBrand && (
                    <button 
                      onClick={() => setSelectedBrand(null)}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Clear Filter
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {data.brands.map((brand) => (
                    <BrandCard 
                      key={brand.id}
                      brand={brand}
                      isSelected={selectedBrand === brand.id}
                      onClick={() => setSelectedBrand(brand.id === selectedBrand ? null : brand.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results Area */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-bold text-slate-800">
                  {navMode === "medicine" ? "Recommended Medicines" : "Medicines by Brand"}
                </h2>
                <Badge variant="outline" className="ml-2 font-bold bg-white">{filteredMedicines.length}</Badge>
              </div>
              
              {navMode === "medicine" && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <TrendingUp className="h-3 w-3" /> Best Prices Guaranteed
                </div>
              )}
            </div>

            {filteredMedicines.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredMedicines.map((m) => (
                  <ConditionMedicineCard 
                    key={m.id} 
                    medicine={m} 
                    onViewBrands={() => openBrandPicker(m)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[2rem] border border-dashed border-slate-200">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-xl font-bold text-slate-800">No medicines found</h3>
                <p className="text-slate-500 mt-2 max-w-xs">
                  We couldn&apos;t find any matches for &quot;{search}&quot; in this category.
                </p>
                <Button variant="link" className="mt-4" onClick={() => setSearch("")}>
                  Clear search and show all
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Comparison Sheet */}
      {activeMedicine && (
        <BrandPickerSheet 
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          medicineName={activeMedicine.name}
          saltName={activeMedicine.salt}
          brands={activeBrandsForSheet as any}
        />
      )}
    </div>
  );
}
