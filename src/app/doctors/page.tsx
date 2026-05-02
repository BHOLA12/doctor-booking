"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search, Star, MapPin, Filter, Loader2,
  ChevronLeft, ChevronRight, Building2, Video,
  ShieldCheck, CalendarDays, Stethoscope,
} from "lucide-react";
import { SPECIALIZATIONS, CITIES } from "@/lib/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { DoctorProfile } from "@/types";

/** Deterministic gradient — same name = same color, always */
function nameToGradient(name: string): string {
  const palettes = [
    "from-cyan-400 to-teal-500",
    "from-violet-400 to-purple-600",
    "from-rose-400 to-pink-600",
    "from-amber-400 to-orange-500",
    "from-sky-400 to-blue-600",
    "from-emerald-400 to-green-600",
    "from-fuchsia-400 to-pink-600",
    "from-indigo-400 to-blue-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palettes[Math.abs(hash) % palettes.length];
}

function getInitials(name: string) {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Return a soft pastel version of the avatar gradient for the card header */
function headerTintFor(gradient: string): string {
  if (gradient.includes("cyan") || gradient.includes("teal"))     return "from-cyan-50   to-teal-50   dark:from-cyan-950/40   dark:to-teal-950/40";
  if (gradient.includes("violet") || gradient.includes("purple")) return "from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40";
  if (gradient.includes("rose")   || gradient.includes("pink"))   return "from-rose-50   to-pink-50   dark:from-rose-950/40   dark:to-pink-950/40";
  if (gradient.includes("amber")  || gradient.includes("orange")) return "from-amber-50  to-orange-50 dark:from-amber-950/40  dark:to-orange-950/40";
  if (gradient.includes("sky")    || gradient.includes("blue"))   return "from-sky-50    to-blue-50   dark:from-sky-950/40    dark:to-blue-950/40";
  if (gradient.includes("indigo"))                                 return "from-indigo-50 to-blue-50  dark:from-indigo-950/40 dark:to-blue-950/40";
  if (gradient.includes("emerald")|| gradient.includes("green"))  return "from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40";
  return "from-fuchsia-50 to-pink-50 dark:from-fuchsia-950/40 dark:to-pink-950/40";
}

const PAGE_SIZE = 12;

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialSpec   = searchParams.get("specialization") || "";
  const initialCity   = searchParams.get("city")           || "";
  const initialSearch = searchParams.get("search")         || "";

  const [doctors, setDoctors]       = useState<DoctorProfile[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState(initialSearch);
  const [specialization, setSpecialization] = useState(initialSpec);
  const [city, setCity]             = useState(initialCity);
  const [sortBy, setSortBy]         = useState("experience_reviews");
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedCity   = useDebounce(city, 300);

  const formatTime = (time: string) => {
    const [hour, min] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h    = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
  };

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch)                             params.set("search", debouncedSearch);
    if (specialization && specialization !== "all") params.set("specialization", specialization);
    if (debouncedCity   && debouncedCity   !== "all") params.set("city", debouncedCity);
    params.set("sortBy", sortBy);
    params.set("page",   String(page));
    params.set("limit",  String(PAGE_SIZE));
    try {
      const res  = await fetch(`/api/doctors?${params}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
        setTotal(data.pagination.total);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
    setLoading(false);
  }, [debouncedSearch, specialization, debouncedCity, sortBy, page]);

  useEffect(() => { setPage(1); }, [debouncedSearch, specialization, debouncedCity, sortBy]);
  useEffect(() => { fetchDoctors(); }, [fetchDoctors]);

  const clearFilters = () => {
    setSearch(""); setSpecialization(""); setCity(""); setSortBy("experience_reviews"); setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Doctors</h1>
        <p className="text-muted-foreground mt-1">
          {loading ? "Searching…" : `${total} doctor${total !== 1 ? "s" : ""} found${city && city !== "all" ? ` in ${city}` : ""}`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-xl bg-muted/30 border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="doctor-search"
            placeholder="Search doctors, clinics…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={specialization} onValueChange={(v) => setSpecialization(!v || v === "all" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-48 h-10">
            <Filter className="h-4 w-4 mr-2 shrink-0" />
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {SPECIALIZATIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.emoji} {s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative w-full sm:w-44">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            type="text" list="city-options" placeholder="City"
            value={city === "all" ? "" : city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 pl-9"
          />
          <datalist id="city-options">
            {CITIES.map((c) => <option key={c.value} value={c.value} />)}
          </datalist>
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v || "rating")}>
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="experience_reviews">Experience &amp; Reviews</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
            <SelectItem value="fees_low">Fees: Low to High</SelectItem>
            <SelectItem value="fees_high">Fees: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge variant={specialization === "" ? "default" : "outline"} className="cursor-pointer" onClick={() => setSpecialization("")}>All</Badge>
        {SPECIALIZATIONS.slice(0, 8).map((s) => (
          <Badge
            key={s.value}
            variant={specialization === s.value ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/10"
            onClick={() => setSpecialization(s.value === specialization ? "" : s.value)}
          >
            {s.emoji} {s.label}
          </Badge>
        ))}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">👨‍⚕️</div>
          <p className="text-xl font-medium text-muted-foreground">
            {city && city !== "all" ? `No doctors found in ${city}` : "No doctors found"}
          </p>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <>
          {/* ─── Doctor Cards Grid ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => {
              const initials     = getInitials(doctor.user.name);
              const gradient     = nameToGradient(doctor.user.name);
              const headerTint   = headerTintFor(gradient);
              const displayName  = doctor.user.name.startsWith("Dr.") ? doctor.user.name : `Dr. ${doctor.user.name}`;
              const slots        = (doctor as any).slots || [];
              const sortedSlots  = slots.length > 0 ? [...slots].sort((a: any, b: any) => a.startTime.localeCompare(b.startTime)) : [];
              const nextSlot     = sortedSlots.length > 0 ? formatTime(sortedSlots[0].startTime) : null;

              return (
                <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                  <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/10 shadow-[0_2px_16px_rgba(0,0,0,0.07)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full flex flex-col">

                    {/* ── Tinted header (matches screenshot lavender look) ── */}
                    <div className={`bg-gradient-to-br ${headerTint} px-5 pt-5 pb-4`}>
                      <div className="flex items-start gap-3.5">

                        {/* iOS-style square-rounded avatar */}
                        <div className="relative shrink-0">
                          <div className={`relative h-[72px] w-[72px] rounded-[20px] bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-[26px] shadow-md overflow-hidden`}>
                            {doctor.user.avatar
                              ? <Image src={doctor.user.avatar} alt={displayName} fill sizes="72px" className="object-cover" />
                              : <span>{initials}</span>
                            }
                          </div>
                          {/* Green dot — bottom-LEFT (matches screenshot) */}
                          <div className="absolute -bottom-1.5 -left-1.5 h-[18px] w-[18px] bg-emerald-500 rounded-full border-[3px] border-white dark:border-slate-900" />
                        </div>

                        {/* Name / specialization / stars */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-1.5 mb-0.5">
                            <h3 className="font-black text-[15px] leading-snug text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {displayName}
                            </h3>
                            {/* Verified pill — top right */}
                            <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-300/80 dark:border-emerald-700 rounded-full px-2 py-0.5 bg-white/80 dark:bg-emerald-900/20 whitespace-nowrap">
                              <ShieldCheck className="h-3 w-3" /> Verified
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 mb-1.5">
                            <Stethoscope className="h-3 w-3" />
                            {doctor.specialization}
                          </p>
                          {/* Stars */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(doctor.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"}`} />
                              ))}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{doctor.rating.toFixed(1)}</span>
                            <span className="text-xs text-slate-400">({doctor.totalReviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ── White body ── */}
                    <div className="px-5 pt-4 pb-5 flex flex-col flex-1 gap-3.5">

                      {/* Bio */}
                      <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {doctor.bio
                          ? doctor.bio
                          : `Experienced ${doctor.specialization.toLowerCase()} providing comprehensive patient care with ${doctor.experience}+ years of clinical expertise.`
                        }
                      </p>

                      {/* 3-column pill stats */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { val: `${doctor.experience}+`, sub: "Yrs Exp",   teal: false },
                          { val: String(doctor.totalReviews), sub: "Patients",  teal: false },
                          { val: `₹${doctor.fees}`,        sub: "Per Visit", teal: true  },
                        ].map(({ val, sub, teal }) => (
                          <div key={sub} className="bg-slate-50 dark:bg-white/5 rounded-2xl py-2.5 text-center">
                            <p className={`text-[15px] font-black leading-none ${teal ? "text-teal-600 dark:text-teal-400" : "text-slate-900 dark:text-white"}`}>{val}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>
                          </div>
                        ))}
                      </div>

                      {/* City + Next slot */}
                      <div className="space-y-1.5">
                        {doctor.city && (
                          <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400">
                            <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                            {doctor.city}
                          </div>
                        )}
                        {nextSlot && (
                          <div className="flex items-center gap-2 text-[13px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            Next slot: {nextSlot}
                          </div>
                        )}
                      </div>

                      {/* Consultation type pills */}
                      <div className="flex flex-wrap gap-2">
                        {(doctor.consultationType === "OFFLINE" || doctor.consultationType === "BOTH") && (
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                            <Building2 className="h-3.5 w-3.5" /> In-Clinic
                          </span>
                        )}
                        {(doctor.consultationType === "ONLINE" || doctor.consultationType === "BOTH") && (
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-white/10">
                            <Video className="h-3.5 w-3.5" /> Video Consult
                          </span>
                        )}
                      </div>

                      {/* CTA — full-pill teal gradient button */}
                      <div className="mt-auto">
                        <div className="relative rounded-full overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-500 bg-[length:200%_100%] group-hover:bg-right transition-all duration-500" />
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                          <div className="relative py-3.5 text-center text-white text-[13px] font-bold tracking-wide">
                            Book Appointment →
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`h-8 w-8 rounded-lg text-sm font-medium transition-all ${
                        pageNum === page ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-muted text-muted-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground hidden sm:block">Page {page} of {totalPages}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <DoctorsContent />
    </Suspense>
  );
}
