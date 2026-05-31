import Link from "next/link";
import Image from "next/image";
import { Stethoscope } from "lucide-react";
import ContactSection from "./ContactSection";

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3.5 mb-5 group">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md shadow-slate-200/20 overflow-hidden relative shrink-0 border border-slate-200/60">
                <Image src="/logo.png" alt="ClinikBook" width={64} height={64} className="object-contain p-1.5 transition-transform group-hover:scale-105" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-foreground leading-none mb-1">
                  Clinik<span className="text-cta">Book</span>
                </span>
                <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">Healthcare Simplified</span>
              </div>
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
          <ContactSection />
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} ClinikBook. All rights reserved. Made with ❤️ for better healthcare.</p>
        </div>
      </div>
    </footer>
  );
}

