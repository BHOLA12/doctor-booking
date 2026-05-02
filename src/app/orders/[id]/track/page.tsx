"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Clock, 
  ChevronLeft, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Bike,
  ShieldCheck,
  Star,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState(2); // 0: Confirmed, 1: Prepared, 2: Out for delivery, 3: Delivered

  const steps = [
    { title: "Order Confirmed", time: "10:30 AM", completed: status >= 0 },
    { title: "Medicine Prepared", time: "10:45 AM", completed: status >= 1 },
    { title: "Out for Delivery", time: "11:00 AM", completed: status >= 2 },
    { title: "Delivered", time: "--:--", completed: status >= 3 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-border/40 sticky top-0 z-50">
        <div className="mx-auto max-w-2xl px-4 h-16 flex items-center justify-between">
          <Link href="/medicines" className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
            <ChevronLeft className="h-6 w-6 text-slate-600" />
          </Link>
          <div className="text-center">
            <h1 className="text-sm font-black text-slate-900 uppercase tracking-widest">Track Order</h1>
            <p className="text-[10px] font-bold text-slate-400">Order #DB-4522</p>
          </div>
          <div className="h-10 w-10" /> {/* Spacer */}
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6 space-y-6">
        {/* Live Map (Mock) */}
        <div className="relative h-80 w-full rounded-[2.5rem] bg-slate-100 border-2 border-white shadow-xl overflow-hidden group">
          {/* Grid Pattern as Map */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e2e8f0_1px,_transparent_1px)] [background-size:24px_24px] opacity-50" />
          
          {/* Animated Delivery Agent */}
          <motion.div 
            animate={{ 
              x: [100, 200, 150, 250], 
              y: [50, 150, 100, 200] 
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute z-20"
          >
             <div className="flex flex-col items-center">
                <div className="bg-primary text-white p-2 rounded-xl shadow-2xl animate-bounce">
                   <Bike className="h-6 w-6" />
                </div>
                <div className="mt-2 bg-white px-2 py-1 rounded-lg shadow-lg border border-slate-100 text-[8px] font-black uppercase">Rahul is arriving</div>
             </div>
          </motion.div>

          {/* Destination */}
          <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
             <div className="bg-slate-900 text-white p-2 rounded-xl shadow-2xl">
                <MapPin className="h-6 w-6" />
             </div>
             <div className="mt-2 bg-white px-2 py-1 rounded-lg shadow-lg border border-slate-100 text-[8px] font-black uppercase tracking-tight">Your Home</div>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
             <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-teal-600" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</p>
                      <p className="text-sm font-black text-slate-900">12 - 15 Mins</p>
                   </div>
                </div>
                <Button size="sm" className="rounded-xl h-10 px-4 font-bold text-xs">Share Trip</Button>
             </div>
          </div>
        </div>

        {/* Order Status Timeline */}
        <Card className="border-border/40 rounded-[2.5rem] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  {/* Connector Line */}
                  {i !== steps.length - 1 && (
                    <div className={`absolute left-3 top-8 bottom-[-20px] w-0.5 ${step.completed && steps[i+1].completed ? "bg-primary" : "bg-slate-100"}`} />
                  )}
                  
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${step.completed ? "bg-primary text-white" : "bg-slate-100 text-slate-300"}`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className={`font-black text-sm tracking-tight transition-colors ${step.completed ? "text-slate-900" : "text-slate-300"}`}>{step.title}</p>
                      {step.completed && <p className="text-[10px] font-bold text-primary mt-0.5">{step.time}</p>}
                    </div>
                    {step.completed && i === status && (
                       <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black">ACTIVE</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Partner Info */}
        <Card className="border-border/40 rounded-[2.5rem] shadow-sm bg-slate-900 text-white overflow-hidden">
           <CardContent className="p-8">
              <div className="flex items-center gap-5">
                 <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/10">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Delivery Partner" className="h-full w-full object-cover" />
                 </div>
                 <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                       <h4 className="text-lg font-black tracking-tight">Rahul Verma</h4>
                       <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-lg text-[10px] font-black">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>4.9</span>
                       </div>
                    </div>
                    <p className="text-xs font-bold text-slate-400">Your delivery hero for today</p>
                 </div>
                 <div className="flex items-center gap-3">
                    <Button size="icon" className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/5">
                       <MessageSquare className="h-5 w-5" />
                    </Button>
                    <Button size="icon" className="h-12 w-12 rounded-2xl bg-primary shadow-lg shadow-primary/20">
                       <Phone className="h-5 w-5" />
                    </Button>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Store Info */}
        <div className="flex items-center justify-between p-6 rounded-[2.5rem] bg-white border border-border/40 shadow-sm">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center">
                 <ShieldCheck className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Partner</p>
                 <h5 className="font-black text-slate-900">Wellness Forever Pharmacy</h5>
              </div>
           </div>
           <ArrowUpRight className="h-5 w-5 text-slate-300" />
        </div>

      </main>
    </div>
  );
}
