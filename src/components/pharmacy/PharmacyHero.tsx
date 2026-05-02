"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, ArrowRight, Zap, ShieldCheck, MapPin } from "lucide-react";
import Image from "next/image";

export default function PharmacyHero() {
  return (
    <section className="relative overflow-hidden bg-[#F0FDFB] py-12 lg:py-20">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-teal-100/50 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-60" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/80 text-teal-700 border-teal-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                <Zap className="h-3.5 w-3.5 mr-2 fill-teal-500 text-teal-500" />
                Delivery in 30 Minutes
              </Badge>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Your Health, <br />
                <span className="text-primary italic">Delivered</span> Fast.
              </h1>
              <p className="text-lg text-slate-600 font-medium max-w-lg leading-relaxed">
                Order medicines from your favorite local pharmacies and get them delivered in under an hour. 100% genuine products, guaranteed.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-black shadow-xl shadow-primary/20 gap-3 group">
                Shop Medicines <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-base font-bold bg-white border-border/50 shadow-sm gap-3">
                <Upload className="h-5 w-5 text-primary" />
                Upload Prescription
              </Button>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100/50">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  100% GENUINE<br /><span className="text-slate-400 font-semibold uppercase">Products</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-100/50">
                  <MapPin className="h-5 w-5 text-teal-600" />
                </div>
                <div className="text-xs font-bold text-slate-700 leading-tight">
                  NEARBY STORES<br /><span className="text-slate-400 font-semibold uppercase">Verified Only</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative z-10 animate-float">
               <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10 transform translate-y-12 scale-90" />
               {/* Using a placeholder-like premium layout since I can't generate images yet without the tool */}
               <div className="bg-white p-6 rounded-3xl shadow-2xl shadow-slate-200 border border-white/40 max-w-md mx-auto relative overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <div className="space-y-1">
                      <div className="h-2 w-24 bg-slate-100 rounded-full" />
                      <div className="h-3 w-32 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-teal-600" />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-3xl">
                          {i === 1 ? "💊" : i === 2 ? "🩺" : "🧴"}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-slate-100 rounded-full" />
                          <div className="h-2 w-1/2 bg-slate-50 rounded-full" />
                        </div>
                        <div className="h-8 w-16 bg-teal-50 rounded-lg flex items-center justify-center font-bold text-teal-700 text-xs">
                          -25%
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</div>
                      <div className="text-xl font-black">₹1,249.00</div>
                    </div>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-xl font-bold">
                      Checkout
                    </Button>
                  </div>
               </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-10 -right-4 w-24 h-24 bg-amber-100/50 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-slate-200/40 rounded-full blur-xl" />
          </div>

        </div>
      </div>
    </section>
  );
}
