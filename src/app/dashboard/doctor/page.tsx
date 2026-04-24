"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Clock,
  Users,
  CheckCircle2,
  Loader2,
  Save,
  Star,
  Navigation2,
} from "lucide-react";
import { AppointmentInfo } from "@/types";
import { APPOINTMENT_STATUSES, APPOINTMENT_TYPES, SPECIALIZATIONS } from "@/lib/constants";
import { toast } from "sonner";
import { formatDisplayTime, formatWaitTime } from "@/lib/formatters";
import DoctorPrescriptionPanel from "@/components/dashboard/DoctorPrescriptionPanel";

export default function DoctorDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
  const [doctorProfile, setDoctorProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: "",
    specialization: "",
    experience: 0,
    licenseNumber: "",
    fees: 0,
    bio: "",
    clinicName: "",
    clinicAddress: "",
    city: "",
    state: "",
    country: "",
    consultationType: "BOTH",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user && user.role !== "DOCTOR") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAppointments();
      fetchProfile();
    }
  }, [user]);

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/appointments");
      const data = await res.json();
      if (data.success) setAppointments(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function fetchProfile() {
    try {
      const res = await fetch("/api/doctors/me");
      const data = await res.json();
      if (data.success && data.data) {
        const doc = data.data;
        setDoctorProfile(doc);
        setProfileForm({
          name: doc.user?.name || "",
          specialization: doc.specialization,
          experience: doc.experience,
          licenseNumber: doc.licenseNumber || "",
          fees: doc.fees,
          bio: doc.bio || "",
          clinicName: doc.clinicName || "",
          clinicAddress: doc.clinicAddress || "",
          city: doc.city || "",
          state: doc.state || "",
          country: doc.country || "",
          consultationType: doc.consultationType,
          latitude: doc.latitude || 0,
          longitude: doc.longitude || 0,
        });
      }
    } catch { /* ignore */ }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Appointment ${status.toLowerCase()}`);
        fetchAppointments();
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update");
    }
  }

  async function saveProfile() {
    if (!doctorProfile) return;
    if (!profileForm.country || !profileForm.state || !profileForm.city) {
      toast.error("Country, State, and City are required");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/doctors/${(doctorProfile as { id: string }).id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Profile updated!");
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to save");
    }
    setSaving(false);
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    toast.info("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setProfileForm({
          ...profileForm,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        toast.success("Location detected!");
      },
      () => {
        toast.error("Unable to retrieve your location");
      }
    );
  };

  const pending = appointments.filter((a) => a.status === "PENDING");
  const confirmed = appointments.filter((a) => a.status === "CONFIRMED");
  const completed = appointments.filter((a) => a.status === "COMPLETED");

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
        <h1 className="text-3xl font-bold">Doctor Dashboard 🩺</h1>
        <p className="text-muted-foreground mt-1">
          Manage your appointments and profile
          {doctorProfile && !(doctorProfile as { isApproved: boolean }).isApproved && (
            <Badge variant="outline" className="ml-2 text-amber-600 border-amber-300">
              ⏳ Pending Approval
            </Badge>
          )}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending", value: pending.length, icon: Clock, color: "text-amber-600" },
          { label: "Confirmed", value: confirmed.length, icon: CheckCircle2, color: "text-green-600" },
          { label: "Completed", value: completed.length, icon: Star, color: "text-blue-600" },
          { label: "Total Patients", value: appointments.length, icon: Users, color: "text-teal-600" },
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

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          {appointments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="font-medium">No appointments yet</p>
                <p className="text-sm text-muted-foreground mt-1">Appointments will appear here</p>
              </CardContent>
            </Card>
          ) : (
            appointments.map((apt) => (
              <Card key={apt.id} className={`hover:shadow-md transition-shadow ${apt.isEmergency ? "border-red-200 bg-red-50/10" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0 relative">
                        {apt.patient?.name?.charAt(0) || "P"}
                        {apt.isEmergency && (
                          <div className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-600 rounded-full flex items-center justify-center border-2 border-background">
                            <Clock className="h-2 w-2 text-white" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{apt.patient?.name}</p>
                          {apt.isEmergency && (
                            <Badge variant="destructive" className="h-4 text-[9px] uppercase font-bold">Emergency</Badge>
                          )}
                          {apt.appointmentType && (
                            <Badge variant="outline" className={APPOINTMENT_TYPES[apt.appointmentType].color}>
                              {APPOINTMENT_TYPES[apt.appointmentType].label}
                            </Badge>
                          )}
                          <Badge variant="secondary" className="h-4 text-[9px] font-bold">Token: {apt.queueNumber || "N/A"}</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {new Date(apt.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {formatDisplayTime(apt.startTime)}
                          </span>
                          <span className="text-xs font-medium text-primary">Wait: {formatWaitTime(apt.estimatedWaitMinutes)}</span>
                          <Badge variant="outline" className="text-[10px] h-4">{apt.consultationType}</Badge>
                          <Badge variant={apt.paymentStatus === "PAID" ? "default" : "outline"} className={`h-4 text-[9px] ${apt.paymentStatus === "PAID" ? "bg-green-600 text-white border-0" : ""}`}>
                            {apt.paymentStatus || "PENDING"}
                          </Badge>
                        </div>
                        {apt.notes && <p className="text-xs text-muted-foreground mt-1 bg-muted/50 p-1.5 rounded">Note: {apt.notes}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        {apt.patient?.phone && (
                          <div className="flex gap-1">
                            <a href={`tel:${apt.patient.phone}`} title="Call Patient">
                              <Button variant="outline" size="icon" className="h-8 w-8">
                                <Clock className="h-4 w-4" />
                              </Button>
                            </a>
                            <a href={`https://wa.me/${apt.patient.phone.replace(/\D/g, '')}`} target="_blank" title="WhatsApp Patient">
                              <Button variant="outline" size="icon" className="h-8 w-8 bg-green-50 text-green-700 border-green-200">
                                <Save className="h-4 w-4" />
                              </Button>
                            </a>
                          </div>
                        )}
                        <Badge className={APPOINTMENT_STATUSES[apt.status as keyof typeof APPOINTMENT_STATUSES]?.color || ""}>
                          {apt.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        {apt.status === "PENDING" && (
                          <>
                            <Button size="sm" className="h-8" onClick={() => updateStatus(apt.id, "CONFIRMED")}>Accept</Button>
                            <Button size="sm" variant="outline" className="h-8 text-destructive border-destructive/20" onClick={() => updateStatus(apt.id, "CANCELLED")}>Reject</Button>
                          </>
                        )}
                        {apt.status === "CONFIRMED" && (
                          <Button size="sm" variant="outline" className="h-8 border-primary/20 text-primary" onClick={() => updateStatus(apt.id, "COMPLETED")}>Mark Completed</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="prescriptions">
          <DoctorPrescriptionPanel appointments={appointments} />
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Specialization</Label>
                  <Select value={profileForm.specialization} onValueChange={(v) => v && setProfileForm({ ...profileForm, specialization: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SPECIALIZATIONS.map((s) => (
                        <SelectItem key={s.label} value={s.label}>{s.icon} {s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Experience (years)</Label>
                  <Input type="number" value={profileForm.experience} onChange={(e) => setProfileForm({ ...profileForm, experience: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>License Number</Label>
                  <Input value={profileForm.licenseNumber} onChange={(e) => setProfileForm({ ...profileForm, licenseNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Consultation Fee (₹)</Label>
                  <Input type="number" value={profileForm.fees} onChange={(e) => setProfileForm({ ...profileForm, fees: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Clinic Name</Label>
                  <Input value={profileForm.clinicName} onChange={(e) => setProfileForm({ ...profileForm, clinicName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Consultation Type</Label>
                  <Select value={profileForm.consultationType} onValueChange={(v) => v && setProfileForm({ ...profileForm, consultationType: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONLINE">Online Only</SelectItem>
                      <SelectItem value="OFFLINE">Offline Only</SelectItem>
                      <SelectItem value="BOTH">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input type="number" step="any" value={profileForm.latitude} onChange={(e) => setProfileForm({ ...profileForm, latitude: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input type="number" step="any" value={profileForm.longitude} onChange={(e) => setProfileForm({ ...profileForm, longitude: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={detectLocation}>
                  <Navigation2 className="h-4 w-4 mr-2" /> Detect My Location
                </Button>
                {profileForm.latitude !== 0 && (
                  <a href={`https://www.google.com/maps?q=${profileForm.latitude},${profileForm.longitude}`} target="_blank" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      View on Map
                    </Button>
                  </a>
                )}
              </div>
              <div className="space-y-2">
                <Label>Clinic Address</Label>
                <Input value={profileForm.clinicAddress} onChange={(e) => setProfileForm({ ...profileForm, clinicAddress: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Country <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="e.g. India" 
                    value={profileForm.country} 
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>State <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="e.g. Bihar" 
                    value={profileForm.state} 
                    onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label>City <span className="text-red-500">*</span></Label>
                  <Input 
                    placeholder="e.g. Jehanabad" 
                    value={profileForm.city} 
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })} 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio / About</Label>
                <Textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })} rows={4} />
              </div>
              <Button onClick={saveProfile} disabled={saving} className="gap-2">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
