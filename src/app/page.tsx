"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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
  Calendar,
  Loader2,
  Search
} from "lucide-react";

export default function HomePage() {
  const [showLocationTooltip, setShowLocationTooltip] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Jehanabad, Bihar");
  const [isDetecting, setIsDetecting] = useState(false);
  const [manualLocation, setManualLocation] = useState("");
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowLocationTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            const city = address.city || address.town || address.village || address.suburb || address.county || "Bihar";
            const state = address.state || "India";
            setCurrentLocation(`${city}, ${state}`);
            setShowLocationTooltip(false);
          } else {
            setCurrentLocation("Jehanabad, Bihar");
          }
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          setCurrentLocation("Patna, Bihar");
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetecting(false);
        alert("Unable to retrieve location. Please check browser permissions.");
      }
    );
  };

  // Active locations for Bihar network mapping
  const locations = [
    { name: "Jehanabad, Bihar", status: "Live & Active 🟢", desc: "Local chemist dispatch in 30 mins (within 1-2 km)" },
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
          
          {/* Crisp typography & Value proposition */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15] max-w-4xl mx-auto mb-6">
            Book a Doctor or Order Medicines in{" "}
            <span className="bg-gradient-to-r from-slate-900 to-cta bg-clip-text text-transparent">
              60 Seconds.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto">
            Direct neighborhood partnerships. Zero markup. Better than walk-in experience.
          </p>
          {/* Unified Location + Search Bar */}
          <div className="w-full max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center bg-white p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-slate-200 shadow-md hover:shadow-lg focus-within:shadow-lg focus-within:border-primary/30 transition-all mb-6 relative text-left">
            
            {/* Location selector section */}
            <div ref={tooltipRef} className="relative shrink-0 border-b sm:border-b-0 sm:border-r border-slate-100 pb-1.5 sm:pb-0 sm:pr-2 pl-2 sm:pl-3">
              <button
                onClick={() => setShowLocationTooltip(!showLocationTooltip)}
                className="w-full sm:w-36 flex items-center justify-between gap-2 py-2 sm:py-1 text-xs font-black text-slate-800 transition-all cursor-pointer group h-10 outline-hidden border-0 bg-transparent"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {isDetecting ? (
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
                  )}
                  <span className="truncate text-left">{currentLocation.split(",")[0]}</span>
                </div>
                <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-300 shrink-0 ${showLocationTooltip ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLocationTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.95 }}
                    className="absolute left-0 top-[calc(100%+8px)] w-[22rem] bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 z-50 text-left overflow-hidden ring-1 ring-black/5"
                  >
                    {/* Subtle top decoration */}
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-cta to-indigo-500" />
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Activity className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-800">
                          Logistics Control Panel
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                        Online
                      </span>
                    </div>

                    {/* Manual Location Search */}
                    <div className="mb-4">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Search Delivery Location
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Enter City, Town or Pincode..."
                          value={manualLocation}
                          onChange={(e) => setManualLocation(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && manualLocation.trim() !== "") {
                              setCurrentLocation(manualLocation.trim());
                              setManualLocation("");
                              setShowLocationTooltip(false);
                            }
                          }}
                          className="w-full pl-9 pr-20 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl transition-all outline-none placeholder:text-slate-400"
                        />
                        <button
                          onClick={() => {
                            if (manualLocation.trim() !== "") {
                              setCurrentLocation(manualLocation.trim());
                              setManualLocation("");
                              setShowLocationTooltip(false);
                            }
                          }}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all active:scale-[0.97]"
                        >
                          Set
                        </button>
                      </div>

                      {/* Quick Suggestions */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Quick Select:</span>
                        {["Jehanabad", "Gaya", "Patna", "Muzaffarpur"].map((city) => (
                          <button
                            key={city}
                            onClick={() => {
                              setCurrentLocation(`${city}, Bihar`);
                              setShowLocationTooltip(false);
                            }}
                            className="text-[10px] font-extrabold text-slate-600 hover:text-primary bg-slate-100 hover:bg-primary/5 border border-slate-200 hover:border-primary/20 px-2.5 py-1 rounded-lg transition-all"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Nodes List */}
                    <div className="space-y-2 mb-4">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Active Grid System
                      </span>
                      <div className="space-y-2 border-l-2 border-slate-100 pl-3.5 ml-1">
                        {locations.map((loc, idx) => {
                          const isActive = currentLocation.toLowerCase().includes(loc.name.split(",")[0].toLowerCase());
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                setCurrentLocation(loc.name);
                                setShowLocationTooltip(false);
                              }}
                              className={`group relative flex flex-col gap-0.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isActive
                                  ? "bg-primary/5 border-primary/20 shadow-sm"
                                  : "bg-slate-50/50 border-slate-150 hover:bg-slate-50 hover:border-slate-300"
                              }`}
                            >
                              {/* Connector dot indicator */}
                              <span className={`absolute -left-[1.2rem] top-4.5 h-2.5 w-2.5 rounded-full border-2 border-white transition-all ${
                                isActive 
                                  ? "bg-primary ring-4 ring-primary/10" 
                                  : "bg-slate-300 group-hover:bg-slate-400"
                              }`} />
                              
                              <div className="flex justify-between items-center">
                                <span className={`text-xs font-black transition-colors ${isActive ? "text-primary" : "text-slate-800"}`}>
                                  {loc.name}
                                </span>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                  loc.status.includes("🟢") || loc.status.includes("Live")
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-amber-50 text-amber-700 border border-amber-100"
                                }`}>
                                  {loc.status}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-500 leading-normal mt-0.5">
                                {loc.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Auto GPS Trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        detectLocation();
                      }}
                      disabled={isDetecting}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-slate-950/10 hover:shadow-slate-950/20 active:scale-[0.98] cursor-pointer"
                    >
                      {isDetecting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                      {isDetecting ? "Detecting Location..." : "Detect Live GPS Location"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Bar section */}
            <div className="flex-1 w-full relative sm:pl-2">
              <SearchBar minimal />
            </div>
          </div>

          {/* Quick Prescription Upload & Voice Search Hints */}
          <div className="w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
            
            {/* Quick Upload Prescription Card */}
            <Link href="/medicines?upload=true" className="group">
              <div className="h-[5.5rem] flex items-center gap-4 p-4 bg-gradient-to-br from-white to-slate-50 hover:to-teal-50/10 rounded-2xl border border-slate-200 hover:border-teal-500/20 shadow-xs hover:shadow-md transition-all relative overflow-hidden">
                <div className="absolute right-0 bottom-0 text-7xl opacity-5 select-none translate-x-2 translate-y-4 group-hover:scale-110 transition-transform">📄</div>
                <div className="h-11 w-11 rounded-xl bg-teal-500 text-white flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0 group-hover:scale-105 transition-transform">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <span className="flex items-center gap-1.5 text-[9px] font-black text-teal-700 bg-teal-50 border border-teal-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
                    Quick Upload
                  </span>
                  <h4 className="text-xs font-black text-slate-800 mt-1">Upload Doctor's Prescription</h4>
                  <p className="text-[10px] text-slate-400 leading-normal mt-0.5 font-medium">Order in 30 seconds via WhatsApp/Direct Upload</p>
                </div>
              </div>
            </Link>

            {/* Quick Voice Assistant Card */}
            <button
              onClick={() => {
                const el = document.getElementById("voice-assistant");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="group h-[5.5rem] flex items-center gap-4 p-4 bg-gradient-to-br from-white to-slate-50 hover:to-indigo-50/10 rounded-2xl border border-slate-200 hover:border-primary/20 shadow-xs hover:shadow-md transition-all relative cursor-pointer text-left overflow-hidden w-full"
            >
              <div className="absolute right-0 bottom-0 text-7xl opacity-5 select-none translate-x-2 translate-y-4 group-hover:scale-110 transition-transform font-bold">🎤</div>
              <div className="h-11 w-11 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/10 shrink-0 group-hover:scale-105 transition-transform">
                <Activity className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-[9px] font-black text-primary bg-primary/5 border border-primary/10 px-2 py-0.5 rounded-md uppercase tracking-wider w-fit">
                  Voice Assistant
                </span>
                <h4 className="text-xs font-black text-slate-800 mt-1">Talk to ClinikBook Assistant</h4>
                <p className="text-[10px] text-slate-400 leading-normal mt-0.5 font-medium">Click to speak & search: "बुखार की दवा दिखाओ"</p>
              </div>
            </button>

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
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-cta shrink-0" /> 30-Min Delivery (1-2 km)</span>
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
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-cta shrink-0" /> 30-Min Delivery (1-2 km)</span>
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
                    30-minute delivery (within 1-2 km) from your closest retail chemist. Zero markups and split routing optimization.
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
                Package assignment to the nearest network delivery rider. Telemetry systems coordinate dispatch parameters to achieve a 30-minute delivery window (within 1-2 km).
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
