"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
  Eye,
  FileText,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Image from "next/image";

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
  licenseNumber: string | null;
  bio: string | null;
  clinicName: string | null;
  clinicAddress: string | null;
  consultationType: string;
  degree: string | null;
  college: string | null;
  experienceHospitals: string | null;
  currentHospitalName: string | null;
  user: { id: string; name: string; email: string; phone: string | null; avatar: string | null };
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
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorEntry | null>(null);

  // Doctor states
  const [doctors, setDoctors] = useState<DoctorEntry[]>([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorPagination, setDoctorPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // User states
  const [users, setUsers] = useState<UserEntry[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState({ total: 0, totalPages: 1, limit: 10 });
  const [usersLoading, setUsersLoading] = useState(true);

  const debouncedDoctorSearch = useDebounce(doctorSearch, 300);
  const debouncedUserSearch = useDebounce(userSearch, 300);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user && user.role !== "ADMIN") router.push("/dashboard");
  }, [user, authLoading, router]);

  // Fetch stats once on mount
  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        if (data.success) setStats(data.data);
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      }
      setLoading(false);
    }
    void loadStats();
  }, [user]);

  // Fetch doctors on query/page change
  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    async function loadDoctors() {
      setDoctorsLoading(true);
      try {
        const res = await fetch(
          `/api/admin/doctors?q=${encodeURIComponent(debouncedDoctorSearch)}&page=${doctorPage}&limit=10`
        );
        const data = await res.json();
        if (data.success) {
          setDoctors(data.data);
          setDoctorPagination(data.pagination || { total: data.data.length, totalPages: 1, limit: 10 });
        }
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
      setDoctorsLoading(false);
    }
    void loadDoctors();
  }, [user, debouncedDoctorSearch, doctorPage]);

  // Fetch users on query/page change
  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    async function loadUsers() {
      setUsersLoading(true);
      try {
        const res = await fetch(
          `/api/admin/users?q=${encodeURIComponent(debouncedUserSearch)}&page=${userPage}&limit=10`
        );
        const data = await res.json();
        if (data.success) {
          setUsers(data.data);
          setUserPagination(data.pagination || { total: data.data.length, totalPages: 1, limit: 10 });
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
      setUsersLoading(false);
    }
    void loadUsers();
  }, [user, debouncedUserSearch, userPage]);

  async function handleApproval(doctorId: string, isApproved: boolean) {
    try {
      const res = await fetch(`/api/admin/doctors/${doctorId}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(isApproved ? "Doctor approved!" : "Doctor rejected");
        
        // Refresh stats
        const statsRes = await fetch("/api/admin/stats");
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);
        
        // Refresh doctors list
        const docsRes = await fetch(
          `/api/admin/doctors?q=${encodeURIComponent(debouncedDoctorSearch)}&page=${doctorPage}&limit=10`
        );
        const docsData = await docsRes.json();
        if (docsData.success) {
          setDoctors(docsData.data);
          setDoctorPagination(docsData.pagination || { total: docsData.data.length, totalPages: 1, limit: 10 });
        }
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
            Doctors ({doctorPagination.total})
          </TabsTrigger>
          <TabsTrigger value="users">
            Users ({userPagination.total})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors">
          <Card>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <Input
                placeholder="Search doctors by name, email, specialization, or city..."
                value={doctorSearch}
                onChange={(e) => {
                  setDoctorSearch(e.target.value);
                  setDoctorPage(1);
                }}
                className="max-w-md"
              />
              <span className="text-xs text-muted-foreground">
                Showing {doctors.length} of {doctorPagination.total} doctors
              </span>
            </div>
            <CardContent className="p-0">
              {doctorsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : doctors.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No doctors found matching the search criteria.
                </div>
              ) : (
                <>
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
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold shrink-0 overflow-hidden relative border border-slate-200">
                                 {doc.user.avatar ? (
                                   <Image src={doc.user.avatar} alt={doc.user.name} fill className="object-cover" />
                                 ) : (
                                   doc.user.name.charAt(0)
                                 )}
                              </div>
                              <div>
                                <p className="font-medium">{doc.user.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.user.email}</p>
                              </div>
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
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 w-8 p-0"
                                onClick={() => setSelectedDoctor(doc)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {!doc.isApproved ? (
                                <>
                                  <Button size="sm" variant="default" className="h-8 w-8 p-0" onClick={() => handleApproval(doc.id, true)} title="Approve">
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive" onClick={() => handleApproval(doc.id, false)} title="Reject">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button size="sm" variant="outline" className="text-destructive text-xs h-8 px-2" onClick={() => handleApproval(doc.id, false)}>
                                  Revoke
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {doctorPagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDoctorPage(p => Math.max(1, p - 1))}
                        disabled={doctorPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {doctorPage} of {doctorPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDoctorPage(p => Math.min(doctorPagination.totalPages, p + 1))}
                        disabled={doctorPage === doctorPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <Input
                placeholder="Search users by name, email, or phone..."
                value={userSearch}
                onChange={(e) => {
                  setUserSearch(e.target.value);
                  setUserPage(1);
                }}
                className="max-w-md"
              />
              <span className="text-xs text-muted-foreground">
                Showing {users.length} of {userPagination.total} users
              </span>
            </div>
            <CardContent className="p-0">
              {usersLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : users.length === 0 ? (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No users found matching the search criteria.
                </div>
              ) : (
                <>
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

                  {userPagination.totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserPage(p => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="text-sm">
                        Page {userPage} of {userPagination.totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserPage(p => Math.min(userPagination.totalPages, p + 1))}
                        disabled={userPage === userPagination.totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Doctor Details Dialog */}
      <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              Doctor Verification Details
              <Badge variant={selectedDoctor?.isApproved ? "default" : "outline"} className={selectedDoctor?.isApproved ? "bg-green-100 text-green-800" : "text-amber-600 ml-2"}>
                {selectedDoctor?.isApproved ? "Approved" : "Pending Approval"}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Review doctor credentials and clinic information for verification.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal & Professional Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Users className="h-4 w-4" /> Personal Information
                    </h3>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{selectedDoctor.user.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.user.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.user.phone || "No phone provided"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4" /> Professional Credentials
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>License Number:</span>
                        <span className="font-mono font-medium text-primary bg-primary/5 px-2 rounded">
                          {selectedDoctor.licenseNumber || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Specialization:</span>
                        <span className="font-medium">{selectedDoctor.specialization}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Experience:</span>
                        <span className="font-medium">{selectedDoctor.experience} Years</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clinic & Practice Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> Clinic Details
                    </h3>
                    <div className="space-y-1">
                      <p className="font-medium">{selectedDoctor.clinicName || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.clinicAddress || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">{selectedDoctor.city || "N/A"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Practice Info
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Consultation:</span>
                        <Badge variant="secondary" className="capitalize">{selectedDoctor.consultationType.toLowerCase()}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Consultation Fee:</span>
                        <span className="font-medium">₹{selectedDoctor.fees}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Education & Background
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Degree:</span>
                      <span className="font-medium">{selectedDoctor.degree || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">MBBS College:</span>
                      <span className="font-medium">{selectedDoctor.college || "N/A"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Workplace History
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Past Exp:</span>
                      <span className="font-medium">{selectedDoctor.experienceHospitals || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current:</span>
                      <span className="font-medium text-primary">{selectedDoctor.currentHospitalName || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <FileText className="h-4 w-4" /> Professional Bio
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg italic">
                  "{selectedDoctor.bio || "No bio provided."}"
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setSelectedDoctor(null)}>
                  Close
                </Button>
                {!selectedDoctor.isApproved ? (
                  <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      void handleApproval(selectedDoctor.id, true);
                      setSelectedDoctor(null);
                    }}
                  >
                    Approve Doctor
                  </Button>
                ) : (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      void handleApproval(selectedDoctor.id, false);
                      setSelectedDoctor(null);
                    }}
                  >
                    Revoke Approval
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
