"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LabTest } from "@/lib/lab-tests-data";
import { Clock, FlaskConical, Home } from "lucide-react";

type Props = {
  test: LabTest;
  onBook: (test: LabTest) => void;
};

export default function LabTestCard({ test, onBook }: Props) {
  return (
    <Card className="group relative flex flex-col h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {test.popular && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5">
            Popular
          </Badge>
        </div>
      )}
      {test.discount >= 40 && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5">
            {test.discount}% OFF
          </Badge>
        </div>
      )}

      <CardContent className="flex flex-col flex-1 p-5">
        {/* Icon + Category */}
        <div className="flex items-center gap-2 mb-3 mt-1">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/8 text-2xl shrink-0">
            {test.emoji}
          </div>
          <Badge variant="secondary" className="text-[10px] font-medium">
            {test.category}
          </Badge>
        </div>

        {/* Name */}
        <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
          {test.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
          {test.description}
        </p>

        {/* Meta */}
        <div className="mt-3 flex flex-wrap gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 text-primary" />
            Report in {test.reportTime}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FlaskConical className="h-3 w-3 text-blue-500" />
            {test.sampleType}
          </div>
          {test.homeCollection && (
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <Home className="h-3 w-3" />
              Home Collection
            </div>
          )}
        </div>

        {/* Tests Included */}
        <div className="mt-3">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Includes
          </p>
          <div className="flex flex-wrap gap-1">
            {test.testsIncluded.slice(0, 4).map((t) => (
              <span key={t} className="inline-block text-[10px] bg-muted rounded px-1.5 py-0.5 text-muted-foreground">
                {t}
              </span>
            ))}
            {test.testsIncluded.length > 4 && (
              <span className="inline-block text-[10px] bg-primary/10 text-primary rounded px-1.5 py-0.5 font-medium">
                +{test.testsIncluded.length - 4} more
              </span>
            )}
          </div>
        </div>

        <div className="flex-1" />

        {/* Price */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">₹{test.price}</span>
          <span className="text-xs text-muted-foreground line-through">₹{test.mrp}</span>
          <span className="text-xs text-emerald-600 font-semibold">Save ₹{test.mrp - test.price}</span>
        </div>

        <Button
          size="sm"
          className="w-full mt-3 gap-1.5 group-hover:shadow-md transition-all"
          onClick={() => onBook(test)}
        >
          Book Now
        </Button>
      </CardContent>
    </Card>
  );
}
