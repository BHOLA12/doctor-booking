"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type ProblemCategory } from "@/lib/problem-categories-data";

export default function ProblemCategoryCard({ category }: { category: ProblemCategory }) {
  return (
    <Link href={`/health-conditions/${category.slug}`}>
      <Card className="group h-full border border-slate-200/60 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden bg-white">
        <div className={`h-1.5 w-full bg-gradient-to-r ${category.color}`} />
        <CardContent className="p-6 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-start justify-between mb-5">
              <div className="relative flex h-28 w-28 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] overflow-hidden group-hover:scale-105 transition-transform duration-300 shrink-0">
                {category.image ? (
                  <Image 
                    src={category.image} 
                    alt={category.label} 
                    fill 
                    sizes="112px" 
                    className="object-contain p-2.5 transition-transform duration-300" 
                  />
                ) : (
                  <span className="text-4xl select-none">{category.emoji}</span>
                )}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm active:scale-95 shrink-0">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">
              {category.label}
            </h3>
            <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          </div>
          
          <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Explore Solutions</span>
            <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
