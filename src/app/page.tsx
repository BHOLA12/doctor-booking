import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Star,
  MapPin,
  Clock,
  Users,
  Stethoscope,
  Award,
  CalendarCheck,
  ArrowRight,
  Heart,
  Shield,
  Zap,
} from "lucide-react";
import { SPECIALIZATIONS } from "@/lib/constants";

export default async function HomePage() {
  const [featuredDoctors, totalDoctors, totalAppointments] = await Promise.all([
    prisma.doctor.findMany({
      where: { isApproved: true },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { rating: "desc" },
      take: 6,
    }),
    prisma.doctor.count({ where: { isApproved: true } }),
    prisma.appointment.count(),
  ]);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-teal-200)_0%,_transparent_50%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--color-teal-100)_0%,_transparent_50%)] opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium rounded-full">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              Available Worldwide
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Find & Book{" "}
              <span className="gradient-text">Top Doctors</span>
              <br />
              Near You
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              Book appointments with verified doctors across the globe. Search by specialization,
              choose your city, and get quality healthcare at your convenience.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Link href="/doctors" className="block">
                  <div className="w-full h-12 pl-12 pr-4 rounded-xl border bg-background/80 backdrop-blur-sm flex items-center text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer">
                    Search doctors, specializations...
                  </div>
                </Link>
              </div>
              <Link href="/doctors">
                <Button size="lg" className="h-12 px-8 rounded-xl text-base font-semibold gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </Link>
            </div>

            {/* Quick Specializations */}
            <div className="mt-6 flex flex-wrap gap-2">
              {SPECIALIZATIONS.slice(0, 5).map((spec) => (
                <Link key={spec.value} href={`/doctors?specialization=${spec.value}`}>
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all"
                  >
                    {spec.icon} {spec.label}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Stethoscope, label: "Verified Doctors", value: `${totalDoctors}+`, color: "text-teal-600" },
              { icon: CalendarCheck, label: "Appointments", value: `${totalAppointments}+`, color: "text-blue-600" },
              { icon: Award, label: "Specializations", value: "12+", color: "text-amber-600" },
              { icon: Users, label: "Happy Patients", value: "500+", color: "text-emerald-600" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Browse by Specialization</h2>
            <p className="mt-3 text-lg text-muted-foreground">Find the right doctor for your health needs</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SPECIALIZATIONS.map((spec) => (
              <Link key={spec.value} href={`/doctors?specialization=${spec.value}`}>
                <Card className="group hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{spec.icon}</span>
                    <p className="text-sm font-medium">{spec.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Top Rated Doctors</h2>
              <p className="mt-3 text-lg text-muted-foreground">Trusted by patients worldwide</p>
            </div>
            <Link href="/doctors">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredDoctors.map((doctor) => (
              <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
                <Card className="group hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-bold">
                        {doctor.user.name.split(" ").filter((_,i) => i > 0).map(n => n[0]).join("").slice(0, 2) || doctor.user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                          {doctor.user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-sm">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-medium">{doctor.rating.toFixed(1)}</span>
                            <span className="text-muted-foreground">({doctor.totalReviews})</span>
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {doctor.experience} yrs exp
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" />
                        {doctor.city}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                        <Clock className="h-3.5 w-3.5" />
                        ₹{doctor.fees}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-all"
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link href="/doctors">
              <Button variant="outline" className="gap-2">
                View All Doctors <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold">Why Choose DocBook?</h2>
            <p className="mt-3 text-lg text-muted-foreground">Healthcare made simple, anywhere</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Doctors",
                description: "All doctors are verified by our admin team. Only qualified and experienced professionals are listed.",
                color: "text-teal-600 bg-teal-50",
              },
              {
                icon: Zap,
                title: "Instant Booking",
                description: "Book appointments in seconds. Choose your preferred time slot and consultation type.",
                color: "text-blue-600 bg-blue-50",
              },
              {
                icon: Heart,
                title: "Trusted Reviews",
                description: "Read genuine patient reviews and ratings to make informed decisions about your healthcare.",
                color: "text-rose-600 bg-rose-50",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-none shadow-sm hover:shadow-lg transition-all duration-300">
                <CardContent className="p-8">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.color} mb-4`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Are you a Doctor?</h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join DocBook and reach thousands of patients worldwide. Manage your appointments,
            build your online reputation, and grow your practice.
          </p>
          <Link href="/register?role=DOCTOR">
            <Button size="lg" variant="secondary" className="text-base font-semibold px-8 rounded-full">
              Register as Doctor
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
