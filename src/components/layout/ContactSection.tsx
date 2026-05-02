"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, ChevronDown } from "lucide-react";

type CountryContact = {
  flag: string;
  name: string;
  phone: string;       // display text
  phoneRaw: string;    // for tel: href (digits only)
  email: string;
};

const CONTACTS: CountryContact[] = [
  {
    flag: "🇮🇳",
    name: "India",
    phone: "+91 98765 43210",
    phoneRaw: "+919876543210",
    email: "support.in@docbook.in",
  },
  {
    flag: "🇺🇸",
    name: "USA",
    phone: "+1 (800) 123 4567",
    phoneRaw: "+18001234567",
    email: "support.us@docbook.in",
  },
  {
    flag: "🇬🇧",
    name: "UK",
    phone: "+44 800 123 4567",
    phoneRaw: "+448001234567",
    email: "support.uk@docbook.in",
  },
  {
    flag: "🇦🇺",
    name: "Australia",
    phone: "+61 1800 123 456",
    phoneRaw: "+611800123456",
    email: "support.au@docbook.in",
  },
  {
    flag: "🇦🇪",
    name: "UAE",
    phone: "+971 800 123 456",
    phoneRaw: "+971800123456",
    email: "support.ae@docbook.in",
  },
  {
    flag: "🇸🇬",
    name: "Singapore",
    phone: "+65 6123 4567",
    phoneRaw: "+6561234567",
    email: "support.sg@docbook.in",
  },
  {
    flag: "🇨🇦",
    name: "Canada",
    phone: "+1 (888) 765 4321",
    phoneRaw: "+18887654321",
    email: "support.ca@docbook.in",
  },
];

export default function ContactSection() {
  const [selected, setSelected] = useState<CountryContact>(CONTACTS[0]);

  const mailtoHref = `mailto:${selected.email}?subject=Complaint%20%2F%20Issue%20Report&body=Hello%20DocBook%20Support%2C%0A%0AI%20would%20like%20to%20report%20the%20following%20issue%3A%0A%0A%5BDescribe%20your%20issue%20here%5D%0A%0ARegion%3A%20${encodeURIComponent(selected.name)}%0A%0AThank%20you.`;

  return (
    <div>
      <h3 className="font-semibold mb-4">Contact</h3>
      <ul className="space-y-3 text-sm text-muted-foreground">

        {/* Country Picker */}
        <li className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <div className="relative w-full">
            <select
              value={selected.name}
              onChange={(e) => {
                const found = CONTACTS.find((c) => c.name === e.target.value);
                if (found) setSelected(found);
              }}
              className="w-full appearance-none bg-transparent border border-border/50 rounded-lg pl-2 pr-7 py-1 text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer hover:border-primary/50 transition-colors"
            >
              {CONTACTS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag}  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          </div>
        </li>

        {/* Phone — triggers native dialer */}
        <li>
          <a
            href={`tel:${selected.phoneRaw}`}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <Phone className="h-4 w-4 text-primary group-hover:animate-bounce shrink-0" />
            <span>{selected.flag} {selected.phone}</span>
          </a>
        </li>

        {/* Email — opens pre-filled complaint */}
        <li>
          <a
            href={mailtoHref}
            className="flex items-center gap-2 hover:text-primary transition-colors group"
          >
            <Mail className="h-4 w-4 text-primary group-hover:scale-110 transition-transform shrink-0" />
            <span className="break-all">{selected.email}</span>
          </a>
        </li>

      </ul>
    </div>
  );
}
