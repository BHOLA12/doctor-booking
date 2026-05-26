"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, MapPin } from "lucide-react";

const LOCATION_DATA: Record<string, string[]> = {
  "Bihar": ["Jehanabad", "Patna", "Gaya"],
  "Delhi": ["New Delhi", "Rohini"],
};

export default function HospitalSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState(searchParams.get("state") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [q, setQ] = useState(searchParams.get("q") || "");

  // Update cities list based on selected state
  const cities = state ? LOCATION_DATA[state] || [] : [];

  // Reset city if it doesn't belong to the selected state
  useEffect(() => {
    if (state && !LOCATION_DATA[state]?.includes(city)) {
      setCity("");
    }
  }, [state, city]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (state) params.set("state", state);
    if (city) params.set("city", city);
    router.push(`/hospitals?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2 rounded-3xl shadow-xl">
      
      {/* 1. SELECT STATE */}
      <div className="flex-1 flex items-center gap-2 px-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-2 md:pb-0">
        <MapPin className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">State</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-0 p-0 cursor-pointer"
          >
            <option value="">All States</option>
            {Object.keys(LOCATION_DATA).map((s) => (
              <option key={s} value={s} className="bg-white dark:bg-slate-950">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2. SELECT CITY/LOCATION */}
      <div className="flex-1 flex items-center gap-2 px-3 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-2 md:pb-0">
        <MapPin className="h-4.5 w-4.5 text-teal-500 shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">City / Location</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!state}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-0 p-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">{state ? "All Cities" : "Select State First"}</option>
            {cities.map((c) => (
              <option key={c} value={c} className="bg-white dark:bg-slate-950">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. INPUT KEYWORD (HOSPITAL NAME) */}
      <div className="flex-[1.5] flex items-center gap-2 px-3 pb-2 md:pb-0">
        <Search className="h-4.5 w-4.5 text-slate-400 shrink-0" />
        <div className="flex-1 text-left">
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Search Hospital</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 text-sm font-bold focus:outline-none focus:ring-0 p-0 placeholder-slate-400"
          />
        </div>
      </div>

      {/* 4. SEARCH BUTTON */}
      <button
        onClick={handleSearch}
        className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-white font-bold text-sm uppercase tracking-wider rounded-2xl transition-all duration-300 shadow-md hover:shadow-teal-500/10 active:scale-[0.98] cursor-pointer"
      >
        Search
      </button>

    </div>
  );
}
