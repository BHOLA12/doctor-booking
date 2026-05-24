
"use client";

import { useState, useEffect, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, MapPin, Clock, Phone, Mail, Award, Stethoscope,
  CalendarDays, Video, Building2, Loader2, ChevronRight,
  ShieldCheck, CheckCircle2, User, ChevronLeft, Navigation2,
  Sunrise, Sun, Moon
} from "lucide-react";
import { DoctorProfile, SlotInfo } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

function nameToGradient(name: string): string {
  const palettes = [
    "from-teal-400 to-teal-500",
    "from-emerald-400 to-teal-500",
  ];
  return palettes[0];
}

function getInitials(name: string) {
  return name.replace(/^Dr\.?\s*/i, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
}

export default function DoctorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [consultationType, setConsultationType] = useState<"ONLINE" | "OFFLINE">("OFFLINE");
  const [booking, setBooking] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getUpcoming7Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const getSlotCountForDate = (date: Date) => {
    if (!doctor?.slots) return 0;
    const dayOfWeek = date.getDay();
    return doctor.slots.filter((s) => s.dayOfWeek === dayOfWeek && s.isActive).length;
  };

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        const data = await res.json();
        if (data.success) setDoctor(data.data);
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
          date: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}-${String(selectedDate.getDate()).padStart(2, "0")}`,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
          consultationType,
          appointmentType: "NORMAL",
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
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-24 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-10 rounded-3xl shadow-sm border">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <User className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Doctor not found</h2>
          <p className="text-slate-500 mb-8">The profile you are looking for might have been moved or deleted.</p>
          <Link href="/doctors">
            <Button className="rounded-full bg-teal-600 hover:bg-teal-700 px-8 h-12 font-bold text-white">Back to Search</Button>
          </Link>
        </div>
      </div>
    );
  }

  const availableSlots = getAvailableSlots();
  const { morningSlots, afternoonSlots, eveningSlots } = (() => {
    const morning: SlotInfo[] = [];
    const afternoon: SlotInfo[] = [];
    const evening: SlotInfo[] = [];

    availableSlots.forEach((slot) => {
      const [hour] = slot.startTime.split(":").map(Number);
      if (hour < 12) {
        morning.push(slot);
      } else if (hour >= 12 && hour < 16) {
        afternoon.push(slot);
      } else {
        evening.push(slot);
      }
    });

    return { morningSlots: morning, afternoonSlots: afternoon, eveningSlots: evening };
  })();

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] font-medium text-slate-500 mb-6">
          <Link href="/" className="hover:text-teal-600">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/doctors" className="hover:text-teal-600">Find Doctors</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-slate-900 font-semibold">{doctor.specialization}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT COLUMN */}
          <div className="flex-1 space-y-6">
            
            {/* Main Profile Card */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="h-40 w-40 sm:h-48 sm:w-48 rounded-[2rem] overflow-hidden bg-slate-100 relative shadow-inner">
                    {doctor.user.avatar ? (
                      <Image src={doctor.user.avatar} alt={doctor.user.name} fill className="object-cover" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-teal-400 to-teal-500 flex items-center justify-center">
                        <span className="text-white font-black text-5xl tracking-tight">{getInitials(doctor.user.name)}</span>
                      </div>
                    )}
                  </div>
                  {/* Online Dot */}
                  <div className="absolute bottom-2 right-2 h-6 w-6 bg-teal-500 rounded-full border-4 border-white shadow-sm" />
                </div>

                {/* Info */}
                <div className="flex-1 pt-2">
                  <div className="flex flex-wrap items-center gap-2.5 mb-4">
                    <span className="px-3.5 py-1.5 rounded-full bg-teal-600 text-white text-[11px] font-bold uppercase tracking-wide">
                      {doctor.specialization}
                    </span>
                    <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold uppercase tracking-wide border border-emerald-100">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified Specialist
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-[34px] font-bold text-slate-900 tracking-tight mb-3">
                    {doctor.user.name.startsWith("Dr.") ? doctor.user.name : `Dr. ${doctor.user.name}`}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 font-medium mb-5">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-slate-400" />
                      {doctor.degree || "Medical Practitioner"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-slate-400" />
                      {doctor.experience}+ Years Experience
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100/50">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-900">{doctor.rating.toFixed(1)}</span>
                      <span className="text-slate-500 text-xs">({doctor.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100/50">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span className="font-bold text-emerald-700 text-sm">Available Today</span>
                      {doctor.slots && doctor.slots.length > 0 && (
                        <span className="text-emerald-700 text-sm font-bold ml-1">
                          {formatTime(doctor.slots[0].startTime)} - {formatTime(doctor.slots[doctor.slots.length - 1].endTime)}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
                    {doctor.bio || `Highly skilled ${doctor.specialization} with extensive experience in comprehensive patient care and treatments.`}
                  </p>
                </div>
              </div>

              {/* Clinic Affiliation Box */}
              {(doctor.clinicName || doctor.currentHospitalName || doctor.hospital) && (
                <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group cursor-pointer hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden relative shrink-0">
                      {doctor.hospital?.image ? (
                         <Image src={doctor.hospital.image} alt="Clinic" fill className="object-cover" />
                      ) : (
                         <Building2 className="h-6 w-6 text-teal-600 absolute inset-0 m-auto" />
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600 mb-1">Primary Affiliation</p>
                      <h4 className="font-bold text-slate-900 text-[15px]">{doctor.currentHospitalName || doctor.hospital?.name || doctor.clinicName}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{doctor.clinicAddress || doctor.hospital?.address || "Address not provided"}, {doctor.city}</p>
                    </div>
                  </div>
                  <div className="text-teal-600 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Clinic <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              )}

              {/* 4 Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                <div className="p-4 rounded-2xl border border-slate-100 flex flex-col justify-center gap-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Specialization</p>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Stethoscope className="h-3.5 w-3.5 text-teal-600" /> {doctor.specialization}
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 flex flex-col justify-center gap-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Experience</p>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-teal-600" /> {doctor.experience}+ Years
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 flex flex-col justify-center gap-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Consultation Fee</p>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span className="text-teal-600 font-bold">₹</span> {doctor.fees}
                  </p>
                </div>
                <div className="p-4 rounded-2xl border border-slate-100 flex flex-col justify-center gap-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Languages</p>
                  <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-teal-600 hidden" /> English, Hindi
                  </p>
                </div>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Award className="h-5 w-5 text-teal-600" /> Expertise
              </h3>
              <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8">
                {["General Consultation", "Diagnosis & Treatment", "Preventive Care", "Follow-up Care", "Medical Prescriptions", "Specialized Procedures"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-teal-600" /> About {doctor.user.name.startsWith("Dr.") ? doctor.user.name : `Dr. ${doctor.user.name}`}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-6">
                {doctor.bio || `Dr. ${doctor.user.name} is a compassionate and dedicated ${doctor.specialization} with over ${doctor.experience} years of experience. Known for a patient-centric approach and commitment to providing the best care.`}
              </p>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-teal-600">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Education</p>
                    <p className="text-sm font-semibold text-slate-700">{doctor.degree || "Medical Degree"}, {doctor.college || "Medical University"}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-teal-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase mb-1">Memberships</p>
                    <p className="text-sm font-semibold text-slate-700">Medical Council</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Reviews */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" /> Patient Reviews
              </h3>
              
              <div className="flex flex-col md:flex-row gap-8">
                {/* Left side ratings */}
                <div className="w-full md:w-1/3 shrink-0 border-r border-slate-100 pr-8">
                  <div className="text-5xl font-black text-slate-900 mb-2">{doctor.rating.toFixed(1)}</div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`h-4 w-4 ${s <= Math.round(doctor.rating) ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-100"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-6">({doctor.totalReviews} total)</p>

                  <div className="space-y-2">
                    {[5,4,3,2,1].map(num => (
                      <div key={num} className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="w-4">{num} <Star className="inline h-2.5 w-2.5 text-amber-400 fill-amber-400 -mt-0.5" /></span>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-teal-500 rounded-full" style={{ width: num === 5 ? '85%' : num === 4 ? '10%' : '2%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side review cards */}
                <div className="flex-1 space-y-4">
                  {doctor.reviews?.slice(0, 2).map((review) => (
                    <div key={review.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden relative">
                             {review.patient?.avatar ? (
                               <Image src={review.patient.avatar!} alt="User" fill className="object-cover" />
                             ) : (
                               <div className="h-full w-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">{getInitials(review.patient?.name || "User")}</div>
                             )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900">{review.patient?.name || "Patient"}</p>
                              <span className="text-[9px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-full">Verified Patient</span>
                            </div>
                            <p className="text-xs text-slate-400">2 weeks ago</p>
                          </div>
                        </div>
                        <div className="flex items-center text-amber-500 bg-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                          {review.rating} <Star className="h-3 w-3 fill-amber-500 ml-1" />
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mt-3">{review.comment || "Very friendly and explains everything in detail. Highly recommended!"}</p>
                    </div>
                  ))}
                  {(!doctor.reviews || doctor.reviews.length === 0) && (
                    <p className="text-sm text-slate-500 text-center py-6">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Practice Location */}
            <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-600" /> Practice Location
              </h3>
              {(() => {
                const cName = doctor.currentHospitalName || doctor.hospital?.name || doctor.clinicName || "Clinic Location";
                const cAddress = doctor.clinicAddress || doctor.hospital?.address || "";
                const cCity = doctor.city || "";
                const mapQuery = encodeURIComponent([cName, cAddress, cCity].filter(Boolean).join(", "));
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
                return (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50">
                    <div className="h-[300px] w-full bg-slate-200 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 cursor-pointer hover:bg-white transition-colors"
                      >
                        Open in Maps <ChevronRight className="h-3 w-3" />
                      </a>
                    </div>
                    <div className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div>
                        <h4 className="font-bold text-slate-900">{cName}</h4>
                        <p className="text-sm text-slate-500 mt-1">{cAddress || "Address details"}{cCity ? `, ${cCity}` : ""}</p>
                      </div>
                      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="rounded-full border-slate-200 hover:bg-slate-50 text-slate-700 h-10 px-5 text-sm font-semibold">
                          <Navigation2 className="h-4 w-4 mr-2" /> Get Directions
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>

          {/* RIGHT COLUMN - BOOKING WIDGET */}
          <div className="w-full lg:w-[400px] shrink-0 sticky top-24">
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
              
              {/* Teal Header */}
              <div className="bg-teal-600 p-6 text-white">
                <h3 className="text-xl font-bold mb-1">Book an Appointment</h3>
                <p className="text-teal-50 text-sm">Select your preferred date & time</p>
              </div>

              <div className="p-6 space-y-6">
                
                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setConsultationType("OFFLINE")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                      consultationType === "OFFLINE" ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-teal-200"
                    }`}
                  >
                    <Building2 className={`h-5 w-5 ${consultationType === "OFFLINE" ? "text-teal-600" : "text-slate-400"}`} />
                    <span className={`text-xs font-bold ${consultationType === "OFFLINE" ? "text-teal-700" : "text-slate-500"}`}>In-Clinic Visit</span>
                  </button>
                  <button
                    onClick={() => setConsultationType("ONLINE")}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${
                      consultationType === "ONLINE" ? "border-teal-600 bg-teal-50" : "border-slate-200 hover:border-teal-200"
                    }`}
                  >
                    <Video className={`h-5 w-5 ${consultationType === "ONLINE" ? "text-teal-600" : "text-slate-400"}`} />
                    <span className={`text-xs font-bold ${consultationType === "ONLINE" ? "text-teal-700" : "text-slate-500"}`}>Video Consultation</span>
                  </button>
                </div>

                {/* Date Carousel */}
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-3 pl-1">1. Choose Date</h4>
                  <div className="relative flex items-center">
                    <button 
                      onClick={() => scroll('left')}
                      className="absolute left-0 -ml-3 z-20 flex h-9 w-9 items-center justify-center bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-md hover:bg-teal-50 hover:text-teal-600 active:scale-95 transition-all"
                      aria-label="Scroll left"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    
                    <div 
                      ref={scrollContainerRef}
                      className="flex gap-2.5 overflow-x-auto scrollbar-none px-5 py-1.5 scroll-smooth w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                      {getUpcoming7Days().map((date, idx) => {
                        const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                        const slotsCount = getSlotCountForDate(date);
                        const isToday = idx === 0;
                        const isTomorrow = idx === 1;
                        
                        const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short" });
                        const dateLabel = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });

                        return (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedSlot(null);
                            }}
                            className={`flex-none w-[105px] p-3 rounded-2xl border text-center transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                              isSelected
                                ? "border-teal-600 bg-teal-50/80 ring-1 ring-teal-600/30 shadow-md shadow-teal-600/5"
                                : "border-slate-200 bg-white hover:border-teal-300"
                            }`}
                          >
                            <p className={`text-xs font-black ${isSelected ? "text-teal-700" : "text-slate-800"}`}>
                              {dayLabel}
                            </p>
                            <p className={`text-[10px] font-bold mt-0.5 ${isSelected ? "text-teal-600" : "text-slate-500"}`}>
                              {dateLabel}
                            </p>
                            <p className={`text-[9px] font-extrabold mt-2 ${
                              slotsCount > 0 
                                ? "text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded-md" 
                                : "text-slate-400 bg-slate-50 px-1 py-0.5 rounded-md"
                            }`}>
                              {slotsCount > 0 ? `${slotsCount} ${slotsCount === 1 ? 'slot' : 'slots'}` : "No slots"}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    <button 
                      onClick={() => scroll('right')}
                      className="absolute right-0 -mr-3 z-20 flex h-9 w-9 items-center justify-center bg-white/90 backdrop-blur-md border border-slate-200 rounded-full shadow-md hover:bg-teal-50 hover:text-teal-600 active:scale-95 transition-all"
                      aria-label="Scroll right"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <h4 className="text-sm font-extrabold text-slate-800 mb-3 pl-1">2. Select Time Slot</h4>
                  {availableSlots.length > 0 ? (
                    <div className="space-y-4">
                      {/* Morning Session */}
                      {morningSlots.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 pl-1">
                            <Sunrise className="h-3.5 w-3.5 text-amber-500" />
                            <span>Morning ({morningSlots.length} slots)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {morningSlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 rounded-xl text-[12px] font-black border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                                  selectedSlot?.id === slot.id 
                                  ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-500/20" 
                                  : "border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 bg-white"
                                }`}
                              >
                                {formatTime(slot.startTime)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Afternoon Session */}
                      {afternoonSlots.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 pl-1">
                            <Sun className="h-3.5 w-3.5 text-amber-500" />
                            <span>Afternoon ({afternoonSlots.length} slots)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {afternoonSlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 rounded-xl text-[12px] font-black border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                                  selectedSlot?.id === slot.id 
                                  ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-500/20" 
                                  : "border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 bg-white"
                                }`}
                              >
                                {formatTime(slot.startTime)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Evening Session */}
                      {eveningSlots.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2 pl-1">
                            <Moon className="h-3.5 w-3.5 text-indigo-500" />
                            <span>Evening ({eveningSlots.length} slots)</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {eveningSlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => setSelectedSlot(slot)}
                                className={`py-2 rounded-xl text-[12px] font-black border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                                  selectedSlot?.id === slot.id 
                                  ? "border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-500/20" 
                                  : "border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 bg-white"
                                }`}
                              >
                                {formatTime(slot.startTime)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs font-semibold text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      No slots available on this date
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                    <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Consultation Fee</span>
                    <span className="text-lg font-black text-teal-600">₹{doctor.fees}</span>
                  </div>

                  <Button 
                    onClick={handleBooking} 
                    disabled={booking || !selectedDate || !selectedSlot}
                    className="w-full h-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-[15px] shadow-lg shadow-teal-600/20 transition-all active:scale-[0.98]"
                  >
                    {booking ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm Booking"}
                  </Button>
                  <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Payment &amp; Instant Confirmation
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Badges */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-slate-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-700 leading-tight">100% Secure<br/>Booking</p>
              </div>
              <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-slate-100 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-xs font-bold text-slate-700 leading-tight">Verified<br/>Medical Expert</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
