"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Search, ShieldCheck, ShoppingCart, Rocket, Building2, Link as LinkIcon, Stethoscope } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PharmacyHeroProps {
  onUploadPrescription?: () => void;
  onSearch?: (term: string) => void;
  onSimulateOrder?: () => void;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
}

export default function PharmacyHero({
  onUploadPrescription,
  onSearch,
  onSimulateOrder,
  searchValue = "",
  onSearchChange,
}: PharmacyHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-tr from-[#f1faf8] via-[#e8f6f3] to-white py-12 lg:py-20 border-b border-slate-100">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0d9488_0.5px,_transparent_0.5px)] [background-size:24px_24px] opacity-[0.02]" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white text-teal-800 border border-slate-100 px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm">
                <LinkIcon className="h-3.5 w-3.5 mr-2 text-teal-600" />
                Online Pharmacy
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                Your Health, <br />
                <span className="text-teal-700 italic font-serif">Delivered</span> Fast.
              </h1>
              <p className="text-base sm:text-lg text-slate-500 font-bold max-w-lg leading-relaxed">
                Search from thousands of medicines. Get them delivered from your favorite local pharmacies in under an hour.
              </p>
            </div>

            {/* Search Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (onSearch) onSearch(searchValue);
              }}
              className="relative group max-w-xl"
            >
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search by medicine name or salt..."
                value={searchValue}
                onChange={(e) => {
                  if (onSearchChange) onSearchChange(e.target.value);
                }}
                className="w-full h-14 pl-14 pr-6 rounded-full bg-white border border-slate-200/80 shadow-md shadow-slate-100/50 focus:border-teal-500/30 transition-all text-base font-bold placeholder:text-slate-300 focus-visible:ring-teal-500/20"
              />
            </form>

            {/* Highlights */}
            <div className="flex flex-wrap items-center gap-6 pt-1 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 border border-teal-100/40 shadow-sm">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                </div>
                <span>100% Genuine Products</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 border border-teal-100/40 shadow-sm">
                  <ShoppingCart className="h-5 w-5 text-teal-600" />
                </div>
                <span>Fast Delivery Within 60 Mins</span>
              </div>
            </div>

            {/* Dark Green Compliance Card */}
            <div className="bg-[#0c4f46] text-white p-6 sm:p-8 rounded-[2rem] shadow-xl space-y-6 max-w-2xl relative overflow-hidden">
              {/* Decorative blobs */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-white/10 pb-6 relative z-10">
                {/* Column 1: Upload */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-tight">Order with Prescription</h3>
                    <p className="text-xs text-teal-100/70 leading-relaxed font-semibold">
                      Upload your prescription and we'll take care of the rest.
                    </p>
                  </div>
                  <Button
                    onClick={onUploadPrescription}
                    className="w-fit h-11 px-6 rounded-full bg-white hover:bg-slate-50 text-[#0c4f46] font-black text-xs uppercase tracking-wider gap-2 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Upload className="h-4 w-4" /> Upload Prescription
                  </Button>
                </div>

                {/* Column 2: Consultation */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-black tracking-tight">New to Doc<span className="text-primary">Book</span>?</h3>
                    <p className="text-xs text-teal-100/70 leading-relaxed font-semibold">
                      Book doctor consultations in minutes.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href="/doctors" className="flex-1">
                      <Button
                        className="w-full h-11 rounded-full bg-white hover:bg-slate-50 text-[#0c4f46] font-black text-xs uppercase tracking-wider shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Book Now
                      </Button>
                    </Link>
                    <div className="h-11 w-11 rounded-full bg-teal-800/40 border border-white/10 flex items-center justify-center text-white shrink-0">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Simulate Button */}
              <div className="relative z-10">
                <Button
                  onClick={onSimulateOrder}
                  className="w-full h-12 rounded-full bg-white hover:bg-slate-50 text-teal-800 font-black text-xs uppercase tracking-widest gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Rocket className="h-4 w-4 text-teal-600 animate-pulse" /> Simulate Smart Order
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image Mockup */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100/60 aspect-[1024/837] group">
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/5 to-transparent pointer-events-none z-20" />
              <Image
                src="/pharmacy-hero.jpg"
                alt="DocBook Online Pharmacy"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                priority
              />
            </div>
            
            {/* Decors */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-teal-100/50 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#e8f6f3]/60 rounded-full blur-2xl pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}
