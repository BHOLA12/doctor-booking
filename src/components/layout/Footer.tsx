import Link from "next/link";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Stethoscope className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold gradient-text">DocBook</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted global healthcare partner. Find and book appointments with the best doctors near you, anywhere in the world.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/doctors" className="hover:text-foreground transition-colors">Find Doctors</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Register</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
              <li><Link href="/register?role=DOCTOR" className="hover:text-foreground transition-colors">Join as Doctor</Link></li>
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h3 className="font-semibold mb-4">Specializations</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/doctors?specialization=cardiologist" className="hover:text-foreground transition-colors">Cardiologist</Link></li>
              <li><Link href="/doctors?specialization=dentist" className="hover:text-foreground transition-colors">Dentist</Link></li>
              <li><Link href="/doctors?specialization=pediatrician" className="hover:text-foreground transition-colors">Pediatrician</Link></li>
              <li><Link href="/doctors?specialization=orthopedic" className="hover:text-foreground transition-colors">Orthopedic</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Worldwide
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                support@docbook.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DocBook. All rights reserved. Made with ❤️ for better healthcare.</p>
        </div>
      </div>
    </footer>
  );
}
