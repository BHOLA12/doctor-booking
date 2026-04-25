"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type ProblemCategory } from "@/lib/problem-categories-data";

export default function ProblemCategoryCard({ category }: { category: ProblemCategory }) {
  return (
    <Link href={`/health-conditions/${category.slug}`}>
      <Card className="group h-full border-none shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-2 w-full bg-gradient-to-r ${category.color}`} />
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-2xl shadow-sm group-hover:scale-110 transition-transform`}>
              {category.emoji}
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
              <ChevronRight className="h-5 w-5" />
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-primary transition-colors">
            {category.label}
          </h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {category.description}
          </p>
          
          <div className="mt-6 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Explore Solutions</span>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
