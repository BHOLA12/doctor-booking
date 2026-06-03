"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  User, 
  ChevronDown, 
  Menu, 
  PhoneCall, 
  Tag, 
  Grid2X2,
  Stethoscope,
  Building2,
  Pill
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function PharmacyNavbar() {
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [location, setLocation] = useState("Noida, Sector 18");
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-border/60 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center gap-4 lg:gap-8">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white border border-slate-200/60 shadow-sm overflow-hidden relative shrink-0">
              <Image src="/logo.png" alt="ClinikBook" width={44} height={44} className="object-contain p-1" />
            </div>
            <span className="hidden sm:inline text-xl font-extrabold tracking-tight text-foreground">
              Clinik<span className="text-cta">Book</span>
            </span>
          </Link>

          {/* Location Selector */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-slate-50/50 hover:bg-slate-100/50 cursor-pointer transition-colors max-w-[180px]">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-muted-foreground font-semibold uppercase leading-none">Deliver to</span>
              <span className="text-sm font-bold truncate text-slate-800 leading-tight">{location}</span>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-400 shrink-0" />
          </div>

          {/* Search Bar */}
          <div className="flex-1 relative max-w-2xl">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search medicines, health products, brands..." 
                className="w-full h-12 pl-12 pr-4 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary/30 transition-all text-[15px] font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            
            {/* Offers */}
            <Link href="/offers" className="hidden lg:flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors font-bold text-sm">
              <Tag className="h-4 w-4" />
              <span>Offers</span>
            </Link>

            {/* Categories */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className="hidden xl:flex items-center gap-1.5 text-slate-600 hover:text-primary transition-colors font-bold text-sm">
                  <Grid2X2 className="h-4 w-4" />
                  <span>Categories</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              } />
              <DropdownMenuContent align="end" className="w-56 p-2">
                <DropdownMenuItem>All Medicines</DropdownMenuItem>
                <DropdownMenuItem>Personal Care</DropdownMenuItem>
                <DropdownMenuItem>Baby Care</DropdownMenuItem>
                <DropdownMenuItem>Nutrition</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ShoppingCart className="h-6 w-6 text-slate-700" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 text-[10px] font-bold">
                  {cartCount}
                </Badge>
              )}
            </Link>

            {/* Store Portal */}
            <Link href="/pharmacy/dashboard" className="hidden md:block">
              <Button variant="outline" size="sm" className="font-bold text-teal-700 border-teal-100 hover:bg-teal-50 gap-1.5 h-10 rounded-xl">
                <Building2 className="h-4 w-4" />
                <span>Store Portal</span>
              </Button>
            </Link>

            {/* User */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold border border-primary/20">
                  {user.name.charAt(0)}
                </div>
              ) : (
                <Button variant="ghost" size="sm" className="font-bold text-slate-700 gap-2 hover:bg-primary/5 hover:text-primary">
                  <User className="h-5 w-5" />
                  <span>Login</span>
                </Button>
              )}
            </div>

            {/* Emergency Order */}
            <Button size="sm" className="hidden lg:flex rounded-full px-5 h-10 font-black shadow-lg shadow-primary/15 gap-2 uppercase tracking-tight">
              <PhoneCall className="h-4 w-4" />
              Emergency
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden h-10 w-10" />}>
                <Menu className="h-6 w-6" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full bg-white text-slate-800">
                  <div className="p-5 border-b border-slate-100 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                      <Pill className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-black tracking-tight text-slate-900">
                      Clinik<span className="text-teal-600">Pharmacy</span>
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Sourcing Location display on mobile */}
                    <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-teal-600" />
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Deliver to</span>
                      </div>
                      <p className="text-sm font-extrabold text-slate-800">{location}</p>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href="/offers"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        <Tag className="h-4 w-4 text-teal-600" />
                        Offers & Discounts
                      </Link>

                      <Link
                        href="/pharmacy/dashboard"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl hover:bg-slate-50 transition-colors text-slate-700"
                      >
                        <Building2 className="h-4 w-4 text-teal-600" />
                        Store Portal
                      </Link>

                      <div className="pt-3 border-t border-slate-100 mt-3">
                        <div className="px-4 pb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Shop by Category
                        </div>
                        {["All Medicines", "Personal Care", "Baby Care", "Nutrition"].map((cat) => (
                          <Link
                            key={cat}
                            href={`/pharmacy`}
                            onClick={() => {
                              setOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-xs font-bold rounded-lg hover:bg-slate-50 text-left transition-colors text-slate-600"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                            {cat}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 space-y-2">
                    <Button variant="outline" className="w-full rounded-xl h-11 border-rose-100 text-rose-700 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-800 gap-2 font-bold uppercase tracking-tight">
                      <PhoneCall className="h-4 w-4" />
                      Emergency Order
                    </Button>

                    {!user && (
                      <Link href="/login" className="block w-full">
                        <Button className="w-full rounded-xl h-11 bg-teal-600 hover:bg-teal-500 text-white font-bold" onClick={() => setOpen(false)}>
                          Login
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
