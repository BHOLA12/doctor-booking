"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/shared/SearchBar";
import VoiceAssistantSection from "@/components/home/VoiceAssistantSection";
import {
  MapPin,
  Stethoscope,
  Pill,
  FlaskConical,
  Zap,
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Info,
  Clock,
  Building,
  Store,
  Calendar
} from "lucide-react";

export default function HomePage() {
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);

  // Active locations for Bihar network mapping
  const locations = [
    { name: "Jehanabad, Bihar", status: "Live & Active 🟢", desc: "Local chemist dispatch in 15 mins" },
    { name: "Gaya, Bihar", status: "Next-Closest Node 🟡", desc: "Sourcing for out-of-stock items (calculated transit)" },
    { name: "Patna, Bihar", status: "Hub Node 🟡", desc: "Bulk backup & specialized formulations" }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden">
      
      {/* 1. 60-SECOND CONVERSION HERO SECTION */}
      <section className="relative z-20 pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-slate-100/50 via-white to-slate-50 border-b border-slate-200/50">
        
        {/* Soft floating background glows */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cta/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-slate-250/20 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 text-center">
          
          {/* Active Grid Location Badge */}
          <div className="inline-block relative mb-6">
            <button
              onClick={() => setShowLocationTooltip(!showLocationTooltip)}
              onMouseEnter={() => setShowLocationTooltip(true)}
              onMouseLeave={() => setShowLocationTooltip(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 hover:border-primary/40 text-xs font-bold text-slate-700 transition-all shadow-sm cursor-pointer hover:shadow-md group"
            >
              <MapPin className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform" />
              <span>Jehanabad, Bihar</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Grid Active</span>
              <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-300 ${showLocationTooltip ? 'rotate-180' : ''}`} />
            </button>
 
            <AnimatePresence>
              {showLocationTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 z-50 text-left"
                >
                  <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-100">
                    <Info className="h-4 w-4 text-primary" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Logistics Grid Nodes</span>
                  </div>
                  <div className="space-y-2">
                    {locations.map((loc, idx) => (
                      <div key={idx} className="flex flex-col gap-0.5 p-2 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-800">{loc.name}</span>
                          <span className="text-[9px] font-black text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm">
                            {loc.status}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{loc.desc}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Crisp typography & Value proposition */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto mb-6">
            Book a Doctor or Order Medicines in{" "}
            <span className="bg-gradient-to-r from-slate-900 to-cta bg-clip-text text-transparent">
              60 Seconds.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-10 max-w-xl mx-auto">
            Direct neighborhood partnerships. Zero markup. Better than walk-in experience.
          </p>

          {/* Direct Search Bar */}
          <div className="w-full max-w-lg mx-auto flex justify-center mb-8">
            <div className="w-full bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
              <SearchBar />
            </div>
          </div>

          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-primary" /> Press <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono shadow-sm">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-white rounded border border-slate-200 font-mono shadow-sm">K</kbd> anywhere to search instantly.
          </p>

        </div>
      </section>

      {/* 2. INFINITE MOVING LIVE TICKER (MARQUEE BANNER) */}
      <section className="bg-primary text-primary-foreground py-3.5 overflow-hidden select-none border-b border-primary/20 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.05)] relative z-15">
        <div className="flex w-full overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex gap-12 text-xs font-bold uppercase tracking-widest items-center">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cta shrink-0" /> 100% Verified Pharmacies</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-cta shrink-0" /> 15-Min Flash Delivery</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Stethoscope className="h-4 w-4 text-cta shrink-0" /> Top Specialists Near You</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><FlaskConical className="h-4 w-4 text-cta shrink-0" /> NABL-Accredited Lab Partners</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Activity className="h-4 w-4 text-cta shrink-0" /> Lowest Price Guaranteed</span>
            <span>•</span>
            {/* Repeated for seamless scrolling */}
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-cta shrink-0" /> 100% Verified Pharmacies</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-cta shrink-0" /> 15-Min Flash Delivery</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Stethoscope className="h-4 w-4 text-cta shrink-0" /> Top Specialists Near You</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><FlaskConical className="h-4 w-4 text-cta shrink-0" /> NABL-Accredited Lab Partners</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5"><Activity className="h-4 w-4 text-cta shrink-0" /> Lowest Price Guaranteed</span>
            <span>•</span>
          </div>
        </div>
      </section>

      {/* 3. B2C CATEGORY GATEWAY SECTION */}
      <section className="py-24 bg-slate-50/50 relative border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-bold tracking-widest text-cta uppercase bg-cta/5 border border-cta/25 px-3.5 py-1.5 rounded-full shadow-sm">
              Instant Gateways
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 mb-2">
              Select Your Destination
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Direct connection to nearest local healthcare grids
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Card A: Doctors */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-cta/20 transition-all duration-500 group overflow-hidden"
            >
              <div>
                {/* Image Container with Badge Overlay */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-50 mb-6 border border-slate-100 flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    <Stethoscope className="h-3.5 w-3.5 text-cta" />
                    <span>Doctors</span>
                  </div>
                  <Image
                    src="/doctor-illustration.png"
                    alt="Consult Doctors"
                    width={400}
                    height={400}
                    priority
                    className="w-auto h-[90%] object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="px-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Consult Doctors
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    Book verified local doctors instantly for video or in-clinic visits. Zero queuing time.
                  </p>
                </div>
              </div>

              <div className="px-1">
                <Link href="/doctors" className="w-full">
                  <button className="w-full py-3.5 bg-cta hover:bg-[#025684] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-cta/15">
                    Find a Doctor
                    <ArrowRight className="h-3.5 w-3.5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Card B: Medicines */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-cta/20 transition-all duration-500 group overflow-hidden"
            >
              <div>
                {/* Image Container with Badge Overlay */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-50 mb-6 border border-slate-100 flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    <Pill className="h-3.5 w-3.5 text-cta" />
                    <span>Medicines</span>
                  </div>
                  <Image
                    src="/pharmacy-illustration.png"
                    alt="Order Medicines"
                    width={400}
                    height={400}
                    priority
                    className="w-auto h-[90%] object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="px-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Order Medicines
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    15-minute delivery from your closest retail chemist. Zero markups and split routing optimization.
                  </p>
                </div>
              </div>

              <div className="px-1">
                <Link href="/medicines" className="w-full">
                  <button className="w-full py-3.5 bg-cta hover:bg-[#025684] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-cta/15">
                    Order Medicines
                    <ArrowRight className="h-3.5 w-3.5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>

            {/* Card C: Lab Tests */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-cta/20 transition-all duration-500 group overflow-hidden"
            >
              <div>
                {/* Image Container with Badge Overlay */}
                <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-slate-50 mb-6 border border-slate-100 flex items-center justify-center">
                  <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    <FlaskConical className="h-3.5 w-3.5 text-cta" />
                    <span>Lab Tests</span>
                  </div>
                  <Image
                    src="/lab-illustration.png"
                    alt="Book Lab Tests"
                    width={400}
                    height={400}
                    priority
                    className="w-auto h-[90%] object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="px-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Book Lab Tests
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-6">
                    NABL-accredited diagnostic labs. Safe, certified phlebotomists collect samples from your home.
                  </p>
                </div>
              </div>

              <div className="px-1">
                <Link href="/lab-tests" className="w-full">
                  <button className="w-full py-3.5 bg-cta hover:bg-[#025684] text-white font-bold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-cta/15">
                    Book Lab Tests
                    <ArrowRight className="h-3.5 w-3.5 text-white/80 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3.5. INTERACTIVE VOICE & HYPERLOCAL ASSISTANT */}
      <VoiceAssistantSection />

      {/* 4. THE 'CONTINUOUS INTELLIGENCE' HEALTH LOOP GRID */}
      <section className="py-24 bg-white border-t border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-20">
            <span className="text-[10px] font-bold tracking-widest text-cta uppercase bg-cta/5 border border-cta/25 px-3.5 py-1.5 rounded-full shadow-sm">
              Continuous Intelligence Loop
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-5 mb-3">
              How Clinik<span className="text-cta">Book</span> Synchronizes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              We sync inventory databases and specialist appointment logs in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Step 1 */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">
                  1
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Discover & Book</h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Instant slot mapping matching closest retail nodes. Automatically checks pharmacy stock databases and doctor calendars to avoid scheduling conflicts.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">
                  2
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Hyperlocal Dispatch</h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Package assignment to the nearest network delivery rider. Telemetry systems coordinate dispatch parameters to achieve a 15-minute delivery window.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-200/60 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow-sm">
                  3
                </div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Sync & Track</h3>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                Real-time status update feeds mirrored across client, rider, and chemist devices. Full order transparency with secure, encrypted data synchronization.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SELF-SERVE B2B PARTNER ONBOARDING LAYER (HIGH CONTRAST SPLIT) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-950 text-white rounded-[2rem] p-8 sm:p-12 border border-slate-900 shadow-2xl relative overflow-hidden">
            
            {/* Background design glow */}
            <div className="absolute right-0 bottom-0 w-[300px] h-[300px] bg-cta/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cta/15 border border-cta/30 text-cta text-[10px] font-bold uppercase tracking-wider mb-6">
                B2B Healthcare Partners
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
                Join the Clinik<span className="text-cta">Book</span> Care Network
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-10 max-w-xl">
                Integrate your retail pharmacy stock or clinic schedules directly into our local dispatch grid. Join thousands of verified professionals.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                
                {/* Partner 1: Chemist */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cta/40 transition-colors flex flex-col justify-between">
                  <div>
                    <Store className="h-5 w-5 text-cta mb-3" />
                    <h4 className="font-bold text-xs sm:text-sm tracking-tight text-slate-100 mb-1">Retail Chemists</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mb-4">Manage orders and automate stock with our billing module.</p>
                  </div>
                  <Link href="/chemist-dashboard">
                    <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      Partner Portal
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>

                {/* Partner 2: Doctor */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cta/40 transition-colors flex flex-col justify-between">
                  <div>
                    <Stethoscope className="h-5 w-5 text-cta mb-3" />
                    <h4 className="font-bold text-xs sm:text-sm tracking-tight text-slate-100 mb-1">Medical Clinics</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mb-4">Publish slot matrices to consult local neighborhood patients.</p>
                  </div>
                  <Link href="/register/doctor">
                    <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      Register Doctor
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>

                {/* Partner 3: Labs */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 hover:border-cta/40 transition-colors flex flex-col justify-between">
                  <div>
                    <FlaskConical className="h-5 w-5 text-cta mb-3" />
                    <h4 className="font-bold text-xs sm:text-sm tracking-tight text-slate-100 mb-1">Pathology Labs</h4>
                    <p className="text-[10px] text-slate-400 leading-normal mb-4">Scale NABL-certified sample dispatch and electronic logs.</p>
                  </div>
                  <Link href="/register/lab">
                    <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold tracking-wider uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                      Register Lab
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TRUST FOOTER */}
      <footer className="w-full py-12 bg-white border-t border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-slate-500 text-xs font-bold select-none mb-8">
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <span>100% Licensed & Verified Retail Partners</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-350" />
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <span>Secure, Encrypted Electronic Prescriptions</span>
            </div>
            <div className="hidden md:block w-1 h-1 rounded-full bg-slate-350" />
            <div className="flex items-center gap-2 hover:text-primary transition-colors">
              <ShieldCheck className="h-4.5 w-4.5 text-primary" />
              <span>Direct Neighborhood Dispatch Grid First</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400">
            &copy; {new Date().getFullYear()} ClinikBook Healthcare. All rights reserved. HIPAA Compliant Security & Grid Encrypted Routing.
          </div>

        </div>
      </footer>

    </div>
  );
}
