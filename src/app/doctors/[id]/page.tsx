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
} from "lucide-react";
import { APPOINTMENT_TYPES, DAYS_OF_WEEK } from "@/lib/constants";
import { DoctorProfile, SlotInfo, ReviewInfo } from "@/types";
import { toast } from "sonner";
import Link from "next/link";
import { formatWaitTime } from "@/lib/formatters";

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
  const [isEmergency, setIsEmergency] = useState(false);
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
    
    // Simulated Payment Step
    toast.info("Redirecting to payment gateway...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Payment Successful!");
    await new Promise(resolve => setTimeout(resolve, 500));

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
          isEmergency,
          appointmentType,
          symptoms: notes || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Appointment booked. Queue #${data.data.queueNumber}, wait ${formatWaitTime(data.data.estimatedWaitMinutes)}`);
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Doctor not found</p>
        <Link href="/doctors">
          <Button variant="outline" className="mt-4">
            Back to Doctors
          </Button>
        </Link>
      </div>
    );
  }

  const availableSlots = getAvailableSlots();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/doctors" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" />
        Back to Doctors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctor Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary text-3xl font-bold">
                  {doctor.user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold">{doctor.user.name}</h1>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge>{doctor.specialization}</Badge>
                        <Badge variant="outline">{doctor.consultationType === "BOTH" ? "Online & Offline" : doctor.consultationType}</Badge>
                        {doctor.isApproved && (
                          <Badge variant="secondary" className="gap-1">
                            <Award className="h-3 w-3" /> Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-foreground">{doctor.rating.toFixed(1)}</span>
                      ({doctor.totalReviews} reviews)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {doctor.experience} years experience
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {doctor.city}, {doctor.state}
                    </span>
                  </div>

                  {doctor.bio && (
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{doctor.bio}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clinic Info */}
          {doctor.clinicName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Clinic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{doctor.clinicName}</p>
                  <p className="text-sm text-muted-foreground">{doctor.clinicAddress}</p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 font-semibold text-primary">
                    <Stethoscope className="h-4 w-4" />
                    Consultation Fee: ₹{doctor.fees}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Google Maps - Clinic Location */}
          {doctor.clinicAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Clinic Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-xl overflow-hidden border">
                  <iframe
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(
                      `${doctor.clinicName || ''} ${doctor.clinicAddress || ''} ${doctor.city || ''} ${doctor.state || ''}`
                    )}`}
                    allowFullScreen
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      `${doctor.clinicAddress || ''} ${doctor.city || ''} ${doctor.state || ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <Navigation2 className="h-4 w-4" />
                      Get Directions
                    </Button>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${doctor.clinicName || ''} ${doctor.clinicAddress || ''} ${doctor.city || ''}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <MapPin className="h-4 w-4" />
                      Open in Google Maps
                    </Button>
                  </a>
                </div>
                <p className="text-xs text-muted-foreground">
                  📍 {doctor.clinicAddress}{doctor.city ? `, ${doctor.city}` : ''}{doctor.state ? `, ${doctor.state}` : ''}
                </p>
              </CardContent>
            </Card>
          )}
          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DAYS_OF_WEEK.map((day, idx) => {
                  const daySlots = doctor.slots?.filter((s) => s.dayOfWeek === idx && s.isActive) || [];
                  return (
                    <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <span className="font-medium text-sm">{day}</span>
                      {daySlots.length > 0 ? (
                        <span className="text-xs text-muted-foreground">
                          {formatTime(daySlots[0].startTime)} - {formatTime(daySlots[daySlots.length - 1].endTime)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Closed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Patient Reviews ({doctor.totalReviews})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {doctor.reviews && doctor.reviews.length > 0 ? (
                <div className="space-y-4">
                  {doctor.reviews.map((review: ReviewInfo) => (
                    <div key={review.id} className="p-4 rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                            {review.patient?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{review.patient?.name}</p>
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }, (_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">No reviews yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card className="shadow-lg border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Book Appointment</CardTitle>
                <p className="text-sm text-muted-foreground">Select date, time & type</p>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Consultation Type */}
                <div>
                  <p className="text-sm font-medium mb-2">Consultation Type</p>
                  <div className="flex gap-2">
                    <Button
                      variant={consultationType === "OFFLINE" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setConsultationType("OFFLINE")}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      In-Clinic
                    </Button>
                    <Button
                      variant={consultationType === "ONLINE" ? "default" : "outline"}
                      size="sm"
                      className="flex-1 gap-1.5"
                      onClick={() => setConsultationType("ONLINE")}
                    >
                      <Video className="h-3.5 w-3.5" />
                      Online
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Calendar */}
                <div>
                  <p className="text-sm font-medium mb-2">Select Date</p>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    className="rounded-lg border mx-auto"
                  />
                </div>

                <Separator />

                {/* Time Slots */}
                <div>
                  <p className="text-sm font-medium mb-2">
                    Available Slots {selectedDate && `(${DAYS_OF_WEEK[selectedDate.getDay()]})`}
                  </p>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <Button
                          key={slot.id}
                          variant={selectedSlot?.id === slot.id ? "default" : "outline"}
                          size="sm"
                          className="text-xs"
                          onClick={() => setSelectedSlot(slot)}
                        >
                          {formatTime(slot.startTime)}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No slots available for this day
                    </p>
                  )}
                </div>

                {/* Emergency Checkbox */}
                <div className="space-y-2">
                  <p className="text-sm font-medium">Appointment Priority</p>
                  <div className="grid gap-2">
                    {Object.entries(APPOINTMENT_TYPES).map(([value, meta]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          setAppointmentType(value as "EMERGENCY" | "FOLLOW_UP" | "NORMAL");
                          setIsEmergency(value === "EMERGENCY");
                        }}
                        className={`rounded-lg border p-3 text-left transition ${
                          appointmentType === value ? "border-primary bg-primary/5" : "border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{meta.label}</span>
                          {value === "EMERGENCY" ? <Siren className="h-4 w-4 text-red-600" /> : null}
                        </div>
                        <p className="text-xs text-muted-foreground">Queue rank {meta.rank}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-sm font-medium mb-2">Notes (optional)</p>
                  <Textarea
                    placeholder="Describe your symptoms..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="resize-none"
                    rows={3}
                  />
                </div>

                {/* Fee Summary */}
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Consultation Fee</span>
                    <span className="font-semibold">₹{doctor.fees}</span>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  className="w-full h-11 text-base font-semibold"
                  disabled={!selectedDate || !selectedSlot || booking}
                  onClick={handleBooking}
                >
                  {booking ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-muted-foreground">
                    Please{" "}
                    <Link href={`/login?redirect=/doctors/${id}`} className="text-primary hover:underline">
                      login
                    </Link>{" "}
                    to book an appointment
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <p className="font-medium text-sm">Contact</p>
                {doctor.user.email && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {doctor.user.email}
                  </p>
                )}
                {doctor.user.phone && (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {doctor.user.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
