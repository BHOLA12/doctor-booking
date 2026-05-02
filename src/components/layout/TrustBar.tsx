"use client";

import { ShieldCheck, Truck, Clock, RotateCcw, BadgeCheck, Lock } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "100% Genuine Medicines" },
  { icon: Truck, label: "Free Delivery Above ₹299" },
  { icon: Clock, label: "Delivery in 24 Hours" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: BadgeCheck, label: "Verified Pharmacies" },
  { icon: Lock, label: "Secure Payments" },
];

export default function TrustBar() {
  return (
    <div className="bg-slate-50 border-b border-border/40 py-2 hidden md:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-[10px] lg:text-[11px] font-medium text-slate-600 uppercase tracking-tight">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
