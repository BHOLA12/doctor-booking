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
    <div className="bg-white border-b border-slate-100 py-3 hidden md:block">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-teal-600" />
              <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
