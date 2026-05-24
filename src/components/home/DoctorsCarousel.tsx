"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

type Doctor = {
  id: string;
  specialization: string;
  experience: number;
  fees: number;
  rating: number;
  totalReviews: number;
  city: string;
  user: { name: string; avatar: string | null };
};

const GRADIENT_COLORS = [
  "from-teal-400 to-cyan-500",
  "from-blue-400 to-indigo-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-500",
];

export default function DoctorsCarousel({ doctors }: { doctors: Doctor[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isPaused = useRef(false);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    const cardWidth = ref.current.children[0]?.clientWidth || 250;
    const gap = 16; // gap-4
    ref.current.scrollBy({ left: dir === "left" ? -(cardWidth + gap) : (cardWidth + gap), behavior: "smooth" });
  };

  useEffect(() => {
    if (doctors.length === 0) return;
    
    const interval = setInterval(() => {
      if (isPaused.current) return;
      if (!ref.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      
      // If reached the end, scroll back to start
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        ref.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scroll("right");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [doctors.length]);

  if (doctors.length === 0) return null;

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50/50 to-white border-t border-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Top Doctors</h2>
            <p className="text-sm font-medium text-slate-500 mt-1.5">Highly rated &amp; experienced specialists available today</p>
          </div>
          <Link href="/doctors">
            <Button variant="ghost" size="sm" className="gap-1.5 text-teal-600 font-extrabold hover:bg-teal-50 hover:text-teal-700 transition-colors uppercase tracking-wider text-xs">
              View All Doctors <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg hover:shadow-xl transition-all hover:bg-teal-50 hover:text-teal-600 active:scale-95 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={ref}
            onMouseEnter={() => { isPaused.current = true; }}
            onMouseLeave={() => { isPaused.current = false; }}
            className="flex gap-5 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
            {doctors.map((doctor, i) => {
              const displayName  = doctor.user.name.startsWith("Dr.") ? doctor.user.name : `Dr. ${doctor.user.name}`;

              return (
                <Link key={doctor.id} href={`/doctors/${doctor.id}`} className="shrink-0 snap-start">
                  <Card className="w-[230px] sm:w-[260px] cursor-pointer hover:shadow-2xl hover:shadow-teal-950/[0.04] border border-slate-100 hover:border-teal-500/25 transition-all duration-300 rounded-3xl overflow-hidden group">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="relative h-24 w-24 rounded-2xl overflow-hidden border-[3px] border-white shadow-md ring-4 ring-teal-500/5 group-hover:ring-teal-500/10 transition-all duration-300">
                          <Image 
                            src={doctor.user.avatar || `https://i.pravatar.cc/250?u=${doctor.id}`} 
                            alt={doctor.user.name}
                            fill
                            sizes="(max-width: 640px) 96px, 120px"
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        {/* Online dot */}
                        <div className="absolute -bottom-1 -right-1 h-4.5 w-4.5 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
                      </div>

                      {/* Name / Specialty */}
                      <div className="space-y-1 w-full">
                        {/* Rating Badge */}
                        <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/60 rounded-full px-2.5 py-0.5 mb-1 shadow-sm">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-[11px] font-bold text-amber-700">{doctor.rating.toFixed(1)}</span>
                        </div>
                        
                        <h4 className="font-extrabold text-[15px] sm:text-base leading-tight text-slate-800 group-hover:text-teal-600 transition-colors line-clamp-1">
                          {displayName}
                        </h4>
                        <p className="text-[11px] font-semibold text-teal-600/90 uppercase tracking-wider">{doctor.specialization}</p>
                      </div>

                      {/* Meta stats */}
                      <div className="w-full grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                        <div className="text-left">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Experience</p>
                          <p className="text-xs font-extrabold text-slate-700 mt-0.5">{doctor.experience} Years</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Fees</p>
                          <p className="text-xs font-extrabold text-slate-700 mt-0.5">₹{doctor.fees}</p>
                        </div>
                      </div>

                      {/* Consultation Type Info */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-50 px-3 py-1.5 rounded-xl w-full justify-center">
                        <MapPin className="h-3.5 w-3.5 text-teal-600/70" />
                        <span className="truncate">{doctor.city}</span>
                      </div>

                      <Button size="sm" className="w-full h-10 text-xs font-extrabold bg-teal-600 hover:bg-teal-500 text-white rounded-xl shadow-lg shadow-teal-600/10 hover:shadow-teal-500/20 active:scale-[0.98] transition-all">
                        Book Appointment
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-lg hover:shadow-xl transition-all hover:bg-teal-50 hover:text-teal-600 active:scale-95 opacity-0 group-hover/carousel:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
