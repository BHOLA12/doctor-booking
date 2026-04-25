"use client";

import { ChevronRight, Search, ShieldCheck, Pill, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProblemCategoryCard from "@/components/medicines/ProblemCategoryCard";
import { PROBLEM_CATEGORIES } from "@/lib/problem-categories-data";
import Link from "next/link";

export default function HealthConditionsPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-3">
                <Pill className="h-4 w-4" />
                Browse by Condition
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Health Problems <br />
                <span className="text-primary">Solved with Care.</span>
              </h1>
              <p className="mt-4 text-lg text-slate-500 leading-relaxed">
                Explore medicines, top brands, and health solutions curated for specific medical conditions.
              </p>
            </div>
            
            <div className="w-full md:w-96">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-800">100% Genuine</p>
                    <p className="text-slate-500 text-xs">Quality assured medicines</p>
                  </div>
                </div>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder="Search for conditions..." 
                    className="pl-10 h-12 rounded-2xl border-slate-200 bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROBLEM_CATEGORIES.map((category) => (
            <ProblemCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Trust Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-primary rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative shadow-2xl shadow-primary/20">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left text-white max-w-lg">
              <h2 className="text-3xl font-black mb-4">Can&apos;t find what you&apos;re looking for?</h2>
              <p className="text-primary-foreground/80 text-lg">
                Our experts are here to help you find the right medicine for your needs.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/doctors">
                <button className="bg-white text-primary font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                  Consult a Doctor <ArrowRight className="h-5 w-5" />
                </button>
              </Link>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 h-64 w-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 h-64 w-64 bg-black/10 rounded-full blur-3xl" />
        </div>
      </div>
    </div>
  );
}
