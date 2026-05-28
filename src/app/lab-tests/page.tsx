"use client";

import { useState, useEffect, useRef } from "react";
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
  ChevronLeft,
  Lock,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const CARD_THEMES: Record<string, {
  borderGlow: string;
  gradientBg: string;
  imgBg: string;
  img: string;
  badge: string;
  popularBg: string;
  buttonBg: string;
  titleColor: string;
}> = {
  lt1: {
    borderGlow: "border-emerald-500/20 hover:border-emerald-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(16,185,129,0.18)]",
    gradientBg: "from-emerald-50/10 via-white to-emerald-50/5",
    imgBg: "bg-gradient-to-tr from-emerald-100/50 to-emerald-50/30 border-emerald-200/40 shadow-[inset_0_2px_4px_rgba(16,185,129,0.05)]",
    img: "/images/tests/full-body-checkup.png",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-[0_2px_10px_rgba(16,185,129,0.05)]",
    popularBg: "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-500/20",
    buttonBg: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20 hover:shadow-emerald-600/35",
    titleColor: "group-hover:text-emerald-700"
  },
  lt2: {
    borderGlow: "border-rose-500/20 hover:border-rose-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(244,63,94,0.18)]",
    gradientBg: "from-rose-50/10 via-white to-rose-50/5",
    imgBg: "bg-gradient-to-tr from-rose-100/50 to-rose-50/30 border-rose-200/40 shadow-[inset_0_2px_4px_rgba(244,63,94,0.05)]",
    img: "/images/tests/cbc-test.png",
    badge: "bg-rose-50 text-rose-700 border border-rose-200/60 shadow-[0_2px_10px_rgba(244,63,94,0.05)]",
    popularBg: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-500/20",
    buttonBg: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/20 hover:shadow-rose-600/35",
    titleColor: "group-hover:text-rose-700"
  },
  lt3: {
    borderGlow: "border-violet-500/20 hover:border-violet-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(139,92,246,0.18)]",
    gradientBg: "from-violet-50/10 via-white to-violet-50/5",
    imgBg: "bg-gradient-to-tr from-violet-100/50 to-violet-50/30 border-violet-200/40 shadow-[inset_0_2px_4px_rgba(139,92,246,0.05)]",
    img: "/images/tests/thyroid-test.png",
    badge: "bg-violet-50 text-violet-700 border border-violet-200/60 shadow-[0_2px_10px_rgba(139,92,246,0.05)]",
    popularBg: "bg-gradient-to-r from-violet-500 to-violet-600 text-white shadow-violet-500/20",
    buttonBg: "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/20 hover:shadow-violet-600/35",
    titleColor: "group-hover:text-violet-700"
  },
  lt4: {
    borderGlow: "border-sky-500/20 hover:border-sky-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(14,165,233,0.18)]",
    gradientBg: "from-sky-50/10 via-white to-sky-50/5",
    imgBg: "bg-gradient-to-tr from-sky-100/50 to-sky-50/30 border-sky-200/40 shadow-[inset_0_2px_4px_rgba(14,165,233,0.05)]",
    img: "/images/tests/hba1c-test.png",
    badge: "bg-sky-50 text-sky-700 border border-sky-200/60 shadow-[0_2px_10px_rgba(14,165,233,0.05)]",
    popularBg: "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-sky-500/20",
    buttonBg: "bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 shadow-sky-600/20 hover:shadow-sky-600/35",
    titleColor: "group-hover:text-sky-700"
  },
  lt5: {
    borderGlow: "border-orange-500/20 hover:border-orange-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(249,115,22,0.18)]",
    gradientBg: "from-orange-50/10 via-white to-orange-50/5",
    imgBg: "bg-gradient-to-tr from-orange-100/50 to-orange-50/30 border-orange-200/40 shadow-[inset_0_2px_4px_rgba(249,115,22,0.05)]",
    img: "/images/tests/lipid-profile.png",
    badge: "bg-orange-50 text-orange-700 border border-orange-200/60 shadow-[0_2px_10px_rgba(249,115,22,0.05)]",
    popularBg: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange-500/20",
    buttonBg: "bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-600/20 hover:shadow-orange-600/35",
    titleColor: "group-hover:text-orange-700"
  },
  lt6: {
    borderGlow: "border-amber-500/20 hover:border-amber-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(245,158,11,0.18)]",
    gradientBg: "from-amber-50/10 via-white to-amber-50/5",
    imgBg: "bg-gradient-to-tr from-amber-100/50 to-amber-50/30 border-amber-200/40 shadow-[inset_0_2px_4px_rgba(245,158,11,0.05)]",
    img: "/images/tests/liver-test.png",
    badge: "bg-amber-50 text-amber-700 border border-amber-200/60 shadow-[0_2px_10px_rgba(245,158,11,0.05)]",
    popularBg: "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-amber-500/20",
    buttonBg: "bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 shadow-amber-600/20 hover:shadow-amber-600/35",
    titleColor: "group-hover:text-amber-700"
  },
  lt7: {
    borderGlow: "border-teal-500/20 hover:border-teal-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(20,184,166,0.18)]",
    gradientBg: "from-teal-50/10 via-white to-teal-50/5",
    imgBg: "bg-gradient-to-tr from-teal-100/50 to-teal-50/30 border-teal-200/40 shadow-[inset_0_2px_4px_rgba(20,184,166,0.05)]",
    img: "/images/tests/kidney-test.png",
    badge: "bg-teal-50 text-teal-700 border border-teal-200/60 shadow-[0_2px_10px_rgba(20,184,166,0.05)]",
    popularBg: "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-teal-500/20",
    buttonBg: "bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 shadow-teal-600/20 hover:shadow-teal-600/35",
    titleColor: "group-hover:text-teal-700"
  },
  lt8: {
    borderGlow: "border-yellow-500/20 hover:border-yellow-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(234,179,8,0.18)]",
    gradientBg: "from-yellow-50/10 via-white to-yellow-50/5",
    imgBg: "bg-gradient-to-tr from-yellow-100/50 to-yellow-50/30 border-yellow-200/40 shadow-[inset_0_2px_4px_rgba(234,179,8,0.05)]",
    img: "/images/tests/vitamin-test.png",
    badge: "bg-yellow-50 text-yellow-800 border border-yellow-200/60 shadow-[0_2px_10px_rgba(234,179,8,0.05)]",
    popularBg: "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-yellow-500/20",
    buttonBg: "bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 shadow-yellow-600/20 hover:shadow-yellow-600/35",
    titleColor: "group-hover:text-yellow-700"
  },
  lt9: {
    borderGlow: "border-pink-500/20 hover:border-pink-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(236,72,153,0.18)]",
    gradientBg: "from-pink-50/10 via-white to-pink-50/5",
    imgBg: "bg-gradient-to-tr from-pink-100/50 to-pink-50/30 border-pink-200/40 shadow-[inset_0_2px_4px_rgba(236,72,153,0.05)]",
    img: "/images/tests/hormonal-test.png",
    badge: "bg-pink-50 text-pink-700 border border-pink-200/60 shadow-[0_2px_10px_rgba(236,72,153,0.05)]",
    popularBg: "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-pink-500/20",
    buttonBg: "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 shadow-pink-600/20 hover:shadow-pink-600/35",
    titleColor: "group-hover:text-pink-700"
  },
  lt10: {
    borderGlow: "border-rose-500/20 hover:border-rose-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(244,63,94,0.18)]",
    gradientBg: "from-rose-50/10 via-white to-rose-50/5",
    imgBg: "bg-gradient-to-tr from-rose-100/50 to-rose-50/30 border-rose-200/40 shadow-[inset_0_2px_4px_rgba(244,63,94,0.05)]",
    img: "/images/tests/cardiac-test.png",
    badge: "bg-rose-50 text-rose-700 border border-rose-200/60 shadow-[0_2px_10px_rgba(244,63,94,0.05)]",
    popularBg: "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-rose-500/20",
    buttonBg: "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 shadow-rose-600/20 hover:shadow-rose-600/35",
    titleColor: "group-hover:text-rose-700"
  },
  lt11: {
    borderGlow: "border-indigo-500/20 hover:border-indigo-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(99,102,241,0.18)]",
    gradientBg: "from-indigo-50/10 via-white to-indigo-50/5",
    imgBg: "bg-gradient-to-tr from-indigo-100/50 to-indigo-50/30 border-indigo-200/40 shadow-[inset_0_2px_4px_rgba(99,102,241,0.05)]",
    img: "/images/tests/covid-test.png",
    badge: "bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-[0_2px_10px_rgba(99,102,241,0.05)]",
    popularBg: "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-500/20",
    buttonBg: "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-indigo-600/20 hover:shadow-indigo-600/35",
    titleColor: "group-hover:text-indigo-700"
  },
  lt12: {
    borderGlow: "border-cyan-500/20 hover:border-cyan-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(6,182,212,0.18)]",
    gradientBg: "from-cyan-50/10 via-white to-cyan-50/5",
    imgBg: "bg-gradient-to-tr from-cyan-100/50 to-cyan-50/30 border-cyan-200/40 shadow-[inset_0_2px_4px_rgba(6,182,212,0.05)]",
    img: "/images/tests/diabetes-panel.png",
    badge: "bg-cyan-50 text-cyan-700 border border-cyan-200/60 shadow-[0_2px_10px_rgba(6,182,212,0.05)]",
    popularBg: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-cyan-500/20",
    buttonBg: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-600/20 hover:shadow-cyan-600/35",
    titleColor: "group-hover:text-cyan-700"
  },
};

const DEFAULT_THEME = {
  borderGlow: "border-blue-500/20 hover:border-blue-500/45 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05),0_0_25px_rgba(59,130,246,0.18)]",
  gradientBg: "from-blue-50/10 via-white to-blue-50/5",
  imgBg: "bg-gradient-to-tr from-blue-100/50 to-blue-50/30 border-blue-200/40 shadow-[inset_0_2px_4px_rgba(59,130,246,0.05)]",
  img: "/images/tests/full-body-checkup.png",
  badge: "bg-blue-50 text-blue-700 border border-blue-200/60 shadow-[0_2px_10px_rgba(59,130,246,0.05)]",
  popularBg: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20",
  buttonBg: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/20 hover:shadow-blue-600/35",
  titleColor: "group-hover:text-blue-700"
};

const getCardTheme = (test: LabTest) => {
  return CARD_THEMES[test.id] || DEFAULT_THEME;
};

export default function LabTestsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [selectedDetailsTest, setSelectedDetailsTest] = useState<LabTest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");
  const [expandedTests, setExpandedTests] = useState<Record<string, boolean>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleExpand = (testId: string) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 260 : scrollLeft + 260;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

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

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      
      {/* Search Bar Container */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-slate-50/40 border-b border-slate-100 py-12 z-0">
        {/* Soft floating background neon lights for premium design feel */}
        <div className="absolute left-1/3 top-10 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute right-1/3 top-6 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="max-w-2xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Find the Right <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Lab Test</span> for You
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Search amongst our certified diagnostics and premium home collection packages
          </p>
          <div className="relative flex items-center bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-full py-3.5 px-5 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04)] focus-within:border-teal-600 focus-within:ring-4 focus-within:ring-teal-100/40 transition-all max-w-xl mx-auto">
            <Search className="h-5 w-5 text-slate-400 shrink-0 ml-1" />
            <input
              type="text"
              placeholder="Search for tests, packages, or health risks (e.g., CBC, Thyroid...)"
              className="w-full bg-transparent border-none outline-none focus:ring-0 px-3 text-sm text-slate-800 placeholder-slate-400 font-semibold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Shop by Health Risks Navigation */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12">
        <div className="mb-6">
          <h2 className="text-xl font-black text-slate-900 leading-tight">Shop by Health Risks</h2>
          <p className="text-xs text-slate-400 mt-0.5">Filter tests based on health requirements</p>
        </div>

        {/* Scrollable list with scroll arrows */}
        <div className="relative flex items-center group/nav">
          {/* Left arrow slide button */}
          <button 
            onClick={() => scroll("left")}
            className="absolute left-0 z-10 h-10 w-10 rounded-full border border-slate-200 bg-white/95 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-md hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/nav:opacity-100 focus:opacity-100 cursor-pointer -translate-x-2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div 
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-none w-full snap-x snap-mandatory scroll-smooth px-1"
          >
            {HEALTH_RISKS.map((risk) => {
              const isActive = activeCategory === risk.id;
              return (
                <button
                  key={risk.id}
                  onClick={() => setActiveCategory(risk.id)}
                  className={`flex items-center gap-2.5 px-6 py-3.5 rounded-full border text-xs font-black transition-all duration-300 shrink-0 snap-align-start hover:scale-[1.03] active:scale-[0.97] cursor-pointer ${
                    isActive
                      ? "bg-gradient-to-r from-[#0a4d44] to-[#125c52] border-transparent text-white shadow-[0_8px_20px_-6px_rgba(10,77,68,0.4)]"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/60 shadow-sm hover:shadow"
                  }`}
                >
                  <span className={isActive ? "text-white animate-pulse" : "text-slate-500"}>
                    {risk.icon}
                  </span>
                  <span>{risk.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right arrow slide button */}
          <button 
            onClick={() => scroll("right")}
            className="absolute right-0 z-10 h-10 w-10 rounded-full border border-slate-200 bg-white/95 backdrop-blur-sm flex items-center justify-center text-slate-500 hover:bg-slate-50 shadow-md hover:scale-105 active:scale-95 transition-all opacity-0 group-hover/nav:opacity-100 focus:opacity-100 cursor-pointer translate-x-2"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Results Counter & Sort By */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-bold text-slate-400">
            Showing <span className="text-slate-800 font-extrabold">{filtered.length} tests available</span>
          </p>
          
          <div className="flex items-center gap-2.5">
            <span className="text-xs text-slate-400 font-bold">Sort by</span>
            <div className="relative">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2 text-xs font-extrabold text-slate-700 outline-none focus:border-[#0a4d44] cursor-pointer shadow-sm"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((test) => {
              const theme = getCardTheme(test);
              const totalParameters = test.testsIncluded.length * 4 + 4;

              return (
                <div 
                  key={test.id}
                  onClick={() => setSelectedDetailsTest(test)}
                  className={`bg-gradient-to-b ${theme.gradientBg} bg-white/70 backdrop-blur-md rounded-[32px] border p-6 flex flex-col group relative transition-all duration-500 hover:-translate-y-2.5 hover:scale-[1.01] cursor-pointer ${theme.borderGlow}`}
                >
                  {/* Top Left Popular Badge */}
                  {test.popular && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md transition-all duration-300 shadow-sm ${theme.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        Popular
                      </span>
                    </div>
                  )}

                  {/* Circular Icon in Center-Top (Enlarged and Circular with padding adjusted) */}
                  <div className="mx-auto mt-4 mb-5 flex items-center justify-center">
                    <div className={`relative h-28 w-28 rounded-full flex items-center justify-center ${theme.imgBg} overflow-hidden border shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out`}>
                       <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-full" />
                      <Image
                        src={theme.img}
                        alt={test.name}
                        fill
                        sizes="112px"
                        className="object-contain p-4 relative z-10 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  {/* Test Title Centered */}
                  <h3 className={`font-black text-slate-800 text-center tracking-tight leading-snug text-base mb-2 transition-colors duration-300 px-1 ${theme.titleColor}`}>
                    {test.name}
                  </h3>

                  {/* Description Centered */}
                  <p className="text-xs text-slate-400/90 text-center line-clamp-2 leading-relaxed mb-6 px-2 min-h-[32px]">
                    {test.description}
                  </p>

                  {/* Parameter Box */}
                  <div className="border border-slate-100/80 rounded-2xl p-4 text-xs mb-6 bg-white/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/70 group-hover:border-slate-200/50">
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <span className="text-slate-400 font-semibold">Inclusions</span>
                      <span className="font-extrabold text-slate-800 bg-slate-100/85 px-2.5 py-0.5 rounded-full text-[10px]">
                        {totalParameters} Parameters
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3 text-xs">
                      <span className="text-slate-400 font-semibold">Turnaround Time</span>
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5 text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        Reports in {test.reportTime}
                      </span>
                    </div>
                    
                    {/* Inclusions Badges */}
                    <div className="flex flex-wrap gap-1.5 border-t border-slate-100/70 pt-3">
                      {(expandedTests[test.id] ? test.testsIncluded : test.testsIncluded.slice(0, 3)).map((item) => (
                        <span key={item} className="text-[10px] font-semibold bg-slate-100/60 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200/30">
                          {item}
                        </span>
                      ))}
                      {test.testsIncluded.length > 3 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(test.id);
                          }}
                          className="text-[10px] font-bold text-[#0a4d44] bg-[#0a4d44]/5 hover:bg-[#0a4d44]/10 border border-[#0a4d44]/10 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border-none"
                        >
                          {expandedTests[test.id] ? "show less" : `+${test.testsIncluded.length - 3} more`}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Price & Action row at bottom */}
                  <div className="mt-auto">
                    {/* Price Aligned Left */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#0a4d44] tracking-tight">₹{test.price}</span>
                          <span className="text-xs text-slate-400 line-through font-medium">₹{test.mrp}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full shadow-sm">
                        {test.discount}% OFF
                      </span>
                    </div>

                    {/* Book Now Button (Teal, full-width, animated) */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBook(test);
                      }}
                      className={`w-full ${theme.buttonBg} h-12 text-white rounded-xl font-bold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 border-none active:scale-[0.98] group/btn cursor-pointer`}
                    >
                      <span className="text-sm">Book Now</span>
                      <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-slate-200 max-w-xl mx-auto shadow-sm">
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
      <section className="bg-slate-50/40 border-t border-slate-100/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* Badge 1 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100/80 hover:border-emerald-500/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-50 text-[#0a4d44] rounded-xl shrink-0 border border-emerald-100/50 shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Trusted by Millions</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Accurate reports, every time</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100/80 hover:border-emerald-500/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-50 text-[#0a4d44] rounded-xl shrink-0 border border-emerald-100/50 shadow-sm">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Home Sample Collection</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Convenient & hassle-free</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100/80 hover:border-emerald-500/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-50 text-[#0a4d44] rounded-xl shrink-0 border border-emerald-100/50 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Fast Turnaround Time</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Get reports on time</p>
              </div>
            </div>

            {/* Badge 4 */}
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-100/80 hover:border-emerald-500/20 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300">
              <div className="p-3 bg-emerald-50 text-[#0a4d44] rounded-xl shrink-0 border border-emerald-100/50 shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Secure & Confidential</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Your health is safe with us</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Online Doctor CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white py-16">
        {/* Decorative background glows */}
        <div className="absolute -left-1/4 -top-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-1/4 -bottom-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center z-10">
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 font-semibold text-xs rounded-full mb-4">
            💡 Doctor Consultations
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">Not sure which test to book?</h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8 leading-relaxed">
            Consult with our medical experts online, describe your symptoms, and get a personalized laboratory test prescription.
          </p>
          <Link href="/doctors">
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full px-8 py-6 font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all border-none cursor-pointer">
              Consult Doctor Online
            </Button>
          </Link>
        </div>
      </section>

      {/* Standardized B2B Partner Onboarding Section */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 rounded-3xl p-8 md:p-12 border border-slate-800/80 flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl hover:shadow-2xl transition-all duration-500">
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex-1 text-left relative z-10">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-widest">For Laboratories</span>
            <h2 className="text-2xl font-black text-white mt-1 leading-snug">
              Scale your diagnostic laboratory footprint.
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-3 max-w-2xl leading-relaxed">
              Integrate your test menus with DocBook. Manage automated home sample pickup logs and dispatch secure electronic lab reports directly to patient dashboards.
            </p>
          </div>
          <Link href="/register/lab" className="w-full md:w-auto shrink-0 relative z-10">
            <button className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-teal-900/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap border-none">
              Register as Partner Lab 🧪
            </button>
          </Link>
        </div>
      </section>

      {selectedDetailsTest && (() => {
        const theme = getCardTheme(selectedDetailsTest);
        const totalParameters = selectedDetailsTest.testsIncluded.length * 4 + 4;
        return (
          <Dialog 
            open={!!selectedDetailsTest} 
            onOpenChange={(open) => {
              if (!open) setSelectedDetailsTest(null);
            }}
          >
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-muted bg-card/95 backdrop-blur-md shadow-2xl flex flex-col gap-0">
              {/* Top Banner (Theme Colored) */}
              <div className={`relative w-full h-44 sm:h-48 overflow-hidden bg-gradient-to-tr ${theme.gradientBg} flex items-center justify-between px-6 sm:px-8 border-b`}>
                <div className="flex flex-col gap-2 relative z-10 max-w-[65%]">
                  <div className="flex flex-wrap gap-2">
                    {selectedDetailsTest.popular && (
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border-0">
                        Popular Test
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-white/80 dark:bg-slate-900/80 text-xs font-bold border-muted">
                      {selectedDetailsTest.category}
                    </Badge>
                  </div>
                  <h3 className="font-black text-slate-800 text-xl sm:text-2xl tracking-tight leading-snug">
                    {selectedDetailsTest.name}
                  </h3>
                </div>

                {/* Circular image floating on the right */}
                <div className="shrink-0 relative z-10">
                  <div className={`relative h-24 w-24 sm:h-28 sm:w-28 rounded-full flex items-center justify-center ${theme.imgBg} overflow-hidden border shadow-md`}>
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] rounded-full" />
                    <Image
                      src={theme.img}
                      alt={selectedDetailsTest.name}
                      fill
                      sizes="112px"
                      className="object-contain p-3 relative z-10"
                    />
                  </div>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold tracking-wide text-foreground/80 uppercase mb-2">
                    Description
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedDetailsTest.description}
                  </p>
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-muted/40 border border-muted/50">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Report Turnaround</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {selectedDetailsTest.reportTime}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Sample Type</span>
                    <span className="font-extrabold text-slate-800 text-sm mt-0.5">
                      {selectedDetailsTest.sampleType}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Collection Options</span>
                    <div className="mt-0.5">
                      {selectedDetailsTest.homeCollection ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100/90 text-[10px] font-bold border-0">
                          🏠 Free Home Sample Collection
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100/90 text-[10px] font-bold border-0">
                          🏥 Lab Visit Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inclusions Detail list */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold tracking-wide text-foreground/80 uppercase">
                      Inclusions ({totalParameters} parameters)
                    </h4>
                    <span className="text-[10px] font-medium text-muted-foreground">Detailed test breakdown</span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto p-1 border rounded-xl bg-slate-50/50">
                    {selectedDetailsTest.testsIncluded.map((parameter) => (
                      <span
                        key={parameter}
                        className="text-xs bg-white text-slate-700 border border-slate-200 px-3 py-1.5 rounded-xl font-medium shadow-sm flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {parameter}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price and CTA */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-muted/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground font-medium">Test Booking Charge</span>
                    <div className="flex items-baseline gap-2.5 mt-1">
                      <span className="text-3xl font-black text-[#0a4d44]">
                        ₹{selectedDetailsTest.price}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ₹{selectedDetailsTest.mrp}
                      </span>
                      <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-extrabold border-0">
                        {selectedDetailsTest.discount}% OFF
                      </Badge>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold mt-0.5">
                      You save ₹{selectedDetailsTest.mrp - selectedDetailsTest.price}!
                    </span>
                  </div>

                  <Button
                    size="lg"
                    className={`sm:w-auto w-full font-bold h-12 ${theme.buttonBg} text-white rounded-xl shadow-md transition-all duration-300 gap-2 flex items-center justify-center border-none`}
                    onClick={() => {
                      handleBook(selectedDetailsTest);
                      setSelectedDetailsTest(null);
                    }}
                  >
                    <span>Book Now</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      })()}

      <LabBookingModal test={selectedTest} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
