"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Loader2, ChevronLeft } from "lucide-react";
import { AppointmentInfo } from "@/types";
import { APPOINTMENT_STATUSES, APPOINTMENT_TYPES } from "@/lib/constants";
import { toast } from "sonner";
import { formatDisplayTime, formatWaitTime } from "@/lib/formatters";

export default function PatientAppointmentsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function loadAppointments() {
      try {
        const res = await fetch("/api/appointments");
        const data = await res.json();
        if (data.success) setAppointments(data.data);
      } catch { /* ignore */ }
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
      }
    } catch {
      toast.error("Failed to cancel");
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/dashboard/patient" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">My Appointments</h1>
          <p className="text-muted-foreground">{appointments.length} total appointments</p>
        </div>
        <Link href="/doctors">
          <Button>Book New</Button>
        </Link>
      </div>

      <div className="space-y-3">
        {appointments.map((apt) => (
          <Card key={apt.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {apt.doctor?.user?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-semibold">{apt.doctor?.user?.name}</p>
                    <p className="text-sm text-muted-foreground">{apt.doctor?.specialization}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(apt.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDisplayTime(apt.startTime)} - {formatDisplayTime(apt.endTime)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">{apt.consultationType}</Badge>
                      {apt.appointmentType && (
                        <Badge variant="outline" className={APPOINTMENT_TYPES[apt.appointmentType].color}>
                          {APPOINTMENT_TYPES[apt.appointmentType].label}
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">Queue #{apt.queueNumber || "N/A"}</Badge>
                      <Badge variant="outline" className="text-xs">Wait {formatWaitTime(apt.estimatedWaitMinutes)}</Badge>
                      {apt.notes && <span className="text-xs text-muted-foreground">📝 {apt.notes}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <Badge className={APPOINTMENT_STATUSES[apt.status as keyof typeof APPOINTMENT_STATUSES]?.color || ""}>
                    {apt.status}
                  </Badge>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
