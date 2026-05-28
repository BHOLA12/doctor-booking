"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { DietPlan } from "@/lib/diet-plans-data";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

type Props = {
  plan: DietPlan;
  onSelect?: (plan: DietPlan) => void;
  onViewDetails?: (plan: DietPlan) => void;
};

export default function DietPlanCard({ plan, onSelect, onViewDetails }: Props) {
  return (
    <Card 
      onClick={() => onViewDetails?.(plan)}
      className="group relative flex flex-col h-full hover:shadow-[0_20px_40px_rgba(16,185,129,0.08)] hover:border-emerald-500/20 hover:scale-[1.01] transition-all duration-500 overflow-hidden rounded-3xl border-muted/80 bg-card/60 backdrop-blur-sm cursor-pointer"
    >
      {plan.popular && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border-0 shadow-sm">
            Best Seller
          </Badge>
        </div>
      )}

      <CardContent className="flex flex-col flex-1 p-5 sm:p-6">
        {/* Image / Icon + accent gradient (medium size) */}
        <div className="mb-5 overflow-hidden rounded-2xl shadow-sm border border-muted/30">
          {plan.image ? (
            <div className={`relative h-44 w-full bg-gradient-to-br ${plan.accent}`}>
              <Image
                src={plan.image}
                alt={plan.title}
                fill
                sizes="(max-width: 640px) 100vw, 400px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          ) : (
            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.accent} text-2xl`}>{plan.emoji}</div>
          )}
        </div>

        {/* Header */}
        <h3 className="font-bold text-lg leading-snug group-hover:text-emerald-600 transition-colors">
          {plan.title}
        </h3>
        <p className="text-xs text-emerald-600 font-semibold mt-1 bg-emerald-50/50 self-start px-2 py-0.5 rounded-md">{plan.goal}</p>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed line-clamp-2">
          {plan.description}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 mt-4 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-medium">{plan.duration} Program</span>
        </div>

        {/* Features */}
        <div className="mt-4.5 space-y-2 border-t border-muted/40 pt-4">
          {plan.features.slice(0, 4).map((f) => (
            <div key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-tight">{f}</span>
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-xs text-emerald-600 font-semibold pl-5">+{plan.features.length - 4} more benefits</p>
          )}
        </div>

        {/* Target conditions */}
        <div className="mt-4 flex flex-wrap gap-1">
          {plan.targetFor.map((t) => (
            <span key={t} className="text-[10px] bg-muted/60 rounded-full px-2.5 py-0.5 text-muted-foreground font-medium">
              {t}
            </span>
          ))}
        </div>

        <div className="flex-1 min-h-[16px]" />

        {/* Price */}
        <div className="mt-5 flex items-baseline gap-2 border-t border-muted/40 pt-4">
          <span className="text-2xl font-black text-foreground">₹{plan.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{plan.mrp}</span>
          <Badge className="bg-emerald-100/80 text-emerald-700 hover:bg-emerald-100/80 text-[10px] font-bold border-0">
            {plan.discount}% OFF
          </Badge>
        </div>

        <Button
          size="default"
          className="w-full mt-4 font-semibold h-11 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 gap-2 flex items-center justify-center border-0 group/btn"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.(plan);
          }}
        >
          <span>Get This Plan</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
