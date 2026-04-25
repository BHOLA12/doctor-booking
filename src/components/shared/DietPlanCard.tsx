"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { DietPlan } from "@/lib/diet-plans-data";
import { CheckCircle2, Clock, ArrowRight } from "lucide-react";

type Props = {
  plan: DietPlan;
  onSelect?: (plan: DietPlan) => void;
};

export default function DietPlanCard({ plan, onSelect }: Props) {
  return (
    <Card className="group relative flex flex-col h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {plan.popular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">
            Best Seller
          </Badge>
        </div>
      )}

      <CardContent className="flex flex-col flex-1 p-5">
        {/* Icon + accent gradient */}
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${plan.accent} mb-4 text-2xl shadow-sm`}>
          {plan.emoji}
        </div>

        {/* Header */}
        <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors">
          {plan.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 font-medium">{plan.goal}</p>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-2">
          {plan.description}
        </p>

        {/* Duration */}
        <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium">{plan.duration} Program</span>
        </div>

        {/* Features */}
        <div className="mt-4 space-y-1.5">
          {plan.features.slice(0, 4).map((f) => (
            <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
              {f}
            </div>
          ))}
          {plan.features.length > 4 && (
            <p className="text-xs text-primary font-medium pl-5">+{plan.features.length - 4} more benefits</p>
          )}
        </div>

        {/* Target conditions */}
        <div className="mt-3 flex flex-wrap gap-1">
          {plan.targetFor.map((t) => (
            <span key={t} className="text-[10px] bg-muted rounded-full px-2 py-0.5 text-muted-foreground">
              {t}
            </span>
          ))}
        </div>

        <div className="flex-1" />

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-xl font-bold">₹{plan.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{plan.mrp}</span>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 text-[10px]">
            {plan.discount}% OFF
          </Badge>
        </div>

        <Button
          size="sm"
          className="w-full mt-3 gap-1.5 group-hover:shadow-md transition-all"
          onClick={() => onSelect?.(plan)}
        >
          Get This Plan <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
