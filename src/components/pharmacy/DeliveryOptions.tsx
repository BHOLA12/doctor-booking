"use client";

import { useState } from "react";
import { DELIVERY_OPTIONS } from "@/lib/pharmacy-data";
import { CheckCircle2 } from "lucide-react";

export default function DeliveryOptions() {
  const [selected, setSelected] = useState("instant");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {DELIVERY_OPTIONS.map((option) => (
        <button
          key={option.id}
          onClick={() => setSelected(option.id)}
          className={`relative p-6 rounded-[2rem] border-2 text-left transition-all duration-300 ${
            selected === option.id
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/5"
              : "border-slate-100 bg-white hover:border-slate-200"
          }`}
        >
          {selected === option.id && (
            <div className="absolute top-4 right-4">
              <CheckCircle2 className="h-6 w-6 text-primary fill-primary/10" />
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-4">
             <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-2xl shadow-sm">
               {option.icon}
             </div>
             <div>
               <h4 className="font-black text-slate-900 leading-none mb-1">{option.label}</h4>
               <span className="text-xs font-black text-primary uppercase tracking-widest">{option.time}</span>
             </div>
          </div>
          
          <p className="text-sm font-medium text-slate-500 mb-4">{option.description}</p>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
             <span className="text-sm font-bold text-slate-400">Delivery Fee</span>
             <span className={`text-sm font-black ${option.price === 'FREE' ? 'text-emerald-600' : 'text-slate-900'}`}>
               {option.price}
             </span>
          </div>
        </button>
      ))}
    </div>
  );
}
