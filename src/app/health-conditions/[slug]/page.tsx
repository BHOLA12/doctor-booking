"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
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
  
  // Brand Picker Sheet state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeMedicine, setActiveMedicine] = useState<{ name: string; salt: string } | null>(null);

  const category = useMemo(() => 
    PROBLEM_CATEGORIES.find(c => c.slug === slug), 
  [slug]);

  const data = useMemo(() => 
    category ? getConditionData(category.slug) : null, 
  [category]);

  const filteredMedicines = useMemo(() => {
    if (!data) return [];
    let list = data.medicines;
    
    if (navMode === "brand" && selectedBrand) {
      list = getMedicinesByBrand(selectedBrand, category!.id);
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.salt.toLowerCase().includes(q)
      );
    }
    
    return list;
  }, [data, navMode, selectedBrand, search, category]);

  if (!category || !data) {
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
      {/* Category Header */}
      <div className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => router.back()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </button>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 text-2xl">
              {category.emoji}
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900">{category.label}</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-tighter">Condition Specific Solutions</p>
            </div>
          </div>

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
                <TabsTrigger value="medicine" className="rounded-xl flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <LayoutGrid className="h-4 w-4" /> By Medicine
                </TabsTrigger>
                <TabsTrigger value="brand" className="rounded-xl flex-1 gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
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
                className="pl-10 h-12 rounded-2xl border-slate-200 bg-white focus:ring-4 focus:ring-primary/10 transition-all"
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
