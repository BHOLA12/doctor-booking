"use client";

import { useState, useEffect, use } from "react";
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
  ArrowUpRight,
  Package,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

type OrderItem = {
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  imageEmoji: string;
  dosage?: string;
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  address?: string;
  phone?: string;
  pharmacy?: { storeName: string; address: string; pincode?: string } | null;
  user?: { name: string; phone?: string } | null;
};

const STATUS_STEPS = [
  { key: "CONFIRMED",       label: "Order Confirmed",     icon: "✅" },
  { key: "PREPARING",       label: "Medicine Prepared",   icon: "💊" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery",   icon: "🛵" },
  { key: "DELIVERED",       label: "Delivered",            icon: "🏠" },
];

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMockId = orderId === "123";

  useEffect(() => {
    if (isMockId) { setLoading(false); return; }

    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/medicine/${orderId}`);
        const data = await res.json();
        if (res.ok && data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || "Order not found");
        }
      } catch {
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
    // Poll every 15 seconds for status updates
    const interval = setInterval(fetchOrder, 15000);
    return () => clearInterval(interval);
  }, [orderId, isMockId]);

  const currentStatus = order?.status ?? "CONFIRMED";
  const currentStepIdx = getStepIndex(currentStatus);
  const shortId = isMockId ? "DB-4522" : `DB-${orderId.slice(-8).toUpperCase()}`;

  const steps = STATUS_STEPS.map((s, i) => ({
    ...s,
    completed: i <= currentStepIdx,
    active: i === currentStepIdx,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
          <p className="text-sm font-bold text-slate-500">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error && !isMockId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 px-4 text-center">
        <div className="text-5xl">📦</div>
        <h2 className="text-xl font-black text-slate-900">Order not found</h2>
        <p className="text-sm text-slate-500">{error}</p>
        <Link href="/medicines">
          <Button className="rounded-full bg-teal-600 hover:bg-teal-700 text-white">Go to Medicines</Button>
        </Link>
      </div>
    );
  }

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
            <p className="text-[10px] font-bold text-slate-400">Order #{shortId}</p>
          </div>
          <div className="h-10 w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pt-6 space-y-6">
        {/* Live Map (Animated) */}
        <div className="relative h-72 w-full rounded-[2.5rem] bg-gradient-to-br from-teal-50 to-slate-100 border-2 border-white shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#e2e8f0_1px,_transparent_1px)] [background-size:24px_24px] opacity-50" />
          {/* Animated Delivery Agent */}
          <motion.div
            animate={{ x: [80, 200, 140, 240], y: [40, 130, 90, 180] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute z-20"
          >
            <div className="flex flex-col items-center">
              <div className="bg-teal-600 text-white p-2.5 rounded-xl shadow-2xl animate-bounce">
                <Bike className="h-5 w-5" />
              </div>
              <div className="mt-1.5 bg-white px-2 py-1 rounded-lg shadow-lg border border-slate-100 text-[8px] font-black uppercase whitespace-nowrap">Rahul is arriving</div>
            </div>
          </motion.div>
          {/* Destination Pin */}
          <div className="absolute bottom-1/4 right-1/4 flex flex-col items-center">
            <div className="bg-slate-900 text-white p-2 rounded-xl shadow-2xl">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="mt-1.5 bg-white px-2 py-1 rounded-lg shadow-lg border border-slate-100 text-[8px] font-black uppercase tracking-tight">Your Home</div>
          </div>
          {/* ETA Bar */}
          <div className="absolute bottom-5 left-5 right-5">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/40 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. Delivery</p>
                  <p className="text-sm font-black text-slate-900">
                    {currentStatus === "DELIVERED" ? "Delivered ✅" : "25 – 30 Mins"}
                  </p>
                </div>
              </div>
              <Badge className={`text-[9px] font-black border-none ${
                currentStatus === "DELIVERED" ? "bg-emerald-100 text-emerald-700" :
                currentStatus === "OUT_FOR_DELIVERY" ? "bg-amber-100 text-amber-700" :
                "bg-teal-100 text-teal-700"
              }`}>
                {currentStatus.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Order Items Summary */}
        {order && (order.items as OrderItem[]).length > 0 && (
          <Card className="border-border/40 rounded-[2.5rem] shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center">
                  <Package className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Items Ordered</p>
                  <p className="font-black text-slate-900 text-sm">{(order.items as OrderItem[]).length} item(s) · ₹{order.totalAmount}</p>
                </div>
              </div>
              <div className="space-y-3">
                {(order.items as OrderItem[]).map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.imageEmoji}</span>
                      <div>
                        <p className="text-sm font-black text-slate-800">{item.name}</p>
                        {item.dosage && <p className="text-[10px] text-slate-400">{item.dosage}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-teal-600">₹{item.price * item.quantity}</p>
                      <p className="text-[10px] text-slate-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Order Status Timeline */}
        <Card className="border-border/40 rounded-[2.5rem] shadow-sm bg-white overflow-hidden">
          <CardContent className="p-8 space-y-8">
            <div className="flex flex-col gap-8">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-6 relative">
                  {i !== steps.length - 1 && (
                    <div className={`absolute left-3 top-8 bottom-[-20px] w-0.5 ${step.completed && steps[i+1].completed ? "bg-teal-500" : "bg-slate-100"}`} />
                  )}
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500 ${step.completed ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-300"}`}>
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <p className={`font-black text-sm tracking-tight transition-colors ${step.completed ? "text-slate-900" : "text-slate-300"}`}>{step.label}</p>
                      {step.completed && (
                        <p className="text-[10px] font-bold text-teal-600 mt-0.5">
                          {step.active ? "Just now" : "Completed"}
                        </p>
                      )}
                    </div>
                    {step.active && (
                      <Badge className="bg-teal-600/10 text-teal-600 border-none text-[9px] font-black animate-pulse">ACTIVE</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Partner */}
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
                <Button size="icon" className="h-12 w-12 rounded-2xl bg-teal-600 shadow-lg shadow-teal-600/20">
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
              <h5 className="font-black text-slate-900">
                {order?.pharmacy?.storeName ?? "Wellness Forever Pharmacy"}
              </h5>
              {order?.pharmacy?.address && (
                <p className="text-[10px] text-slate-400 mt-0.5">{order.pharmacy.address}</p>
              )}
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-300" />
        </div>

        {/* Order Again */}
        <Link href="/medicines">
          <Button variant="outline" className="w-full h-12 rounded-2xl font-bold text-sm border-slate-200 hover:bg-teal-50 hover:border-teal-200 hover:text-teal-700">
            Order More Medicines
          </Button>
        </Link>
      </main>
    </div>
  );
}
