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
  Video,
  FolderHeart,
  TrendingUp,
  Home,
  Store,
  Eye,
  BarChart3,
  ThumbsUp,
  ShoppingCart,
  BadgeCheck,
} from "lucide-react";

export default async function HomePage() {
  let featuredDoctors: any[] = [];
  try {
    featuredDoctors = await prisma.doctor.findMany({
      where: { isApproved: true },
      include: { user: { select: { name: true, avatar: true } } },
      orderBy: { rating: "desc" },
      take: 10,
    });
  } catch (error) {
    console.warn("⚠️ Database query failed on HomePage, loading mock fallback doctors.", error);
    featuredDoctors = [
      {
        id: "mock-doc-1",
        userId: "mock-user-1",
        specialization: "Cardiologist",
        experience: 15,
        fees: 800,
        rating: 4.8,
        totalReviews: 120,
        clinicName: "Sharma Heart Care Clinic",
        user: {
          name: "Dr. Rajesh Sharma",
          avatar: "https://i.pravatar.cc/250?u=Rajesh"
        }
      },
      {
        id: "mock-doc-2",
        userId: "mock-user-2",
        specialization: "Gynecologist",
        experience: 12,
        fees: 600,
        rating: 4.7,
        totalReviews: 95,
        clinicName: "Anita Women's Health Clinic",
        user: {
          name: "Dr. Anita Kumari",
          avatar: "https://i.pravatar.cc/250?u=Anita"
        }
      },
      {
        id: "mock-doc-3",
        userId: "mock-user-3",
        specialization: "Pediatrician",
        experience: 8,
        fees: 500,
        rating: 4.9,
        totalReviews: 150,
        clinicName: "Little Stars Child Care",
        user: {
          name: "Dr. Meena Devi",
          avatar: "https://i.pravatar.cc/250?u=Meena"
        }
      }
    ];
  }

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

      {/* ============ DUAL CALL TO ACTION (CTA) ============ */}
      <section className="py-28 bg-[#02090d] text-white relative overflow-hidden">
        {/* Cinematographic layered neon glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-teal-500/10 via-[#0cd2b4]/10 to-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-[#0cd2b4]/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/3 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[110px] pointer-events-none animate-pulse delay-700" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            
            {/* LEFT CARD: Patients */}
            <div className="relative backdrop-blur-2xl border border-[#0cd2b4]/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#0cd2b4]/45 hover:shadow-[0_0_60px_rgba(12,210,180,0.1)] transition-all duration-500 group overflow-hidden" style={{background: 'radial-gradient(ellipse at 20% 0%, rgba(12,210,180,0.08) 0%, rgba(7,18,28,0.98) 65%)'}}>
              {/* Dot grid overlay */}
              <div className="absolute inset-0 opacity-25 pointer-events-none" style={{backgroundImage: 'radial-gradient(rgba(12,210,180,0.5) 1px, transparent 1px)', backgroundSize: '26px 26px'}} />
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0cd2b4]/50 to-transparent" />
              {/* Bottom left glow */}
              <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-teal-500/12 rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Patient Illustration */}
              <div className="absolute right-4 bottom-16 w-36 h-44 pointer-events-none select-none">
                <Image
                  src="/patient-illustration.png"
                  alt="Patient family"
                  width={144}
                  height={176}
                  className="object-contain object-bottom drop-shadow-[0_0_20px_rgba(12,210,180,0.25)] opacity-95 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              <div className="relative z-10 space-y-7">
                {/* Card Icon */}
                <div className="h-14 w-14 rounded-2xl bg-[#0cd2b4]/10 border border-[#0cd2b4]/30 flex items-center justify-center text-[#0cd2b4]">
                  <Users className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight text-white">For Patients</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[270px] font-medium">
                    Consult with top verified doctors online, order medicines with home delivery, or book lab tests from the comfort of your home.
                  </p>
                </div>

                {/* Sub Features */}
                <div className="grid grid-cols-4 pt-6 border-t border-white/[0.07]">
                  {[
                    { icon: Stethoscope, label: "Online Doctor\nConsultation" },
                    { icon: Pill, label: "Medicines\nDelivery" },
                    { icon: FlaskConical, label: "Lab Tests\nat Home" },
                    { icon: Home, label: "Home\nHealthcare" }
                  ].map((item, i) => (
                    <div key={i} className={`flex flex-col items-center text-center px-1 space-y-2.5 ${i < 3 ? 'border-r border-white/[0.07]' : ''}`}>
                      <div className="h-10 w-10 rounded-full bg-[#0a1e2a] border border-[#0cd2b4]/25 flex items-center justify-center text-[#0cd2b4] group-hover:bg-[#0cd2b4]/15 transition-colors duration-300">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 leading-tight tracking-wide max-w-[68px] whitespace-pre-line select-none">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-8">
                <Link href="/register?role=PATIENT" className="w-full block">
                  <button className="w-full h-14 bg-[#0cd2b4] hover:bg-[#0ec9ac] text-[#051016] font-extrabold text-sm tracking-widest rounded-2xl shadow-[0_4px_30px_rgba(12,210,180,0.3)] hover:shadow-[0_4px_45px_rgba(12,210,180,0.45)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 uppercase group/btn">
                    Join as Patient
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT CARD: Medical Professionals */}
            <div className="relative backdrop-blur-2xl border border-[#0cd2b4]/20 rounded-3xl p-8 sm:p-10 flex flex-col justify-between hover:border-[#0cd2b4]/45 hover:shadow-[0_0_60px_rgba(12,210,180,0.1)] transition-all duration-500 group overflow-hidden" style={{background: 'radial-gradient(ellipse at 20% 0%, rgba(12,210,180,0.08) 0%, rgba(7,18,28,0.98) 65%)'}}>
              {/* Dot grid overlay */}
              <div className="absolute inset-0 opacity-25 pointer-events-none" style={{backgroundImage: 'radial-gradient(rgba(12,210,180,0.5) 1px, transparent 1px)', backgroundSize: '26px 26px'}} />
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#0cd2b4]/50 to-transparent" />
              {/* Bottom right glow */}
              <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-[#0cd2b4]/10 rounded-full blur-3xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Doctor Illustration */}
              <div className="absolute right-4 bottom-16 w-36 h-44 pointer-events-none select-none">
                <Image
                  src="/doctor-illustration.png"
                  alt="Medical professional"
                  width={144}
                  height={176}
                  className="object-contain object-bottom drop-shadow-[0_0_20px_rgba(12,210,180,0.25)] opacity-95 group-hover:opacity-100 transition-all duration-500"
                />
              </div>

              <div className="relative z-10 space-y-7">
                {/* Card Icon */}
                <div className="h-14 w-14 rounded-2xl bg-[#0cd2b4]/10 border border-[#0cd2b4]/30 flex items-center justify-center text-[#0cd2b4]">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black tracking-tight text-white">For Medical Professionals</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-[270px] font-medium">
                    Reach thousands of new patients, streamline your clinic appointments, handle video consultations, and manage digital health records smoothly.
                  </p>
                </div>

                {/* Sub Features */}
                <div className="grid grid-cols-4 pt-6 border-t border-white/[0.07]">
                  {[
                    { icon: CalendarDays, label: "Manage\nAppointments" },
                    { icon: Video, label: "Video\nConsultations" },
                    { icon: FolderHeart, label: "Digital Health\nRecords" },
                    { icon: TrendingUp, label: "Grow Your\nPractice" }
                  ].map((item, i) => (
                    <div key={i} className={`flex flex-col items-center text-center px-1 space-y-2.5 ${i < 3 ? 'border-r border-white/[0.07]' : ''}`}>
                      <div className="h-10 w-10 rounded-full bg-[#0a1e2a] border border-[#0cd2b4]/25 flex items-center justify-center text-[#0cd2b4] group-hover:bg-[#0cd2b4]/15 transition-colors duration-300">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="text-[9px] font-semibold text-slate-400 leading-tight tracking-wide max-w-[68px] whitespace-pre-line select-none">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative z-10 pt-8">
                <Link href="/register?role=DOCTOR" className="w-full block">
                  <button className="w-full h-14 bg-[#0cd2b4] hover:bg-[#0ec9ac] text-[#051016] font-extrabold text-sm tracking-widest rounded-2xl shadow-[0_4px_30px_rgba(12,210,180,0.3)] hover:shadow-[0_4px_45px_rgba(12,210,180,0.45)] transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-3 uppercase group/btn">
                    Register as Doctor
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PHARMACY REGISTRATION CTA ============ */}
      <section className="py-20 bg-[#02090d] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-[#0cd2b4]/15 bg-[#071318]/90 p-8 shadow-[0_0_120px_rgba(12,210,180,0.12)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(12,210,180,0.12),_transparent_42%)]" />
            <div className="pointer-events-none absolute bottom-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[100px]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.35fr_0.9fr] items-center">
              <div className="space-y-6 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#0cd2b4]/20 bg-[#0cd2b4]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#a5fff0]">
                  Verified Pharmacy
                </div>
                <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                  Register as a Pharmacy
                </h2>
                <p className="max-w-2xl text-sm leading-7 text-slate-300">
                  Partner with DocBook to grow your pharmacy business, reach more customers, and manage orders efficiently through our digital platform.
                </p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {[
                    { icon: ShieldCheck, label: "Trusted network" },
                    { icon: ShoppingCart, label: "Manage orders" },
                    { icon: Truck, label: "Fast fulfillment" },
                    { icon: BadgeCheck, label: "Verified partners" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-4 text-center">
                      <div className="mx-auto mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-300">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-200">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                <Link href="/register?role=PHARMACY" className="inline-block">
                  <button className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[#0cd2b4] px-6 py-4 text-sm font-black uppercase tracking-[0.2em] text-[#051016] shadow-[0_18px_40px_rgba(12,210,180,0.24)] transition hover:bg-[#0ec9ac]">
                    Register as Pharmacy
                    <ArrowRight className="ml-3 h-4 w-4" />
                  </button>
                </Link>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#051016]/80 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#0cd2b4]/10 px-4 py-2 text-xs font-semibold text-slate-100">
                  <Store className="h-4 w-4 text-[#0cd2b4]" />
                  Pharmacy Partner
                </div>
                <div className="flex h-64 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-[#0a232c] via-[#051014] to-[#041011] p-4">
                  <Image
                    src="/images/pharmacy-partner.svg"
                    alt="Pharmacy partner illustration"
                    width={240}
                    height={240}
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
