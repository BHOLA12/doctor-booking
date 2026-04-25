import Link from "next/link";
import { Stethoscope, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Stethoscope className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold gradient-text">DocBook</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Your complete healthcare super-app. Book doctors, order medicines, schedule lab tests, and get personalised diet plans — all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/doctors" className="hover:text-foreground transition-colors">Find Doctors</Link></li>
              <li><Link href="/hospitals" className="hover:text-foreground transition-colors">Hospitals</Link></li>
              <li><Link href="/online-consultation" className="hover:text-foreground transition-colors">Online Consultation</Link></li>
              <li><Link href="/register?role=DOCTOR" className="hover:text-foreground transition-colors">Join as Doctor</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><Link href="/medicines" className="hover:text-foreground transition-colors">Order Medicines</Link></li>
              <li><Link href="/lab-tests" className="hover:text-foreground transition-colors">Book Lab Tests</Link></li>
              <li><Link href="/nutrition" className="hover:text-foreground transition-colors">Diet Plans</Link></li>
              <li><Link href="/doctors?specialization=nutritionist" className="hover:text-foreground transition-colors">Find Nutritionist</Link></li>
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

