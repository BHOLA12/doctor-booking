"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Stethoscope,
  CalendarDays,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

interface Stats {
  totalUsers: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingDoctors: number;
  recentAppointments: number;
  appointmentsByStatus: { status: string; count: number }[];
  topSpecializations: { specialization: string; count: number }[];
}

interface DoctorEntry {
  id: string;
  specialization: string;
  experience: number;
  fees: number;
  isApproved: boolean;
  rating: number;
  city: string;
  user: { id: string; name: string; email: string; phone: string | null };
  _count: { appointments: number; reviews: number };
}

interface UserEntry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [doctors, setDoctors] = useState<DoctorEntry[]>([]);
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user && user.role !== "ADMIN") router.push("/dashboard");
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    async function loadAdminData() {
      try {
        const [statsRes, doctorsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/doctors"),
          fetch("/api/admin/users"),
        ]);
        const [statsData, doctorsData, usersData] = await Promise.all([
          statsRes.json(),
          doctorsRes.json(),
          usersRes.json(),
        ]);
        if (statsData.success) setStats(statsData.data);
        if (doctorsData.success) setDoctors(doctorsData.data);
        if (usersData.success) setUsers(usersData.data);
      } catch {
        console.error("Failed to fetch admin data");
      }
      setLoading(false);
    }

    void loadAdminData();
  }, [user]);

  async function handleApproval(doctorId: string, isApproved: boolean) {
    try {
      const res = await fetch("/api/admin/stats", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId, isApproved }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isApproved ? "Doctor approved!" : "Doctor rejected");
        const [statsRes, doctorsRes, usersRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/doctors"),
          fetch("/api/admin/users"),
        ]);
        const [statsData, doctorsData, usersData] = await Promise.all([
          statsRes.json(),
          doctorsRes.json(),
          usersRes.json(),
        ]);
        if (statsData.success) setStats(statsData.data);
        if (doctorsData.success) setDoctors(doctorsData.data);
        if (usersData.success) setUsers(usersData.data);
      } else {
        toast.error(data.error);
      }
    } catch {
      toast.error("Failed to update");
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard 🛡️</h1>
        <p className="text-muted-foreground mt-1">Platform overview and management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-600" },
          { label: "Active Doctors", value: stats?.totalDoctors || 0, icon: Stethoscope, color: "text-teal-600" },
          { label: "Total Bookings", value: stats?.totalAppointments || 0, icon: CalendarDays, color: "text-purple-600" },
          { label: "Pending Approvals", value: stats?.pendingDoctors || 0, icon: AlertCircle, color: "text-amber-600" },
          { label: "This Week", value: stats?.recentAppointments || 0, icon: TrendingUp, color: "text-green-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.appointmentsByStatus?.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${
                      item.status === "CONFIRMED" ? "bg-green-500" :
                      item.status === "PENDING" ? "bg-amber-500" :
                      item.status === "COMPLETED" ? "bg-blue-500" : "bg-red-500"
                    }`} />
                    <span className="text-sm capitalize">{item.status.toLowerCase()}</span>
                  </div>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-primary" />
              Top Specializations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.topSpecializations?.map((item, idx) => (
                <div key={item.specialization} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground w-5">#{idx + 1}</span>
                    <span className="text-sm">{item.specialization}</span>
                  </div>
                  <Badge variant="secondary">{item.count} doctors</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Management Tabs */}
      <Tabs defaultValue="doctors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="doctors">
            Doctors ({doctors.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Appointments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doctors.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{doc.user.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{doc.specialization}</TableCell>
                      <TableCell>{doc.experience} yrs</TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1">
                          <span>⭐</span> {doc.rating.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>{doc._count.appointments}</TableCell>
                      <TableCell>
                        <Badge variant={doc.isApproved ? "default" : "outline"} className={doc.isApproved ? "bg-green-100 text-green-800" : "text-amber-600"}>
                          {doc.isApproved ? "Approved" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {!doc.isApproved ? (
                          <div className="flex gap-1">
                            <Button size="sm" variant="default" onClick={() => handleApproval(doc.id, true)}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleApproval(doc.id, false)}>
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" className="text-destructive text-xs" onClick={() => handleApproval(doc.id, false)}>
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.phone || "—"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{u.role.toLowerCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        {u.isVerified ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
