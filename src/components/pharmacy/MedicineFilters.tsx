"use client";

import { useState } from "react";
import { 
  ChevronRight, 
  Search, 
  Filter, 
  ChevronDown,
  Circle,
  CheckCircle2,
  Thermometer,
  Zap,
  Activity,
  Heart,
  Droplets,
  Stethoscope,
  Pill,
  Leaf
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterProps {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  discountOnly: boolean;
  onDiscountChange: (val: boolean) => void;
}

const CATEGORIES = [
  { name: "Pain Relief", icon: Zap, color: "text-emerald-600 bg-emerald-50" },
  { name: "Fever", icon: Thermometer, color: "text-blue-600 bg-blue-50" },
  { name: "Cough & Cold", icon: Droplets, color: "text-sky-600 bg-sky-50" },
  { name: "Antibiotics", icon: Activity, color: "text-indigo-600 bg-indigo-50" },
  { name: "Vitamins & Supplements", icon: Heart, color: "text-rose-600 bg-rose-50" },
  { name: "Diabetes Care", icon: Stethoscope, color: "text-orange-600 bg-orange-50" },
  { name: "Ayurveda", icon: Leaf, color: "text-teal-600 bg-teal-50" },
  { name: "Health Devices", icon: Activity, color: "text-slate-600 bg-slate-50" },
];

const BRANDS = [
  { name: "GSK", count: 12 },
  { name: "Crocin", count: 8 },
  { name: "Paracetamol", count: 6 },
  { name: "Dolo", count: 5 },
];

export default function MedicineFilters({
  activeCategory,
  onCategoryChange,
  selectedBrands,
  onBrandChange,
  priceRange,
  onPriceChange,
  discountOnly,
  onDiscountChange
}: FilterProps) {
  return (
    <div className="w-full space-y-6">
      {/* Categories */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-1">Categories</h3>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryChange(cat.name)}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all duration-300 group ${
                activeCategory === cat.name 
                  ? "bg-teal-50/80 text-teal-800 shadow-sm shadow-teal-600/[0.02]" 
                  : "hover:bg-slate-50/80 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  activeCategory === cat.name 
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/10" 
                    : "bg-white border border-slate-100 group-hover:bg-slate-100"
                }`}>
                  <cat.icon className="h-4 w-4" />
                </div>
                <span className={`font-bold text-xs transition-colors duration-300 ${
                  activeCategory === cat.name ? "text-teal-800 font-extrabold" : "text-slate-600"
                }`}>
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
          <button className="w-full flex items-center justify-between p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50/60 transition-all group">
             <span className="font-extrabold text-[10px] uppercase tracking-wider pl-11 group-hover:text-slate-600 transition-colors">View All</span>
             <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      <div className="h-[1px] bg-slate-100/80 w-full" />

      {/* Filters Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pl-1">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Filters</h3>
          <button 
            onClick={() => {
              onCategoryChange("All");
              // Reset other filters
            }}
            className="text-teal-600 font-extrabold text-xs uppercase tracking-widest hover:text-teal-700 transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Brand Filter */}
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider pl-1">Brand</h4>
          <div className="space-y-3">
            {BRANDS.map((brand) => (
              <label key={brand.name} className="flex items-center gap-3 cursor-pointer group pl-1">
                 <div className="relative flex items-center justify-center">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 rounded-full border-2 border-slate-200 checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer appearance-none focus:outline-none"
                      checked={selectedBrands.includes(brand.name)}
                      onChange={() => onBrandChange(brand.name)}
                    />
                    <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                 </div>
                 <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                   {brand.name} <span className="text-slate-400 font-medium ml-1">({brand.count})</span>
                 </span>
              </label>
            ))}
          </div>
          <button className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-wider pt-2 pl-1 transition-colors">
            View More <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {/* Price Filter */}
        <div className="space-y-5 pt-2">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider pl-1">Price</h4>
          <div className="space-y-4 px-2">
             <div className="relative h-1 w-full bg-slate-100 rounded-full">
                <div 
                  className="absolute h-full bg-teal-600 rounded-full" 
                  style={{ 
                    left: `${(priceRange[0] / 500) * 100}%`, 
                    right: `${100 - (priceRange[1] / 500) * 100}%` 
                  }} 
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[0]}
                  onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
                  className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                />
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={priceRange[1]}
                  onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                  className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-teal-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                />
             </div>
             <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500">
                <span className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">₹{priceRange[0]}</span>
                <span className="bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">₹{priceRange[1]}</span>
             </div>
          </div>
        </div>

        {/* Discount Filter */}
        <div className="space-y-4 pt-4">
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider pl-1">Discount</h4>
          <label className="flex items-center gap-3 cursor-pointer group pl-1">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  className="peer h-5 w-5 rounded-full border-2 border-slate-200 checked:bg-teal-600 checked:border-teal-600 transition-all cursor-pointer appearance-none focus:outline-none"
                  checked={discountOnly}
                  onChange={(e) => onDiscountChange(e.target.checked)}
                />
                <CheckCircle2 className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                10% and above <span className="text-slate-400 font-medium ml-1">(25)</span>
              </span>
          </label>
        </div>
      </div>
    </div>
  );
}
