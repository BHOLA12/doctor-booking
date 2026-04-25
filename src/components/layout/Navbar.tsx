"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Stethoscope,
  LogOut,
  LayoutDashboard,
  Menu,
  CalendarDays,
  ChevronDown,
  Headphones,
  Pill,
  FlaskConical,
  Salad,
  Hospital,
  Globe,
  BookOpen,
  Plus,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/layout/NotificationBell";
import { SPECIALIZATIONS } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import CartDrawer from "@/components/shared/CartDrawer";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { cartCount } = useCart();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/doctors", label: "Find Doctors" },
    { href: "/hospitals", label: "Hospitals" },
  ];

  const serviceLinks = [
    { href: "/online-consultation", label: "Online Consultation", icon: Globe },
    { href: "/health-conditions", label: "Health Conditions", icon: Activity },
    { href: "/medicines", label: "Order Medicines", icon: Pill },
    { href: "/lab-tests", label: "Book Lab Tests", icon: FlaskConical },
    { href: "/nutrition", label: "Diet & Nutrition", icon: Salad },
    { href: "/blog", label: "Health Blog", icon: BookOpen },
  ];

  const mobileLinks = [
    { href: "/", label: "Home" },
    { href: "/doctors", label: "Find Doctors" },
    { href: "/hospitals", label: "Hospitals" },
    { href: "/lab-tests", label: "Lab Tests", icon: FlaskConical },
    { href: "/medicines", label: "Medicines", icon: Pill },
    { href: "/nutrition", label: "Nutrition", icon: Salad },
    { href: "/online-consultation", label: "Online Consultation", icon: Globe },
    { href: "/blog", label: "Health Blog", icon: BookOpen },
  ];

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "DOCTOR") return "/dashboard/doctor";
    return "/dashboard/patient";
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-lg shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-all group-hover:scale-105">
              <Stethoscope className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">
              Doc<span className="text-primary">Book</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/5"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <button className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/5 group">
                  Services
                  <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
                </button>
              } />
              <DropdownMenuContent align="start" className="w-56 p-2 gap-1">
                {serviceLinks.map((link) => (
                  <DropdownMenuItem key={link.href} className="p-0">
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 w-full p-2.5 rounded-md hover:bg-accent transition-colors"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10">
                        <link.icon className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/lab-tests" className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
              Lab Tests
            </Link>
            <Link href="/medicines" className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-primary/5">
              Medicines
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* 24/7 Support */}
            <div className="hidden xl:flex items-center gap-1.5 text-sm text-muted-foreground font-medium mr-1">
              <Headphones className="h-4 w-4 text-primary" />
              <span>24/7 Support</span>
            </div>

            {/* Cart */}
            <button
              id="navbar-cart-btn"
              onClick={() => setCartOpen(true)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent/50 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="h-5 w-5 text-slate-600" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 text-[9px] leading-none">
                  {cartCount}
                </Badge>
              )}
            </button>

            {loading ? (
              <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2">
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="outline" size="sm" className="gap-2 rounded-full px-2 sm:px-3 h-9 border-border hover:bg-accent/50" />
                  }>
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-2 ring-background">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user.name.split(" ")[0]}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 p-2">
                    <div className="px-2 py-2 mb-1">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-md">
                      <Link href={getDashboardLink()} className="flex items-center gap-2 w-full">
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {user.role === "PATIENT" && (
                      <DropdownMenuItem className="rounded-md">
                        <Link href="/dashboard/patient/appointments" className="flex items-center gap-2 w-full">
                          <CalendarDays className="h-4 w-4 text-muted-foreground" />
                          My Appointments
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="rounded-md text-destructive focus:text-destructive focus:bg-destructive/10"
                      onClick={logout}
                    >
                      <div className="flex items-center gap-2 w-full cursor-pointer">
                        <LogOut className="h-4 w-4" />
                        Logout
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-medium text-slate-600">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full px-5 h-9 font-semibold shadow-md shadow-primary/15">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden h-9 w-9" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-5 border-b flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                      <Stethoscope className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-lg">DocBook</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {mobileLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
                      >
                        {link.icon && <link.icon className="h-4 w-4 text-primary" />}
                        {link.label}
                      </Link>
                    ))}
                    <div className="pt-3 border-t mt-3">
                      <div className="pt-2 pb-1 px-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Specialties
                      </div>
                      {SPECIALIZATIONS.slice(0, 6).map((spec) => (
                        <Link
                          key={spec.value}
                          href={`/doctors?specialization=${spec.value}`}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium rounded-lg hover:bg-accent transition-colors"
                        >
                          <span>{spec.emoji}</span>
                          {spec.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                  {!user && (
                    <div className="p-4 border-t space-y-2">
                      <Link href="/login" className="block w-full">
                        <Button variant="outline" className="w-full rounded-xl h-11" onClick={() => setOpen(false)}>Login</Button>
                      </Link>
                      <Link href="/register" className="block w-full">
                        <Button className="w-full rounded-xl h-11" onClick={() => setOpen(false)}>Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
