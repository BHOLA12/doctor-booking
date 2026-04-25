"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearch, type SearchCategory } from "@/hooks/useSearch";
import {
  Search,
  Stethoscope,
  Pill,
  FlaskConical,
  Salad,
  Star,
  Loader2,
  ArrowRight,
  X,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CATEGORIES: { id: SearchCategory; label: string; icon: React.ElementType; color: string }[] = [
  { id: "all", label: "All", icon: Search, color: "text-slate-600" },
  { id: "doctors", label: "Doctors", icon: Stethoscope, color: "text-teal-600" },
  { id: "medicines", label: "Medicines", icon: Pill, color: "text-blue-600" },
  { id: "lab-tests", label: "Lab Tests", icon: FlaskConical, color: "text-violet-600" },
  { id: "nutrition", label: "Nutrition", icon: Salad, color: "text-emerald-600" },
];

const POPULAR_SEARCHES = [
  "Cardiologist", "Blood Test", "Paracetamol", "Thyroid Test",
  "Dermatologist", "Weight Loss Plan", "Full Body Checkup",
];

type Props = {
  onClose?: () => void;
  autoFocus?: boolean;
};

export default function GlobalSearch({ onClose, autoFocus }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [category, setCategory] = useState<SearchCategory>("all");
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(inputValue, 300);
  const { results, loading, total } = useSearch(debouncedQuery, category);

  const hasResults = total > 0;
  const showPopular = !debouncedQuery && !loading;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose?.();
  }, [onClose]);

  return (
    <div className="flex flex-col h-full max-h-[80vh] overflow-hidden" onKeyDown={handleKeyDown}>
      {/* Search Input */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-white">
        {loading ? (
          <Loader2 className="h-5 w-5 text-primary shrink-0 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
        <input
          ref={inputRef}
          id="global-search-input"
          type="text"
          className="flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground"
          placeholder="Search doctors, medicines, lab tests, diet plans..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoComplete="off"
        />
        {inputValue && (
          <button
            onClick={() => setInputValue("")}
            className="flex h-5 w-5 items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        {onClose && (
          <button
            onClick={onClose}
            className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground border rounded px-1.5 py-0.5 hover:bg-muted transition-colors"
          >
            <span>ESC</span>
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-1 px-3 py-2 border-b overflow-x-auto bg-slate-50/50">
        {CATEGORIES.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              category === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon className={`h-3.5 w-3.5 ${category === id ? "" : color}`} />
            {label}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {/* Popular searches when empty */}
        {showPopular && (
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Popular Searches</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => setInputValue(term)}
                  className="text-xs bg-muted hover:bg-primary/10 hover:text-primary rounded-full px-3 py-1.5 font-medium transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && debouncedQuery && (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-9 w-9 rounded-xl bg-muted shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/2" />
                  <div className="h-2.5 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && debouncedQuery && !hasResults && (
          <div className="flex flex-col items-center py-12 text-center px-4">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-sm">No results for &quot;{debouncedQuery}&quot;</p>
            <p className="text-xs text-muted-foreground mt-1">Try a different spelling or keyword</p>
          </div>
        )}

        {/* Results Sections */}
        {!loading && hasResults && (
          <div className="pb-4">
            {/* Doctors */}
            {results.doctors.length > 0 && (
              <ResultSection
                title="Doctors"
                icon={<Stethoscope className="h-3.5 w-3.5 text-teal-600" />}
                viewAllHref={`/doctors?search=${encodeURIComponent(debouncedQuery)}`}
              >
                {results.doctors.map((d) => (
                  <Link key={d.id} href={`/doctors/${d.id}`} onClick={onClose}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-700 font-bold text-sm">
                        {d.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors truncate">
                          {d.name.startsWith("Dr.") ? d.name : `Dr. ${d.name}`}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{d.specialization} · {d.city}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600 shrink-0">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {d.rating.toFixed(1)}
                      </div>
                      <span className="text-xs font-semibold text-primary shrink-0">₹{d.fees}</span>
                    </div>
                  </Link>
                ))}
              </ResultSection>
            )}

            {/* Medicines */}
            {results.medicines.length > 0 && (
              <ResultSection
                title="Medicines"
                icon={<Pill className="h-3.5 w-3.5 text-blue-600" />}
                viewAllHref={`/medicines?search=${encodeURIComponent(debouncedQuery)}`}
              >
                {results.medicines.map((m) => (
                  <Link key={m.id} href={`/medicines`} onClick={onClose}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                        {m.imageEmoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{m.salt}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">₹{m.price}</p>
                        {m.discount > 0 && (
                          <Badge className="text-[9px] px-1 py-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{m.discount}% off</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </ResultSection>
            )}

            {/* Lab Tests */}
            {results.labTests.length > 0 && (
              <ResultSection
                title="Lab Tests"
                icon={<FlaskConical className="h-3.5 w-3.5 text-violet-600" />}
                viewAllHref={`/lab-tests?search=${encodeURIComponent(debouncedQuery)}`}
              >
                {results.labTests.map((t) => (
                  <Link key={t.id} href="/lab-tests" onClick={onClose}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-xl">
                        {t.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors truncate">{t.name}</p>
                        <p className="text-xs text-muted-foreground">Report in {t.reportTime}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">₹{t.price}</p>
                        {t.discount > 0 && (
                          <Badge className="text-[9px] px-1 py-0 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{t.discount}% off</Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </ResultSection>
            )}

            {/* Diet Plans */}
            {results.dietPlans.length > 0 && (
              <ResultSection
                title="Diet Plans"
                icon={<Salad className="h-3.5 w-3.5 text-emerald-600" />}
                viewAllHref="/nutrition"
              >
                {results.dietPlans.map((p) => (
                  <Link key={p.id} href="/nutrition" onClick={onClose}>
                    <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                        {p.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors truncate">{p.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.goal}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-primary">₹{p.price}</p>
                        <p className="text-[10px] text-muted-foreground">{p.duration}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </ResultSection>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {debouncedQuery && hasResults && (
        <div className="border-t px-4 py-2.5 bg-slate-50/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{total} result{total !== 1 ? "s" : ""} found</span>
          <Link href={`/doctors?search=${encodeURIComponent(debouncedQuery)}`} onClick={onClose}>
            <button className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
              See all <ArrowRight className="h-3 w-3" />
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}

// ── Internal helper component ────────────────────────────────────────────────
function ResultSection({
  title,
  icon,
  viewAllHref,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  viewAllHref: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
        <Link href={viewAllHref} className="text-[11px] text-primary font-semibold hover:underline flex items-center gap-0.5">
          View all <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
}
