"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Clock,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { AppointmentInfo } from "@/types";
import { APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { formatDisplayTime, formatWaitTime } from "@/lib/formatters";
import MedicalReportsPanel from "@/components/dashboard/MedicalReportsPanel";
import PatientAiPanel from "@/components/dashboard/PatientAiPanel";

export default function PatientDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user && user.role !== "PATIENT") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function loadAppointments() {
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        if (data.success) setAppointments(data.data);
      } catch {
        console.error("Failed to fetch appointments");
      }
      setLoading(false);
    }

    void loadAppointments();
  }, [user]);

  async function cancelAppointment(id: string) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CANCELLED" }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Appointment cancelled");
        const refreshed = await fetch("/api/appointments");
        const refreshedData = await refreshed.json();
        if (refreshedData.success) setAppointments(refreshedData.data);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to cancel");
    }
  }

  const upcoming = appointments.filter((a) => ["PENDING", "CONFIRMED"].includes(a.status));
  const past = appointments.filter((a) => ["COMPLETED", "CANCELLED"].includes(a.status));

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user?.name?.split(" ")[0]} 👋</h1>
        <p className="text-muted-foreground mt-1">Manage your appointments and health records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Bookings", value: appointments.length, icon: CalendarDays, color: "text-teal-600" },
          { label: "Upcoming", value: upcoming.length, icon: Clock, color: "text-blue-600" },
          { label: "Completed", value: appointments.filter((a) => a.status === "COMPLETED").length, icon: CheckCircle2, color: "text-green-600" },
          { label: "Cancelled", value: appointments.filter((a) => a.status === "CANCELLED").length, icon: XCircle, color: "text-red-500" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
          <Link href="/doctors">
            <Button size="sm">Book New</Button>
          </Link>
        </div>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium">No upcoming appointments</p>
              <p className="text-sm text-muted-foreground mt-1">Book an appointment with a doctor</p>
              <Link href="/doctors">
                <Button className="mt-4" size="sm">Find Doctors</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((apt) => (
              <Card key={apt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 relative">
                          {apt.doctor?.user?.name?.charAt(0) || "D"}
                          {apt.isEmergency && (
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full flex items-center justify-center border-2 border-background">
                              <AlertCircle className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{apt.doctor?.user?.name}</p>
                            {apt.isEmergency && (
                              <Badge variant="destructive" className="h-5 text-[10px] uppercase font-bold">Emergency</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{apt.doctor?.specialization}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {new Date(apt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDisplayTime(apt.startTime)}
                            </span>
                            {apt.appointmentType && (
                              <Badge variant="outline" className={APPOINTMENT_TYPES[apt.appointmentType].color}>
                                {APPOINTMENT_TYPES[apt.appointmentType].label}
                              </Badge>
                            )}
                            <Badge variant="secondary" className="h-5 text-[10px] font-bold">
                              Token No: {apt.queueNumber || "N/A"}
                            </Badge>
                            <Badge variant="outline" className="h-5 text-[10px]">
                              Wait: {formatWaitTime(apt.estimatedWaitMinutes)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                        <div className="flex gap-2">
                          <Badge className={APPOINTMENT_STATUSES[apt.status as keyof typeof APPOINTMENT_STATUSES]?.color || ""}>
                            {apt.status}
                          </Badge>
                          <Badge variant={apt.paymentStatus === "PAID" ? "default" : "outline"} className={apt.paymentStatus === "PAID" ? "bg-green-600" : ""}>
                            {apt.paymentStatus || "PENDING"}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {apt.doctor?.user?.phone && (
                            <a href={`tel:${apt.doctor.user.phone}`}>
                              <Button variant="outline" size="sm">Call</Button>
                            </a>
                          )}
                          <a href={`https://wa.me/${apt.doctor?.user?.phone?.replace(/\D/g, '')}`} target="_blank">
                            <Button variant="outline" size="sm" className="bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 border-green-200">Message</Button>
                          </a>
                          {["PENDING", "CONFIRMED"].includes(apt.status) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => cancelAppointment(apt.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <MedicalReportsPanel />
        <PatientAiPanel />
      </div>

      {/* Past Appointments */}
      {past.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Past Appointments</h2>
          <div className="space-y-3">
            {past.map((apt) => (
              <Card key={apt.id} className="opacity-80">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
                        {apt.doctor?.user?.name?.charAt(0) || "D"}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{apt.doctor?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(apt.date).toLocaleDateString("en-IN")} • {formatDisplayTime(apt.startTime)}
                        </p>
                      </div>
                    </div>
                    <Badge className={APPOINTMENT_STATUSES[apt.status as keyof typeof APPOINTMENT_STATUSES]?.color || ""}>
                      {apt.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
