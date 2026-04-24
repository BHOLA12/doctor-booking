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
  Hospital,
  Globe,
  BookOpen,
  Search,
  Bell,
  Plus,
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/layout/NotificationBell";
import { SPECIALIZATIONS } from "@/lib/constants";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const mainLinks = [
    { href: "/doctors", label: "Find Doctors", icon: Search },
    { href: "/hospitals", label: "Hospitals", icon: Hospital },
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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground bg-clip-text">
            DocBook
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            href="/"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-accent/50"
          >
            Home
          </Link>
          
          <Link
            href="/doctors"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-accent/50"
          >
            Find Doctors
          </Link>

          {/* Specialties Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-accent/50 group">
                Specialties
                <ChevronDown className="h-4 w-4 transition-transform group-data-[state=open]:rotate-180" />
              </button>
            } />
            <DropdownMenuContent align="start" className="grid grid-cols-2 w-[400px] p-2 gap-1 animate-in fade-in slide-in-from-top-1">
              {SPECIALIZATIONS.slice(0, 10).map((spec) => (
                <DropdownMenuItem key={spec.value} className="p-0">
                  <Link
                    href={`/doctors?specialization=${spec.value}`}
                    className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className={`p-1.5 rounded-md bg-gradient-to-br ${spec.accent.split(" ").slice(0, 2).join(" ")} opacity-80`}>
                      <Plus className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs font-medium">{spec.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="col-span-2 my-1" />
              <Link href="/doctors" className="col-span-2 text-center text-xs text-primary font-medium p-2 hover:underline">
                View All Specialties
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          {mainLinks.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all rounded-lg hover:bg-accent/50"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? (
            <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <NotificationBell />
              <Link href="/doctors" className="hidden sm:block">
                <Button size="sm" className="rounded-full px-4 h-9 font-medium shadow-md shadow-primary/10 hover:shadow-lg transition-all active:scale-95">
                  Book Appointment
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full px-1.5 sm:px-3 h-9 border-muted-foreground/20 hover:bg-accent/50"
                    />
                  }
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold ring-2 ring-background">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user.name.split(" ")[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 p-2">
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
            <div className="flex items-center gap-2">
              <Link href="/login" className="hidden xs:block">
                <Button variant="ghost" size="sm" className="font-medium">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-5 h-9 font-medium shadow-md shadow-primary/10">
                  Book Appointment
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
                <div className="p-6 border-b flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-lg">DocBook</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
                  >
                    Home
                  </Link>
                  {mainLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-accent transition-colors"
                    >
                      <link.icon className="h-4 w-4 text-muted-foreground" />
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Specialties
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {SPECIALIZATIONS.slice(0, 8).map((spec) => (
                      <Link
                        key={spec.value}
                        href={`/doctors?specialization=${spec.value}`}
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 text-xs font-medium rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                      >
                         <div className={`w-1.5 h-1.5 rounded-full bg-primary/40`} />
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
                      <Button className="w-full rounded-xl h-11" onClick={() => setOpen(false)}>Book Appointment</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
