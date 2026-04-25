"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MedicineCard from "@/components/shared/MedicineCard";
import CartDrawer from "@/components/shared/CartDrawer";
import { useCart } from "@/context/CartContext";
import { MEDICINES, MEDICINE_CATEGORIES, type Medicine } from "@/lib/medicines-data";
import { useDebounce } from "@/hooks/useDebounce";

// Build Fuse index once
const fuseIndex = new Fuse<Medicine>(MEDICINES, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "salt", weight: 0.3 },
    { name: "category", weight: 0.1 },
    { name: "manufacturer", weight: 0.1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
});
import { Pill, Search, ShoppingCart, Shield, Truck, Clock, RotateCcw, ChevronRight } from "lucide-react";

export default function MedicinesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();

  const debouncedSearch = useDebounce(search, 300);
  const [filtered, setFiltered] = useState<Medicine[]>(MEDICINES);

  useEffect(() => {
    let results: Medicine[];
    if (!debouncedSearch.trim()) {
      results = MEDICINES;
    } else {
      results = fuseIndex.search(debouncedSearch).map((r) => r.item);
    }
    if (activeCategory !== "All") {
      results = results.filter((m) => m.category === activeCategory);
    }
    setFiltered(results);
  }, [debouncedSearch, activeCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative hero-gradient overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-teal-200)_0%,_transparent_50%)] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-sm font-medium rounded-full">
              <Pill className="h-3.5 w-3.5 mr-1.5" />
              Pharmacy &amp; Medicines
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Order <span className="gradient-text">Medicines</span>
              <br />
              Delivered to Your Door
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Search from thousands of medicines by name or salt composition. Genuine medicines, best prices, free delivery.
            </p>

            {/* Search & Condition Browse */}
            <div className="mt-7 flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="medicine-search"
                  placeholder="Search by medicine name or salt..."
                  className="pl-11 h-12 rounded-xl text-sm bg-white"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Link href="/health-conditions">
                <Button className="h-12 px-6 rounded-xl gap-2 font-bold shadow-lg shadow-primary/10">
                  Browse by Condition <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-x-8 gap-y-2 justify-center sm:justify-start">
            {[
              { icon: Shield, label: "100% Genuine Medicines" },
              { icon: Truck, label: "Free Delivery Above ₹299" },
              { icon: Clock, label: "Delivery in 24 Hours" },
              { icon: RotateCcw, label: "Easy Returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Icon className="h-3.5 w-3.5 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {MEDICINE_CATEGORIES.map((cat) => (
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

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> results
            {search && <span> for &quot;{search}&quot;</span>}
          </p>
          <Button
            id="open-cart-btn"
            variant="outline"
            className="gap-2 relative"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 min-w-5 px-1.5 text-[10px]">
                {cartCount}
              </Badge>
            )}
          </Button>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((medicine) => (
              <MedicineCard key={medicine.id} medicine={medicine} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold text-lg text-muted-foreground">No medicines found</p>
            <p className="text-sm text-muted-foreground mt-1">Try searching by a different name or salt</p>
            <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </section>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  );
}
