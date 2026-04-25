"use client";

import { useRef } from "react";
import Link from "next/link";
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

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" });
  };

  if (doctors.length === 0) return null;

  return (
    <section className="py-12 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Top Doctors</h2>
            <p className="text-sm text-muted-foreground mt-1">Highly rated &amp; experienced doctors</p>
          </div>
          <Link href="/doctors">
            <Button variant="ghost" size="sm" className="gap-1 text-primary font-semibold hover:bg-primary/5">
              View All Doctors <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white border shadow-md hover:shadow-lg transition-all hover:bg-primary/5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={ref}
            className="flex gap-4 overflow-x-auto pb-3 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {doctors.map((doctor, i) => {
              const initials = doctor.user.name
                .split(" ")
                .filter((_, idx) => idx > 0)
                .map((n) => n[0])
                .join("")
                .slice(0, 2) || doctor.user.name.charAt(0);

              return (
                <Link key={doctor.id} href={`/doctors/${doctor.id}`} className="shrink-0">
                  <Card className="w-[160px] sm:w-[175px] cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden group">
                    <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                      {/* Avatar */}
                      <div className="relative">
                        <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                          {initials}
                        </div>
                        {/* Online dot */}
                        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white" />
                      </div>

                      {/* Rating Badge */}
                      <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-[11px] font-bold text-amber-700">{doctor.rating.toFixed(1)}</span>
                      </div>

                      {/* Name */}
                      <div>
                        <p className="font-semibold text-xs leading-tight group-hover:text-primary transition-colors line-clamp-1">
                          {doctor.user.name.startsWith("Dr.") ? doctor.user.name : `Dr. ${doctor.user.name}`}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{doctor.specialization}</p>
                      </div>

                      {/* Meta */}
                      <div className="w-full space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="h-3 w-3 shrink-0 text-primary/60" />
                          <span className="truncate">{doctor.city}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          {doctor.experience} Yrs Exp.
                        </div>
                      </div>

                      <Button size="sm" variant="outline" className="w-full h-7 text-[11px] mt-1 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all rounded-lg">
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white border shadow-md hover:shadow-lg transition-all hover:bg-primary/5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
