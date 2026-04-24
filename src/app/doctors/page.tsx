"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star, MapPin, Clock, Filter, Loader2 } from "lucide-react";
import { SPECIALIZATIONS, CITIES } from "@/lib/constants";
import { DoctorProfile } from "@/types";

function DoctorsContent() {
  const searchParams = useSearchParams();
  const initialSpec = searchParams.get("specialization") || "";
  const initialCity = searchParams.get("city") || "";

  const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState(initialSpec);
  const [city, setCity] = useState(initialCity);
  const [sortBy, setSortBy] = useState("experience_reviews");
  const [total, setTotal] = useState(0);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (specialization) params.set("specialization", specialization);
    if (city) params.set("city", city);
    params.set("sortBy", sortBy);

    try {
      const res = await fetch(`/api/doctors?${params}`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
        setTotal(data.pagination.total);
      }
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
    setLoading(false);
  }, [search, specialization, city, sortBy]);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Find Doctors</h1>
        <p className="text-muted-foreground mt-1">
          {total} doctors available in {city || "all cities"}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 p-4 rounded-xl bg-muted/30 border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search doctors, clinics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
        <Select value={specialization} onValueChange={(v) => setSpecialization(v || "")}>
          <SelectTrigger className="w-full sm:w-48 h-10">
            <Filter className="h-4 w-4 mr-2 shrink-0" />
            <SelectValue placeholder="Specialization" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specializations</SelectItem>
            {SPECIALIZATIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative w-full sm:w-44">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground shrink-0" />
          <Input 
            type="text"
            list="city-options"
            placeholder="City"
            value={city === "all" ? "" : city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full h-10 pl-9"
          />
          <datalist id="city-options">
            {CITIES.map((c) => (
              <option key={c.value} value={c.value} />
            ))}
          </datalist>
        </div>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v || "rating")}>
          <SelectTrigger className="w-full sm:w-40 h-10">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="experience_reviews">Experience & Reviews</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="experience">Most Experienced</SelectItem>
            <SelectItem value="fees_low">Fees: Low to High</SelectItem>
            <SelectItem value="fees_high">Fees: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Quick Filter Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Badge
          variant={specialization === "" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setSpecialization("")}
        >
          All
        </Badge>
        {SPECIALIZATIONS.slice(0, 8).map((s) => (
          <Badge
            key={s.value}
            variant={specialization === s.value ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSpecialization(s.value === specialization ? "" : s.value)}
          >
            {s.label}
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
          <p className="text-xl font-medium text-muted-foreground">
            {city && city !== "all" ? `No doctors found in ${city}` : "No doctors found"}
          </p>
          <p className="text-muted-foreground mt-2">Try adjusting your filters</p>
          <Button variant="outline" className="mt-4" onClick={() => {
            setSearch("");
            setSpecialization("");
            setCity("");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {doctors.map((doctor) => (
            <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
              <Card className="group hover:shadow-xl hover:border-primary/20 transition-all duration-300 h-full">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold">
                      {doctor.user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {doctor.user.name}
                      </h3>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {doctor.specialization}
                      </Badge>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {doctor.totalReviews} reviews
                        </span>
                      </div>
                    </div>
                  </div>

                  {doctor.bio && (
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{doctor.bio}</p>
                  )}

                  <div className="mt-4 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {doctor.experience} yrs
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {doctor.city}
                      </span>
                    </div>
                    <span className="font-bold text-primary">₹{doctor.fees}</span>
                  </div>

                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {doctor.consultationType === "BOTH" ? "Online & Offline" : doctor.consultationType}
                    </Badge>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
      <DoctorsContent />
    </Suspense>
  );
}
