import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SpecializationTabs from "@/components/home/SpecializationTabs";
import DoctorsCarousel from "@/components/home/DoctorsCarousel";
import SearchBar from "@/components/shared/SearchBar";
import {
  Search,
  CalendarDays,
  Clock,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Stethoscope,
  Pill,
  FlaskConical,
  Salad,
  Shield,
  Zap,
  Truck,
  FileText,
  CreditCard,
  Headphones,
} from "lucide-react";

export default async function HomePage() {
  const featuredDoctors = await prisma.doctor.findMany({
    where: { isApproved: true },
    include: { user: { select: { name: true, avatar: true } } },
    orderBy: { rating: "desc" },
    take: 10,
  });

  const serviceLinks = [
    {
      emoji: "🩺",
      label: "Consult Doctor",
      desc: "Book with verified specialists",
      href: "/doctors",
    },
    {
      emoji: "💊",
      label: "Order Medicines",
      desc: "Genuine meds, free delivery",
      href: "/medicines",
    },
    {
      emoji: "🧪",
      label: "Book Lab Tests",
      desc: "Home sample collection",
      href: "/lab-tests",
    },
    {
      emoji: "🥗",
      label: "Diet Plans",
      desc: "Expert nutrition guidance",
      href: "/nutrition",
    },
  ];

  const features = [
    { icon: Shield, label: "Verified Doctors", desc: "100% verified & experienced doctors" },
    { icon: Zap, label: "Instant Booking", desc: "Book appointments in just a few clicks" },
    { icon: Truck, label: "Fast Delivery", desc: "Medicines delivered to your doorstep" },
    { icon: FileText, label: "Accurate Reports", desc: "Lab reports in 6–24 hours" },
    { icon: CreditCard, label: "Secure Payments", desc: "Multiple payment options available" },
    { icon: Headphones, label: "24/7 Support", desc: "We're here to help you anytime" },
  ];

  return (
    <div className="flex flex-col">
      {/* ============ HERO ============ */}
      <section className="relative bg-gradient-to-br from-teal-50 via-emerald-50/40 to-white overflow-hidden min-h-[580px]">
        {/* Blob bg */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-teal-100/50 rounded-full translate-x-1/3 -translate-y-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-0 sm:pt-14">
          <div className="grid lg:grid-cols-2 gap-6 items-end">
            {/* ---- LEFT ---- */}
            <div className="pb-10 lg:pb-16 z-10">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-teal-200/80 rounded-full px-4 py-1.5 mb-6 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Trusted by 50,000+ Patients</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight leading-[1.15] mb-4 text-gray-900">
                Healthcare,
                <br />
                Simplified for{" "}
                <span className="gradient-text">Everyone</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-7 max-w-lg">
                Book appointments with top doctors, order medicines,
                book lab tests &amp; consult online — all in one place.
              </p>

              {/* ---- Search Bar ---- */}
              <div className="mt-0 mb-6">
                <SearchBar />
              </div>

              {/* ---- Service Quick Links ---- */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {serviceLinks.map((svc) => (
                  <Link key={svc.href} href={svc.href}>
                    <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-100 px-3.5 py-3 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group cursor-pointer">
                      <span className="text-xl shrink-0">{svc.emoji}</span>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs leading-tight text-slate-800 group-hover:text-primary transition-colors">{svc.label}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{svc.desc}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground ml-auto shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* ---- RIGHT: Doctor Image + Stat Cards ---- */}
            <div className="relative flex justify-center lg:justify-end items-end self-end z-10">
              {/* Circular teal bg behind doctor */}
              <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-gradient-to-br from-teal-200/60 to-emerald-100/40 rounded-full" />

              {/* Doctor Image */}
              <div className="relative z-10 w-[340px] sm:w-[380px] lg:w-[420px]">
                <Image
                  src="/doctor-hero.png"
                  alt="DocBook Healthcare Professional"
                  width={420}
                  height={520}
                  className="object-contain object-bottom drop-shadow-xl"
                  priority
                />
              </div>

              {/* Floating Stat Cards */}
              {/* 50k patients */}
              <div className="absolute top-8 left-0 lg:-left-8 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 z-20 w-[170px]">
                <div className="flex -space-x-2">
                  {["bg-teal-400", "bg-blue-400", "bg-violet-400"].map((c, i) => (
                    <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                      {["A", "B", "C"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-800 leading-none">50,000+</p>
                  <p className="text-[10px] text-muted-foreground">Happy Patients</p>
                </div>
              </div>

              {/* 4.8 Rating */}
              <div className="absolute top-1/2 right-0 lg:-right-4 -translate-y-1/2 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 z-20 w-[155px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-800 leading-none">4.8 / 5</p>
                  <p className="text-[10px] text-muted-foreground">Average Rating</p>
                </div>
              </div>

              {/* 100% Secure */}
              <div className="absolute bottom-24 left-0 lg:-left-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3 z-20 w-[160px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 shrink-0">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-base font-extrabold text-slate-800 leading-none">100%</p>
                  <p className="text-[10px] text-muted-foreground">Secure & Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ SPECIALIZATION TABS ============ */}
      <SpecializationTabs />

      {/* ============ TOP DOCTORS CAROUSEL ============ */}
      <DoctorsCarousel doctors={featuredDoctors} />

      {/* ============ FEATURES STRIP ============ */}
      <section className="py-10 border-t bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex flex-col items-center text-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="font-semibold text-sm text-slate-800">{label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="py-14 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Are you a Doctor?</h2>
          <p className="opacity-90 text-lg mb-7 max-w-xl mx-auto">
            Join DocBook and reach thousands of patients. Manage appointments & grow your practice.
          </p>
          <Link href="/register?role=DOCTOR">
            <Button size="lg" variant="secondary" className="font-semibold px-8 rounded-full text-base">
              Register as Doctor <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
