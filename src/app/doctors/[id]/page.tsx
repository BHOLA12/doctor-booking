"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Award,
  Stethoscope,
  CalendarDays,
  Video,
  Building2,
  Loader2,
  ChevronLeft,
  Navigation2,
  Siren,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  Info,
  User,
} from "lucide-react";
import { APPOINTMENT_TYPES, DAYS_OF_WEEK } from "@/lib/constants";
import { DoctorProfile, SlotInfo, ReviewInfo } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { formatWaitTime } from "@/lib/formatters";
import Image from "next/image";

export default function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [consultationType, setConsultationType] = useState<"ONLINE" | "OFFLINE">("OFFLINE");
  const [notes, setNotes] = useState("");
  const [booking, setBooking] = useState(false);
  const [appointmentType, setAppointmentType] = useState<"EMERGENCY" | "FOLLOW_UP" | "NORMAL">("NORMAL");

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        const data = await res.json();
        if (data.success) {
          setDoctor(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch doctor:", error);
      }
      setLoading(false);
    }
    fetchDoctor();
  }, [id]);

  const getAvailableSlots = () => {
    if (!doctor?.slots || !selectedDate) return [];
    const dayOfWeek = selectedDate.getDay();
    return doctor.slots.filter((s) => s.dayOfWeek === dayOfWeek && s.isActive);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book an appointment");
      router.push(`/login?redirect=/doctors/${id}`);
      return;
    }
    if (!selectedDate || !selectedSlot) {
      toast.error("Please select a date and time slot");
      return;
    }

    setBooking(true);
    toast.info("Processing your booking...");
    
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: doctor!.id,
          date: selectedDate.toISOString().split("T")[0],
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          consultationType,
          notes: notes || undefined,
          isEmergency: appointmentType === "EMERGENCY",
          appointmentType,
          symptoms: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Successfully booked! Queue Position: ${data.data.queuePositionSnapshot}`);
        router.push("/dashboard/patient/appointments");
      } else {
        toast.error(data.error || "Booking failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setBooking(false);
  };

  const formatTime = (time: string) => {
    const [hour, min] = time.split(":").map(Number);
    const ampm = hour >= 12 ? "PM" : "AM";
    const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${h}:${min.toString().padStart(2, "0")} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Stethoscope className="absolute inset-0 m-auto h-6 w-6 text-primary" />
        </div>
        <p className="text-muted-foreground font-medium animate-pulse">Fetching specialist profile...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-24 bg-muted/20 min-h-screen">
        <div className="max-w-md mx-auto bg-background p-10 rounded-[3rem] shadow-xl border border-border/50">
          <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground">
            <User className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Doctor not found</h2>
          <p className="text-muted-foreground mb-8">The profile you are looking for might have been moved or deleted.</p>
          <Link href="/doctors">
            <Button className="rounded-2xl px-8 h-12 font-bold">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const availableSlots = getAvailableSlots();

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Dynamic Header/Banner */}
      <div className="bg-background border-b pt-6 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-8">
            <Link href="/doctors" className="hover:text-primary transition-colors">Find Doctors</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{doctor.specialization}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            {/* Profile Info */}
            <div className="flex-1 space-y-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="relative h-40 w-40 rounded-[2.5rem] overflow-hidden border-8 border-background shadow-2xl shrink-0 group">
                  <Image
                    src={doctor.user.avatar || "/doctor-placeholder.jpg"}
                    alt={doctor.user.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <div className="text-center sm:text-left pt-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                    <Badge className="rounded-full px-4 py-1.5 bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-wider">
                      {doctor.specialization}
                    </Badge>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified
                    </div>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">{doctor.user.name}</h1>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-8 gap-y-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-tighter">Rating</p>
                        <p className="text-sm font-bold text-foreground">{doctor.rating.toFixed(1)} <span className="font-normal text-muted-foreground">({doctor.totalReviews})</span></p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-tighter">Experience</p>
                        <p className="text-sm font-bold text-foreground">{doctor.experience} Years</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-tighter">Availability</p>
                        <p className="text-sm font-bold text-emerald-600">Mon - Sat</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  About Specialist
                </h2>
                <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg">
                  {doctor.bio || `Dr. ${doctor.user.name} is a highly skilled ${doctor.specialization} with ${doctor.experience} years of experience in providing world-class healthcare services. Dedicated to patient-centric care and excellence in medical treatment.`}
                </p>
              </div>

              {/* Hospital Affiliation */}
              {doctor.hospital && (
                <Link href={`/hospitals/${doctor.hospital.id}`} className="block group">
                  <div className="bg-background border-2 border-primary/10 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 transition-all hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                    <div className="relative h-20 w-32 rounded-xl overflow-hidden shrink-0 shadow-md">
                      <Image
                        src={doctor.hospital.image || "/hospital-placeholder.jpg"}
                        alt={doctor.hospital.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Primary Affiliation</p>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{doctor.hospital.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {doctor.hospital.address}, {doctor.hospital.city}
                      </p>
                    </div>
                    <Button variant="ghost" className="rounded-full group-hover:bg-primary/5 group-hover:text-primary">
                      View Facility
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </Link>
              )}
            </div>

            {/* Sticky Sidebar */}
            <div className="w-full lg:w-[400px] shrink-0 space-y-6 lg:-mt-32 relative z-20">
              <Card className="rounded-[2.5rem] border-none shadow-2xl overflow-hidden">
                <div className="bg-primary p-8 text-primary-foreground">
                  <h3 className="text-2xl font-bold mb-1">Book Appointment</h3>
                  <p className="text-primary-foreground/70 text-sm">Select your preferred date & time</p>
                </div>
                <CardContent className="p-8 space-y-8 bg-background">
                  {/* Consultation Mode */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setConsultationType("OFFLINE")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        consultationType === "OFFLINE" ? "border-primary bg-primary/5" : "border-muted-foreground/10 hover:border-primary/20"
                      }`}
                    >
                      <Building2 className={`h-6 w-6 ${consultationType === "OFFLINE" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${consultationType === "OFFLINE" ? "text-primary" : "text-muted-foreground"}`}>In-Clinic</span>
                    </button>
                    <button
                      onClick={() => setConsultationType("ONLINE")}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        consultationType === "ONLINE" ? "border-primary bg-primary/5" : "border-muted-foreground/10 hover:border-primary/20"
                      }`}
                    >
                      <Video className={`h-6 w-6 ${consultationType === "ONLINE" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider ${consultationType === "ONLINE" ? "text-primary" : "text-muted-foreground"}`}>Video Call</span>
                    </button>
                  </div>

                  {/* Calendar Integration */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block">1. Choose Date</label>
                    <div className="border rounded-3xl p-2 bg-muted/30">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="rounded-2xl"
                      />
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4 block">2. Select Time Slot</label>
                    {availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <Button
                            key={slot.id}
                            variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                            size="sm"
                            className={`h-11 rounded-xl text-xs font-bold ${selectedSlot?.id === slot.id ? "shadow-lg shadow-primary/30" : "hover:bg-primary/5 hover:border-primary/30"}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {formatTime(slot.startTime)}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 px-4 bg-muted/50 rounded-2xl border border-dashed border-muted-foreground/30">
                        <Clock className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                        <p className="text-xs font-medium text-muted-foreground">No slots available for this day</p>
                      </div>
                    )}
                  </div>

                  {/* Priority & Notes */}
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">3. Additional Details</label>
                    <div className="flex gap-2">
                       {["NORMAL", "FOLLOW_UP", "EMERGENCY"].map((type) => (
                         <button
                           key={type}
                           onClick={() => setAppointmentType(type as any)}
                           className={`flex-1 py-2 px-1 rounded-xl text-[10px] font-bold border-2 transition-all ${
                             appointmentType === type ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/20"
                           }`}
                         >
                           {type.replace("_", " ")}
                         </button>
                       ))}
                    </div>
                    <Textarea
                      placeholder="Briefly describe your symptoms..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="rounded-2xl border-none bg-muted/50 focus-visible:ring-primary min-h-[100px] text-sm"
                    />
                  </div>

                  {/* Booking Action */}
                  <div className="pt-4 space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <span className="text-sm font-bold text-muted-foreground">Total Fee</span>
                      <span className="text-2xl font-black">₹{doctor.fees}</span>
                    </div>
                    <Button
                      className="w-full h-16 rounded-[1.25rem] text-lg font-black shadow-2xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                      disabled={!selectedDate || !selectedSlot || booking}
                      onClick={handleBooking}
                    >
                      {booking ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        "Confirm Booking"
                      )}
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground font-bold uppercase tracking-tighter">
                      Secure Payment & Instant Confirmation
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-4 rounded-3xl border border-border/50 text-center space-y-2">
                   <ShieldCheck className="h-6 w-6 text-primary mx-auto" />
                   <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">100% Secure<br/>Booking</p>
                </div>
                <div className="bg-background p-4 rounded-3xl border border-border/50 text-center space-y-2">
                   <CheckCircle2 className="h-6 w-6 text-emerald-500 mx-auto" />
                   <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">Verified<br/>Medical Expert</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Locations Section */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Reviews */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                Patient Reviews
              </h2>
              <Badge variant="outline" className="rounded-full px-4">{doctor.totalReviews} total</Badge>
            </div>

            <div className="space-y-4">
              {doctor.reviews && doctor.reviews.length > 0 ? (
                doctor.reviews.map((review: ReviewInfo) => (
                  <div key={review.id} className="bg-background p-6 rounded-[2rem] border border-border/50 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-black text-primary">
                          {review.patient?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="font-bold text-sm leading-tight">{review.patient?.name}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }, (_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.comment}"</p>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-background rounded-[2rem] border border-dashed border-muted-foreground/30">
                  <p className="text-muted-foreground font-medium">No reviews yet for this specialist</p>
                </div>
              )}
            </div>
          </div>

          {/* Location / Map */}
          <div className="space-y-8">
             <h2 className="text-2xl font-bold flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              Practice Location
            </h2>
            
            <div className="bg-background rounded-[2rem] border border-border/50 p-4 shadow-sm space-y-4">
              <div className="rounded-2xl overflow-hidden border border-border/50 h-[300px] relative">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                    `${doctor.clinicName || ''} ${doctor.clinicAddress || ''} ${doctor.city || ''} ${doctor.state || ''}`
                  )}`}
                  allowFullScreen
                />
              </div>
              
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="font-bold text-lg mb-1">{doctor.clinicName || "Private Practice"}</h4>
                  <p className="text-sm text-muted-foreground">{doctor.clinicAddress}, {doctor.city}</p>
                </div>
                <div className="flex gap-3">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${doctor.clinicAddress || ''} ${doctor.city || ''} ${doctor.state || ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full rounded-xl gap-2 h-11 font-bold">
                      <Navigation2 className="h-4 w-4" />
                      Directions
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
