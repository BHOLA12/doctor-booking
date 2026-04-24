import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Stethoscope,
  Filter,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function HospitalDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ specialization?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const hospital = await prisma.hospital.findUnique({
    where: { id },
    include: {
      doctors: {
        where: resolvedSearchParams.specialization 
          ? { specialization: resolvedSearchParams.specialization } 
          : undefined,
        include: {
          user: {
            select: { name: true, avatar: true }
          },
          _count: {
            select: { reviews: true }
          }
        }
      }
    }
  });

  if (!hospital) notFound();

  const specialties = hospital.specialties as string[];

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Breadcrumbs */}
      <div className="bg-background border-b py-3">
        <div className="container mx-auto px-4 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/hospitals" className="hover:text-primary">Hospitals</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">{hospital.name}</span>
        </div>
      </div>

      {/* Hospital Banner */}
      <div className="bg-background border-b relative overflow-hidden">
        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="relative w-full lg:w-80 h-56 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10">
              <Image
                src={hospital.image || "/hospital-placeholder.jpg"}
                alt={hospital.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                  Verified Facility
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-yellow-500" />
                  <span className="text-sm font-bold text-foreground">{hospital.rating}</span>
                  <span className="text-xs text-muted-foreground">({hospital.totalReviews} Reviews)</span>
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{hospital.name}</h1>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5 text-primary/60" />
                <span className="text-lg font-medium">{hospital.address}</span>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Available Doctors</p>
                    <p className="text-sm font-bold">{hospital.doctors.length} Specialists</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-tighter">Operational Hours</p>
                    <p className="text-sm font-bold">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Specialty Filter Bar */}
      <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 shrink-0 pr-4 border-r mr-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">Filter by:</span>
          </div>
          
          <Link 
            href={`/hospitals/${hospital.id}`}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
              !resolvedSearchParams.specialization ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted hover:bg-accent'
            }`}
          >
            All Specialists
          </Link>
          
          {specialties.map((spec) => (
            <Link
              key={spec}
              href={`/hospitals/${hospital.id}?specialization=${spec}`}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all shrink-0 ${
                resolvedSearchParams.specialization === spec ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted hover:bg-accent'
              }`}
            >
              {spec}
            </Link>
          ))}
        </div>
      </div>

      {/* Doctor Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hospital.doctors.map((doctor) => (
            <div 
              key={doctor.id}
              className="bg-background rounded-[2rem] border border-border/50 p-6 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-16 w-16 rounded-2xl overflow-hidden ring-4 ring-primary/5 transition-all group-hover:ring-primary/20">
                  <Image
                    src={doctor.user.avatar || "/doctor-placeholder.jpg"}
                    alt={doctor.user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">
                    {doctor.user.name}
                  </h4>
                  <p className="text-primary text-xs font-bold uppercase tracking-wider mt-1">{doctor.specialization}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-foreground">{doctor.rating}</span>
                    <span>({doctor.totalReviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{doctor.experience} Yrs Exp.</span>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-muted/50 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                  Free follow-up for 3 days
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Consultation Fee</p>
                  <p className="text-xl font-extrabold text-foreground">₹{doctor.fees}</p>
                </div>
                <div className="h-10 w-px bg-border/50 mx-2" />
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Next Available</p>
                  <p className="text-sm font-bold text-emerald-600">Today</p>
                </div>
              </div>

              <Link href={`/doctors/${doctor.id}`}>
                <Button className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/10 transition-all active:scale-95">
                  Book Appointment
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {hospital.doctors.length === 0 && (
          <div className="text-center py-20 bg-background rounded-[3rem] border border-dashed border-muted-foreground/30 max-w-2xl mx-auto">
            <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Stethoscope className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No doctors available</h3>
            <p className="text-muted-foreground mb-8">We couldn't find any doctors matching your selected criteria at this hospital.</p>
            <Link href={`/hospitals/${hospital.id}`}>
              <Button variant="outline" className="rounded-xl px-8">Clear All Filters</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
