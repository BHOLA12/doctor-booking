"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LabBookingModal from "@/components/shared/LabBookingModal";
import { useDebounce } from "@/hooks/useDebounce";
import { LAB_TESTS, type LabTest } from "@/lib/lab-tests-data";
import { 
  Search, 
  Home, 
  Clock, 
  Shield, 
  ChevronRight, 
  Lock,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

// Setup Fuse Search Index
const fuseIndex = new Fuse<LabTest>(LAB_TESTS, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "category", weight: 0.25 },
    { name: "description", weight: 0.15 },
    { name: "testsIncluded", weight: 0.1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

// Category definition matching health risks with database categories
const HEALTH_RISKS = [
  {
    id: "All",
    name: "All Tests",
    dbCategory: "All",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    )
  },
  {
    id: "Heart",
    name: "Heart Care",
    dbCategory: "Heart",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  },
  {
    id: "Diabetes",
    name: "Diabetes",
    dbCategory: "Diabetes",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: "Liver",
    name: "Liver Profile",
    dbCategory: "Liver & Kidney",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18M3 12h18" />
      </svg>
    )
  },
  {
    id: "Bone",
    name: "Bone & Joint",
    dbCategory: "Thyroid", // Fallback to Thyroid or general categories in database
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
      </svg>
    )
  },
  {
    id: "FullBody",
    name: "Full Body Check",
    dbCategory: "Full Body",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    id: "Brain",
    name: "Brain Health",
    dbCategory: "Blood Tests", // Mapping to blood tests for demonstration
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  }
];

export default function LabTestsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  const handleBook = (test: LabTest) => {
    setSelectedTest(test);
    setModalOpen(true);
  };

  const debouncedSearch = useDebounce(search, 300);
  const [filtered, setFiltered] = useState<LabTest[]>(LAB_TESTS);

  useEffect(() => {
    let results: LabTest[];
    if (!debouncedSearch.trim()) {
      results = LAB_TESTS;
    } else {
      results = fuseIndex.search(debouncedSearch).map((r) => r.item);
    }
    
    // Category Filter
    if (activeCategory !== "All") {
      const activeRisk = HEALTH_RISKS.find((r) => r.id === activeCategory);
      if (activeRisk && activeRisk.dbCategory !== "All") {
        results = results.filter((t) => t.category === activeRisk.dbCategory);
      }
    }

    // Sort logic
    const sorted = [...results];
    if (sortBy === "popularity") {
      sorted.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    } else if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount-high") {
      sorted.sort((a, b) => b.discount - a.discount);
    }

    setFiltered(sorted);
  }, [debouncedSearch, activeCategory, sortBy]);

  // Center Emoji Circular Icon configuration based on test
  const getCardIcon = (test: LabTest) => {
    if (test.name.includes("Full Body")) {
      return {
        bg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
        icon: (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a.75.75 0 00-.708.522L4.547 7.227a.75.75 0 01-.497.498L1.036 8.736a.75.75 0 00-.424 1.28l2.182 2.128a.75.75 0 01.216.663l-.515 3.018a.75.75 0 001.088.79l2.7-1.42a.75.75 0 01.698 0l2.7 1.42a.75.75 0 001.088-.79l-.515-3.018a.75.75 0 01.216-.663l2.182-2.128a.75.75 0 00-.424-1.28L11.95 7.725a.75.75 0 01-.497-.498l-1.012-3.25a.75.75 0 00-.708-.522L6.267 3.455z" clipRule="evenodd" />
            <path d="M10 2a1 1 0 011 1v1.323l.307-.81a1 1 0 011.886.666l-.88 2.348 2.05-.273a1 1 0 11.264 1.983l-2.77.37 1.57 2.355a1 1 0 11-1.664 1.11L10.3 9.406V18a1 1 0 11-2 0V9.406L6.83 12.392a1 1 0 01-1.664-1.11l1.57-2.355-2.77-.37a1 1 0 11.264-1.983l2.05.273-.88-2.348A1 1 0 017.29 3.513l.307.81V3a1 1 0 011-1z" />
          </svg>
        )
      };
    } else if (test.name.includes("Blood") || test.emoji === "🩸") {
      return {
        bg: "bg-red-50 text-red-500 border border-red-100",
        icon: (
          <svg className="w-7 h-7 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (test.name.includes("Thyroid") || test.emoji === "🦋") {
      return {
        bg: "bg-violet-50 text-violet-500 border border-violet-100",
        icon: (
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
        )
      };
    } else if (test.name.includes("Diabetes") || test.name.includes("HbA1c")) {
      return {
        bg: "bg-sky-50 text-sky-500 border border-sky-100",
        icon: (
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      };
    }
    
    // Fallback circular color styles
    return {
      bg: "bg-blue-50 text-blue-500 border border-blue-100",
      icon: <span className="text-xl">{test.emoji}</span>
    };
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafbfc]">
      
      {/* Search Bar Container */}
      <section className="bg-white border-b border-slate-100 py-6">
        <div className="max-w-xl mx-auto px-4">
          <div className="relative flex items-center bg-white border border-slate-200 rounded-full py-1.5 px-3.5 shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
            <Search className="h-5 w-5 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              placeholder="Search for tests, packages, or health risks (e.g., CBC, Thyroid...)"
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 text-sm text-slate-800 placeholder-slate-400 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Shop by Health Risks Navigation */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-8">
        <div className="mb-5">
          <h2 className="text-lg font-black text-slate-900 leading-tight">Shop by Health Risks</h2>
          <p className="text-xs text-slate-400">Filter tests based on health requirements</p>
        </div>

        {/* Scrollable list with scroll arrows */}
        <div className="relative flex items-center">
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-none w-full snap-x snap-mandatory">
            {HEALTH_RISKS.map((risk) => {
              const isActive = activeCategory === risk.id;
              return (
                <button
                  key={risk.id}
                  onClick={() => setActiveCategory(risk.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-bold transition-all shrink-0 snap-align-start ${
                    isActive
                      ? "bg-[#0a4d44] border-[#0a4d44] text-white shadow-sm"
                      : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-slate-500"}>
                    {risk.icon}
                  </span>
                  <span>{risk.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right arrow slide button */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-[#fafbfc] via-[#fafbfc]/85 to-transparent pl-8 pr-1 py-4 flex items-center">
            <button className="h-8 w-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-sm transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1">
        {/* Results Counter & Sort By */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-800 font-extrabold">{filtered.length} tests available</span>
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Sort by</span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-1.5 text-xs font-extrabold text-slate-700 outline-none focus:border-[#0a4d44] cursor-pointer shadow-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount-high">Discount: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Dynamic Cards matching image exactly */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((test) => {
              const cardIcon = getCardIcon(test);
              const totalParameters = test.testsIncluded.length * 4 + 4;

              return (
                <div 
                  key={test.id}
                  className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col group relative transition-all duration-300 hover:shadow-lg"
                >
                  {/* Top Left Popular Badge */}
                  {test.popular && (
                    <div className="absolute top-4 left-4">
                      <span className="inline-block text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-600">
                        ★ POPULAR
                      </span>
                    </div>
                  )}

                  {/* Circular Icon in Center-Top */}
                  <div className="mx-auto mt-2 mb-4 flex items-center justify-center">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center ${cardIcon.bg}`}>
                      {cardIcon.icon}
                    </div>
                  </div>

                  {/* Test Title Centered */}
                  <h3 className="font-extrabold text-base text-slate-900 text-center leading-snug mb-1 group-hover:text-[#0a4d44] transition-colors px-2">
                    {test.name}
                  </h3>

                  {/* Description Centered */}
                  <p className="text-[11px] text-slate-400 text-center line-clamp-2 leading-relaxed mb-5 px-3">
                    {test.description}
                  </p>

                  {/* Parameter Box (White background, thin border, details left-aligned) */}
                  <div className="border border-slate-100 rounded-2xl p-4 text-xs mb-6 bg-slate-50/20">
                    <div className="flex justify-between items-center mb-1.5 text-[11px]">
                      <span className="text-slate-400">Inclusions</span>
                      <span className="font-extrabold text-slate-800">{totalParameters} Parameters</span>
                    </div>
                    <div className="flex justify-between items-center mb-3.5 text-[11px]">
                      <span className="text-slate-400">Turnaround Time</span>
                      <span className="font-extrabold text-slate-800">Reports in {test.reportTime}</span>
                    </div>
                    
                    {/* Inclusions Badges */}
                    <div className="flex flex-wrap gap-1 border-t border-slate-100 pt-3">
                      {test.testsIncluded.slice(0, 3).map((item) => (
                        <span key={item} className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                          {item}
                        </span>
                      ))}
                      {test.testsIncluded.length > 3 && (
                        <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50/60 px-1.5 py-0.5 rounded hover:underline cursor-pointer">
                          +{test.testsIncluded.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price & Action row at bottom */}
                  <div className="mt-auto">
                    {/* Price Aligned Left */}
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-xl font-black text-[#0a4d44]">₹{test.price}</span>
                      <span className="text-xs text-slate-300 line-through font-semibold">₹{test.mrp}</span>
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ml-1">
                        {test.discount}% OFF
                      </span>
                    </div>

                    {/* Book Now Button (Teal, full-width) */}
                    <Button
                      onClick={() => handleBook(test)}
                      className="w-full bg-[#0a4d44] hover:bg-[#073630] text-white rounded-2xl py-3 font-bold transition-all active:scale-95 flex items-center justify-center gap-1.5 border-none shadow-sm"
                    >
                      Book Now
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 max-w-xl mx-auto shadow-sm">
            <div className="text-5xl mb-4">🔬</div>
            <h3 className="font-black text-lg text-slate-800">No matching tests found</h3>
            <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
              We couldn&apos;t find any lab tests matching your search. Please check your spelling or choose a health risk.
            </p>
            <Button 
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="mt-5 bg-[#0a4d44] hover:bg-[#073630] text-white font-bold px-6 rounded-xl"
            >
              Clear Search & Filters
            </Button>
          </div>
        )}
      </section>

      {/* Bottom Trust strip (4 micro-cards) */}
      <section className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Badge 1 */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8fafc]/50 border border-slate-100/50">
              <div className="p-2.5 bg-[#e6f4f2] text-[#0a4d44] rounded-xl shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-850">Trusted by millions</h4>
                <p className="text-[9px] text-slate-400">Accurate reports, every time</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8fafc]/50 border border-slate-100/50">
              <div className="p-2.5 bg-[#e6f4f2] text-[#0a4d44] rounded-xl shrink-0">
                <Home className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-850">Home sample collection</h4>
                <p className="text-[9px] text-slate-400">Convenient & hassle-free</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8fafc]/50 border border-slate-100/50">
              <div className="p-2.5 bg-[#e6f4f2] text-[#0a4d44] rounded-xl shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-850">Fast turnaround time</h4>
                <p className="text-[9px] text-slate-400">Get reports on time</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#f8fafc]/50 border border-slate-100/50">
              <div className="p-2.5 bg-[#e6f4f2] text-[#0a4d44] rounded-xl shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-[11px] text-slate-850">Secure & confidential</h4>
                <p className="text-[9px] text-slate-400">Your health is safe with us</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Online Doctor CTA Section */}
      <section className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 font-semibold text-xs rounded-full mb-3">
            💡 Doctor Consultations
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">Need a doctor&apos;s advice first?</h2>
          <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
            Not sure which test to book? Consult with our medical experts online and get a personalized prescription.
          </p>
          <Link href="/doctors">
            <Button className="bg-[#0a4d44] hover:bg-[#073630] text-white rounded-full px-8 py-3 font-bold shadow-lg shadow-emerald-600/10 active:scale-95 transition-all border-none">
              Consult Doctor Online
            </Button>
          </Link>
        </div>
      </section>

      {/* Standardized B2B Partner Onboarding Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-12 mt-4">
        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 hover:shadow-sm transition-all duration-300">
          <div className="flex-1 text-left">
            <h2 className="text-xl font-bold text-slate-900">
              Own a Certified Diagnostic Laboratory? Scale Your Collection Footprint.
            </h2>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              Integrate your test menus with DocBook. Manage automated home sample pickup logs and dispatch secure electronic lab reports directly to patient dashboards.
            </p>
          </div>
          <Link href="/register/lab" className="w-full md:w-auto shrink-0">
            <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.01] active:scale-[0.99] cursor-pointer whitespace-nowrap">
              Register as Partner Lab 🧪
            </button>
          </Link>
        </div>
      </section>

      <LabBookingModal test={selectedTest} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
