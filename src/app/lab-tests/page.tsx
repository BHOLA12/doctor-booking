"use client";

import { useState, useEffect } from "react";
import Fuse from "fuse.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LabTestCard from "@/components/shared/LabTestCard";
import LabBookingModal from "@/components/shared/LabBookingModal";
import { useDebounce } from "@/hooks/useDebounce";
import { LAB_TESTS, LAB_TEST_CATEGORIES, type LabTest } from "@/lib/lab-tests-data";

const fuseIndex = new Fuse<LabTest>(LAB_TESTS, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "category", weight: 0.25 },
    { name: "description", weight: 0.15 },
    { name: "testsIncluded", weight: 0.1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
});
import { FlaskConical, Search, Home, Clock, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function LabTestsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleBook = (test: LabTest) => {
    setSelectedTest(test);
    setModalOpen(true);
  };

  const debouncedSearch = useDebounce(search, 300);
  const [filtered, setFiltered] = useState<LabTest[]>(LAB_TESTS);

  useEffect(() => {
    let results: LabTest[];
    if (!debouncedSearch.trim()) {
      results = LAB_TESTS;
    } else {
      results = fuseIndex.search(debouncedSearch).map((r) => r.item);
    }
    if (activeCategory !== "All") {
      results = results.filter((t) => t.category === activeCategory);
    }
    setFiltered(results);
  }, [debouncedSearch, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-teal-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-sm font-medium rounded-full">
              <FlaskConical className="h-3.5 w-3.5 mr-1.5" />
              Diagnostic Tests
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Book <span className="gradient-text">Lab Tests</span>
              <br />
              from Home
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              NABL-certified labs, home sample collection, and fast report delivery — all at up to 60% off.
            </p>

            {/* Search */}
            <div className="mt-7 relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="lab-test-search"
                placeholder="Search tests (e.g., thyroid, blood, diabetes)..."
                className="pl-11 h-12 rounded-xl text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center sm:justify-start">
            {[
              { icon: Shield, label: "NABL Certified Labs" },
              { icon: Home, label: "Free Home Collection" },
              { icon: Clock, label: "Reports in 6–24 Hrs" },
              { icon: FlaskConical, label: "3,000+ Tests Available" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Packages Banner */}
      <section className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-10">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base">🎯 Full Body Checkup at ₹999</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Complete health screening — 60% off. Limited time offer.</p>
          </div>
          <Button
            className="shrink-0 gap-1"
            onClick={() => handleBook(LAB_TESTS.find((t) => t.id === "lt1")!)}
          >
            Book Now <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Tests Catalogue */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {LAB_TEST_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20"
                  : "border-border hover:border-primary/40 hover:bg-accent/60 text-muted-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing <span className="font-semibold text-foreground">{filtered.length}</span> tests
          {search && <span> for &quot;{search}&quot;</span>}
        </p>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((test) => (
              <LabTestCard key={test.id} test={test} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔬</div>
            <p className="font-semibold text-lg text-muted-foreground">No tests found</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="py-12 bg-muted/30 border-t">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-2">Need a doctor&apos;s advice first?</h2>
          <p className="text-muted-foreground mb-5 text-sm">Consult a doctor online and get a personalised test recommendation.</p>
          <Link href="/doctors">
            <Button size="lg" variant="outline" className="gap-2 rounded-full px-8">
              Find a Doctor <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <LabBookingModal test={selectedTest} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
