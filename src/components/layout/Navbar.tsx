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
} from "lucide-react";
import { useState } from "react";
import NotificationBell from "@/components/layout/NotificationBell";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinks = [
    { href: "/doctors", label: "Find Doctors" },
    { href: "/doctors?specialization=general-physician", label: "General Physician" },
    { href: "/doctors?specialization=dentist", label: "Dentist" },
    { href: "/doctors?specialization=cardiologist", label: "Cardiologist" },
  ];

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/dashboard/admin";
    if (user.role === "DOCTOR") return "/dashboard/doctor";
    return "/dashboard/patient";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110">
            <Stethoscope className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">
            DocBook
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Link href={getDashboardLink()}>
                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-full px-3"
                    />
                  }
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm">{user.name.split(" ")[0]}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize mt-0.5">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href={getDashboardLink()} className="gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "PATIENT" && (
                    <DropdownMenuItem>
                      <Link href="/dashboard/patient/appointments" className="gap-2 cursor-pointer">
                        <CalendarDays className="h-4 w-4" />
                        My Appointments
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-5">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <>
                    <div className="my-2 border-t" />
                    <Link
                      href={getDashboardLink()}
                      onClick={() => setOpen(false)}
                      className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
