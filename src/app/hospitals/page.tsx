import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Phone, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import FallbackImage from "@/components/shared/FallbackImage";
import HospitalSearchBar from "@/components/shared/HospitalSearchBar";

export default async function HospitalsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; city?: string; state?: string }>;
}) {
  const { q, city, state } = await searchParams;
  const query = q || "";
  const filterCity = city || "";
  const filterState = state || "";
  
  let hospitals: any[] = [];
  try {
    const whereConditions: any[] = [];
    if (query) {
      whereConditions.push({ name: { contains: query, mode: "insensitive" } });
    }
    if (filterCity) {
      whereConditions.push({ city: { equals: filterCity, mode: "insensitive" } });
    }
    if (filterState) {
      whereConditions.push({ state: { equals: filterState, mode: "insensitive" } });
    }

    hospitals = await prisma.hospital.findMany({
      where: whereConditions.length > 0 ? { AND: whereConditions } : {},
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });
  } catch (error) {
    console.warn("⚠️ Database query failed on HospitalsPage, loading fallback mock hospitals.", error);
    hospitals = [
      {
        id: "mock-hosp-1",
        name: "City General Hospital",
        address: "123 Healthcare Ave, South Extension",
        city: "New Delhi",
        state: "Delhi",
        rating: 4.8,
        totalReviews: 450,
        image: "/hospital-placeholder.jpg",
        specialties: ["Cardiologist", "Neurologist", "Orthopedic", "General Physician"],
        _count: { doctors: 8 }
      },
      {
        id: "mock-hosp-2",
        name: "St. Mary's Medical Center",
        address: "45 Wellness Lane, Civil Lines",
        city: "New Delhi",
        state: "Delhi",
        rating: 4.6,
        totalReviews: 320,
        image: "/hospital-placeholder.jpg",
        specialties: ["Pediatrician", "Gynecologist", "Dentist", "Dermatologist"],
        _count: { doctors: 6 }
      }
    ];
    if (filterCity) {
      hospitals = hospitals.filter(h => h.city.toLowerCase() === filterCity.toLowerCase());
    }
    if (filterState) {
      hospitals = hospitals.filter(h => h.state.toLowerCase() === filterState.toLowerCase());
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Hero Header */}
      <div className="bg-background border-b pt-12 pb-24">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">
            Find Top <span className="text-primary">Hospitals</span> Near You
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Browse through our network of world-class medical facilities and book appointments with leading specialists.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-3xl mx-auto">
            <HospitalSearchBar />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 space-y-6">
            <div className="bg-background rounded-2xl p-6 border border-border/50 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 font-bold mb-4">
                <Filter className="h-4 w-4" />
                Filters
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Location</label>
                  <select className="w-full bg-muted/50 border-none rounded-lg text-sm p-2 focus:ring-1 focus:ring-primary">
                    <option>All Cities</option>
                    <option>New Delhi</option>
                    <option>Mumbai</option>
                    <option>Bangalore</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">Rating</label>
                  <div className="space-y-1">
                    {[4, 3, 2].map((r) => (
                      <label key={r} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-muted-foreground/30 text-primary focus:ring-primary" />
                        <span className="text-sm text-muted-foreground group-hover:text-foreground">{r}+ Stars</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Hospital List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">
                {hospitals.length} Hospitals Found
              </h2>
            </div>

            <div className="grid gap-6">
              {hospitals.map((hospital) => (
                <div 
                  key={hospital.id}
                  className="bg-background rounded-3xl p-5 border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group flex flex-col md:flex-row gap-6"
                >
                  {/* Image Container */}
                  <div className="relative w-full md:w-64 h-48 rounded-2xl overflow-hidden shrink-0">
                    <FallbackImage
                      src={hospital.image || "/hospital-placeholder.jpg"}
                      alt={hospital.name}
                      fallbackSrc="/hospital-placeholder.jpg"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-bold">{hospital.rating}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        {hospital.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="text-sm">{hospital.address}</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(hospital.specialties as string[])?.slice(0, 3).map((spec) => (
                        <span key={spec} className="px-2.5 py-1 rounded-md bg-primary/5 text-primary text-[10px] font-bold">
                          {spec}
                        </span>
                      ))}
                      {(hospital.specialties as string[])?.length > 3 && (
                        <span className="px-2.5 py-1 rounded-md bg-muted text-muted-foreground text-[10px] font-bold">
                          +{(hospital.specialties as string[]).length - 3} More
                        </span>
                      )}
                    </div>

                    <div className="mt-auto pt-4 border-t border-border/30 flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">{hospital._count.doctors}</span> Doctors available
                      </div>
                      <Link href={`/hospitals/${hospital.id}`}>
                        <Button className="rounded-xl gap-2 h-10 px-5 group/btn">
                          View Doctors
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {hospitals.length === 0 && (
                <div className="text-center py-20 bg-background rounded-3xl border border-dashed border-muted-foreground/30">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-bold">No hospitals found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
