"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "@/components/shared/SearchBar";
import {
  MapPin,
  Stethoscope,
  Pill,
  FlaskConical,
  Zap,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Store,
  Check,
  ChevronDown,
  Info,
  DollarSign,
  Cpu,
  MousePointerClick,
  Mic,
  ArrowUpRight,
  Building,
  Activity,
  ShieldAlert
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
    <div className="flex flex-col min-h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans">
      
      {/* 1. PREMIUM HERO HEADER SECTION */}
      <section className="relative pt-32 pb-24 md:pt-40 md:pb-32 bg-gradient-to-b from-[#020617] via-[#0b0f19] to-[#020617] overflow-hidden">
        
        {/* Cinematic Background Lights */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none animate-pulse-soft" />
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        {/* Ambient Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none" 
          style={{ 
            backgroundImage: "radial-gradient(rgba(99, 102, 241, 0.25) 1px, transparent 1px)", 
            backgroundSize: "32px 32px" 
          }} 
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            
            {/* Amber Pulse Active Network Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.1)] mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              ⚡ Hyper-local Quick Healthcare Network Active
            </motion.div>

            {/* Main Gradient Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white mb-6"
            >
              Your Trusted Neighborhood{" "}
              <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                Doctors & Pharmacies
              </span>
              , Connected.
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl"
            >
              Get authentic medicines delivered from your closest chemist in 15 mins or book verified local doctors instantly.
            </motion.p>

            {/* Interactive Location Selector Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mb-12"
            >
              <button 
                onClick={() => setShowLocationTooltip(!showLocationTooltip)}
                onMouseEnter={() => setShowLocationTooltip(true)}
                onMouseLeave={() => setShowLocationTooltip(false)}
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-sm font-semibold text-slate-200 transition-all duration-300 shadow-xl cursor-pointer hover:shadow-indigo-500/5 group"
              >
                <MapPin className="h-4.5 w-4.5 text-teal-400 group-hover:scale-110 transition-transform" />
                <span>Jehanabad, Bihar</span>
                <span className="inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-md text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Live
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform duration-300 ${showLocationTooltip ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showLocationTooltip && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-3 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 text-left"
                  >
                    <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-800/80">
                      <Sparkles className="h-4 w-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Network Logistics Nodes</span>
                    </div>
                    <div className="space-y-3">
                      {locations.map((loc, idx) => (
                        <div key={idx} className="flex flex-col gap-0.5 p-2 rounded-lg bg-slate-950/50 hover:bg-slate-950 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-200">{loc.name}</span>
                            <span className="text-[10px] font-extrabold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {loc.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 leading-tight mt-0.5">{loc.desc}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Smart Search Bar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="w-full max-w-xl flex justify-center mb-6"
            >
              <div className="w-full bg-slate-900/50 backdrop-blur-xl p-2.5 rounded-2xl border border-slate-800 shadow-2xl">
                <SearchBar />
              </div>
            </motion.div>

            {/* Keyboard shortcut hint */}
            <p className="text-xs text-slate-500 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-indigo-400" /> Press <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-800 font-mono">K</kbd> anywhere to search instantly.
            </p>

          </div>
        </div>
      </section>

      {/* 2. THE 3-GATEWAY FEATURE SHOWCASE GRID */}
      <section className="py-24 relative bg-[#020617]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(99,102,241,0.03),_transparent_50%)] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Explore Gateways
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Select Your Gateway to Connect
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              DocBook bridges the gap between digital speed and local offline trust. Choose your destination to start.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Gateway A: Doctors */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-7 shadow-2xl hover:border-indigo-500/30 hover:shadow-indigo-500/5 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
              
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Stethoscope className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  Book Top Consultations
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Avoid crowded hospital lines. Search by specialist or hospital near you for instant appointments.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Search 50+ specialists near you",
                    "In-clinic & video consultations",
                    "Instant slot booking & verification"
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="p-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/doctors" className="block w-full">
                <button className="w-full py-3 px-4 bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-200 hover:text-white font-semibold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 hover:bg-indigo-950/20 active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                  Find a Doctor
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover/btn:translate-x-1 group-hover/btn:text-indigo-400 transition-all" />
                </button>
              </Link>
            </motion.div>

            {/* Gateway B: Medicines */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-7 shadow-2xl hover:border-teal-500/30 hover:shadow-teal-500/5 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-teal-500/10 transition-colors" />
              
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Pill className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
                  15-Min Pharmacy Delivery
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Upload prescription. Smart lowest-cost routing matching multiple local chemists to get the absolute cheapest aggregate bill.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Delivered from local chemist in 15 mins",
                    "Multi-store split-routing algorithm",
                    "Up to 35% cheaper combined billings"
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="p-0.5 rounded bg-teal-500/10 border border-teal-500/20 text-teal-400 mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/medicines" className="block w-full">
                <button className="w-full py-3 px-4 bg-slate-900 border border-slate-800 hover:border-teal-500/40 text-slate-200 hover:text-white font-semibold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 hover:bg-teal-950/20 active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                  Order Medicines
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover/btn:translate-x-1 group-hover/btn:text-teal-400 transition-all" />
                </button>
              </Link>
            </motion.div>

            {/* Gateway C: Lab Tests */}
            <motion.div
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/60 to-slate-950 p-7 shadow-2xl hover:border-purple-500/30 hover:shadow-purple-500/5 transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
              
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="h-6 w-6" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  Diagnostics at Home
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Certified laboratory partners. Safe home sample collection with smart digital reports returned in under 12 hours.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "NABL-accredited laboratory partners",
                    "Certified health phlebotomists collections",
                    "Smart digital report summaries under 12h"
                  ].map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="p-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link href="/lab-tests" className="block w-full">
                <button className="w-full py-3 px-4 bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-slate-200 hover:text-white font-semibold text-xs rounded-xl tracking-wider uppercase transition-all duration-300 hover:bg-purple-950/20 active:scale-[0.98] flex items-center justify-center gap-2 group/btn">
                  Book Lab Tests
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover/btn:translate-x-1 group-hover/btn:text-purple-400 transition-all" />
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE VOICE & SEARCH AI AGENT SHOWCASE */}
      <section className="py-24 relative bg-[#020617] border-t border-b border-slate-900 overflow-hidden">
        
        {/* Visual Background Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
            
            {/* Left Column (55% Width) - AI Visual Pod */}
            <div className="w-full lg:w-[55%] flex justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg backdrop-blur-xl bg-slate-900/40 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl hover:border-slate-700/50 transition-all duration-500 group"
              >
                {/* Embedded Grid Effect */}
                <div 
                  className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ 
                    backgroundImage: "radial-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px)", 
                    backgroundSize: "16px 16px" 
                  }} 
                />

                {/* Left ambient glow overlay */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-500" />
                
                {/* 3D Floating Orb container */}
                <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
                  
                  {/* Floating Central Node */}
                  <motion.div
                    animate={{
                      y: [-10, 10, -10],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="relative z-10 w-36 h-36 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_50px_rgba(6,182,212,0.35)]"
                  >
                    <div className="absolute inset-1.5 rounded-full bg-slate-950/95 backdrop-blur-md flex items-center justify-center group-hover:scale-[0.98] transition-transform duration-300">
                      <Cpu className="h-14 w-14 text-cyan-400 animate-pulse" />
                    </div>
                  </motion.div>

                  {/* Halo Layer 1 */}
                  <motion.div
                    animate={{
                      scale: [1, 1.35, 1],
                      opacity: [0.15, 0.35, 0.15],
                    }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute w-48 h-48 rounded-full border border-cyan-500/30 bg-cyan-500/5 blur-sm"
                  />

                  {/* Halo Layer 2 */}
                  <motion.div
                    animate={{
                      scale: [1, 1.7, 1],
                      opacity: [0.06, 0.18, 0.06],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6,
                    }}
                    className="absolute w-60 h-60 rounded-full border border-blue-500/20 bg-blue-500/5 blur-md"
                  />

                  {/* Halo Layer 3 */}
                  <motion.div
                    animate={{
                      scale: [1, 2.0, 1],
                      opacity: [0.02, 0.08, 0.02],
                    }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1.2,
                    }}
                    className="absolute w-72 h-72 rounded-full border border-indigo-500/10 bg-indigo-500/5 blur-xl"
                  />

                  {/* Floating micro particles */}
                  <motion.div
                    animate={{
                      x: [0, 12, 0],
                      y: [0, -20, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-12 left-10 w-3.5 h-3.5 bg-teal-400/40 rounded-full blur-xs"
                  />
                  <motion.div
                    animate={{
                      x: [0, -15, 0],
                      y: [0, 12, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute bottom-14 right-10 w-5 h-5 bg-indigo-500/30 rounded-full blur-sm"
                  />
                </div>

                {/* Animated Waveform line */}
                <div className="mt-8 text-center">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-3.5 animate-pulse">
                    AI Active & Listening
                  </span>
                  
                  <div className="flex items-center justify-center gap-1.5 h-10">
                    {[1.3, 1.7, 1.1, 1.9, 1.4, 1.6, 1.2, 1.8, 1.5].map((speed, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [8, 32, 8],
                        }}
                        transition={{
                          duration: speed,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="w-1 bg-gradient-to-t from-cyan-500 via-blue-500 to-indigo-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>

              </motion.div>
            </div>

            {/* Right Column (45% Width) - AI Pitch & CTA */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center text-left">
              
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-wider self-start mb-5 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                Interactive Voice & Search
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-6">
                Meet Your Personal{" "}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                  Hyperlocal Health Assistant.
                </span>
              </h2>

              <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-8">
                No more typing long names or searching multiple stores. Just speak naturally. DocBook's advanced AI agent listens to your symptoms, matches prescriptions with closest verified doctors, and splits your medicine cart across local pharmacies to find the absolute lowest bill instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => alert("Connecting to DocBook Live AI voice session...")}
                  className="h-13 px-7 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Mic className="h-4.5 w-4.5 animate-pulse" />
                  🚨 Talk to Live Agent
                </button>

                <button 
                  onClick={() => alert("Showing AI Agent demo walkthrough...")}
                  className="h-13 px-7 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer"
                >
                  See How It Works
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Micro-metrics under layout */}
          <div className="mt-16 pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 text-slate-400 text-xs sm:text-sm font-semibold select-none">
            <div className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
              <Zap className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
              <span>0.12ms Local Grid Latency</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800" />
            <div className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Mic className="h-4.5 w-4.5 text-blue-400" />
              <span>Supports Hindi, English & Mixed Voice Scripts</span>
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800" />
            <div className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>100% Secure HIPAA-Compliant Encryption</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. VALUE PROP COMPASS: "WHY DOCBOOK BEATS THE GIANTS" */}
      <section className="py-24 relative bg-slate-900/10 border-b border-slate-900">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              Local Vs. Centralized
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Why DocBook Beats the Giants
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Unlike centralized e-pharmacies shipping from distant warehouses, we optimize for local speed and affordability.
            </p>
          </div>

          <div className="max-w-5xl mx-auto divide-y divide-slate-800/80 border border-slate-800 rounded-3xl bg-slate-950/40 overflow-hidden shadow-2xl">
            
            {/* Advantage 1: Flash Speed */}
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/20 transition-colors">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Flash Speed Dispatch
                    <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      2km Radius
                    </span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    We route orders to local retail shops within a 2km radius instead of routing from far-away warehouses in distant cities. You get your essentials right when you need them.
                  </p>
                </div>
              </div>
              <div className="lg:text-right shrink-0">
                <span className="inline-block text-sm font-extrabold text-slate-200 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                  🚀 15 Min Avg. Delivery
                </span>
              </div>
            </div>

            {/* Advantage 2: Smart Multi-Store Split */}
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/20 transition-colors">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Smart Multi-Store Split Billing
                    <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Database Optimization
                    </span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Our routing engine scans the live catalog of all nearby chemists and splits your cart dynamically to buy each item from the cheapest source, guaranteeing the absolute lowest combined total.
                  </p>
                </div>
              </div>
              <div className="lg:text-right shrink-0">
                <span className="inline-block text-sm font-extrabold text-slate-200 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                  💰 Save up to 35%
                </span>
              </div>
            </div>

            {/* Advantage 3: Anti-Gravity Latency */}
            <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 hover:bg-slate-900/20 transition-colors">
              <div className="flex items-start gap-4 max-w-2xl">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Cpu className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    Anti-Gravity Optimization
                    <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      High Performance
                    </span>
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    Zero-lag, highly lightweight responsive interface designed for fast loading and low latency, optimized specifically to run smoothly on unstable 3G/4G connections.
                  </p>
                </div>
              </div>
              <div className="lg:text-right shrink-0">
                <span className="inline-block text-sm font-extrabold text-slate-200 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
                  📱 Under 1s Load Time
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PARTNER SELF-SERVE REGISTRATION CARDS (B2B PORTAL GRID) */}
      <section className="py-24 relative bg-[#020617]">
        <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-indigo-600/[0.02] rounded-full blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
              B2B Partnerships
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
              Join the DocBook Care Network
            </h2>
            <p className="text-slate-400 text-base">
              Grow your healthcare service by integrating directly into our hyper-local dispatch grid. Sell, consult, and organize.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {/* Card 1: Doctors */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-105 transition-transform">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Doctors & Clinics</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  List your clinic or hospital slot matrices to consult local patients via express physical appointments or secure video calls.
                </p>
              </div>
              <Link href="/register?role=DOCTOR" className="w-full">
                <button className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all duration-300">
                  Register as Doctor 🩺
                </button>
              </Link>
            </motion.div>

            {/* Card 2: Chemists */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-105 transition-transform">
                  <Store className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Local Chemists</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Power your shop with our free desktop billing software and instantly receive hyper-local quick commerce medicine orders.
                </p>
              </div>
              <Link href="/register?role=PHARMACY" className="w-full">
                <button className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-300 hover:text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all duration-300">
                  Register as Chemist 🏪
                </button>
              </Link>
            </motion.div>

            {/* Card 3: Labs */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-5 group-hover:scale-105 transition-transform">
                  <FlaskConical className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Diagnostic Labs</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Upload test catalogs and slot allocations to dispatch certified phlebotomists for prompt diagnostic home collections.
                </p>
              </div>
              <Link href="/register?role=PATHOLOGIST" className="w-full">
                <button className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-purple-500/40 text-slate-300 hover:text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all duration-300">
                  Register as Lab 🧪
                </button>
              </Link>
            </motion.div>

            {/* Card 4: Hospitals */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-105 transition-transform">
                  <Building className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Hospitals & Centers</h3>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Integrate your emergency wards, specialized departments, and doctor directories to manage patient queues.
                </p>
              </div>
              <Link href="/register?role=HOSPITAL" className="w-full">
                <button className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white text-xs font-bold rounded-xl tracking-wider uppercase transition-all duration-300">
                  Register Hospital 🏥
                </button>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 6. ECOSYSTEM TRUST BADGES & FOOTER */}
      <footer className="w-full py-12 bg-[#020617] border-t border-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-slate-400 text-sm font-semibold select-none">
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:text-emerald-400 hover:bg-emerald-500/5 border border-transparent hover:border-emerald-500/10 transition-all">
              <ShieldCheck className="h-4.5 w-4.5 text-emerald-400" />
              <span>100% Licensed & Verified Retailers</span>
            </div>
            
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:text-indigo-400 hover:bg-indigo-500/5 border border-transparent hover:border-indigo-500/10 transition-all">
              <ShieldCheck className="h-4.5 w-4.5 text-indigo-400" />
              <span>Secure Encrypted Prescriptions</span>
            </div>

            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-slate-800" />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:text-teal-400 hover:bg-teal-500/5 border border-transparent hover:border-teal-500/10 transition-all">
              <ShieldCheck className="h-4.5 w-4.5 text-teal-400" />
              <span>Local Economy First</span>
            </div>

          </div>

          <div className="mt-8 text-center text-xs text-slate-600">
            &copy; {new Date().getFullYear()} DocBook Healthcare. All rights reserved. HIPAA Compliant & encrypted.
          </div>

        </div>
      </footer>

    </div>
  );
}
