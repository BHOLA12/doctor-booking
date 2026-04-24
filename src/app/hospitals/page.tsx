import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, Phone, ArrowRight, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HospitalsPage({
  searchParams,
}: {
  searchParams: { q?: string; city?: string };
}) {
  const query = searchParams.q || "";
  
  const hospitals = await prisma.hospital.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { city: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      _count: {
        select: { doctors: true },
      },
    },
  });

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
          <div className="relative max-w-xl mx-auto group">
            <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
            <div className="relative flex items-center bg-background border-2 border-border/50 rounded-2xl p-1.5 shadow-xl transition-all focus-within:border-primary">
              <Search className="ml-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search hospitals by name or location..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-4 text-sm"
                defaultValue={query}
              />
              <Button className="rounded-xl px-6">Search</Button>
            </div>
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
                    <Image
                      src={hospital.image || "/hospital-placeholder.jpg"}
                      alt={hospital.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
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
