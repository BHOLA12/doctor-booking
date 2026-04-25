"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SPECIALIZATIONS } from "@/lib/constants";
import { MoreHorizontal, Thermometer, Weight, Heart, Brain, Baby, Zap } from "lucide-react";

type Tab = "specialization" | "symptom" | "lab" | "medicine";

const DOCTOR_COUNTS: Record<string, string> = {
  cardiologist: "1,200+",
  "general-physician": "2,500+",
  dermatologist: "800+",
  pediatrician: "1,500+",
  orthopedic: "1,100+",
  gynecologist: "900+",
  ent: "700+",
  neurologist: "600+",
  ophthalmologist: "800+",
  psychiatrist: "500+",
  urologist: "600+",
  nutritionist: "350+",
};

const SYMPTOMS = [
  { emoji: "🌡️", label: "Fever", services: [{ l: "Doctor", h: "/doctors?specialization=general-physician" }, { l: "Medicine", h: "/medicines" }, { l: "Lab Test", h: "/lab-tests" }] },
  { emoji: "🩸", label: "Diabetes", services: [{ l: "Doctor", h: "/doctors" }, { l: "Lab Test", h: "/lab-tests" }, { l: "Diet Plan", h: "/nutrition" }] },
  { emoji: "🦴", label: "Joint Pain", services: [{ l: "Doctor", h: "/doctors?specialization=orthopedic" }, { l: "Medicine", h: "/medicines" }] },
  { emoji: "✨", label: "Skin Issue", services: [{ l: "Doctor", h: "/doctors?specialization=dermatologist" }, { l: "Medicine", h: "/medicines" }] },
  { emoji: "⚖️", label: "Weight", services: [{ l: "Diet Plan", h: "/nutrition" }, { l: "Doctor", h: "/doctors" }, { l: "Lab Test", h: "/lab-tests" }] },
  { emoji: "❤️", label: "Heart", services: [{ l: "Doctor", h: "/doctors?specialization=cardiologist" }, { l: "Lab Test", h: "/lab-tests" }] },
  { emoji: "🧠", label: "Mental Health", services: [{ l: "Doctor", h: "/doctors?specialization=psychiatrist" }, { l: "Diet Plan", h: "/nutrition" }] },
  { emoji: "👶", label: "Child Health", services: [{ l: "Doctor", h: "/doctors?specialization=pediatrician" }, { l: "Medicine", h: "/medicines" }] },
];

export default function SpecializationTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("specialization");

  const tabs = [
    { id: "specialization" as Tab, emoji: "🔍", label: "Specialization" },
    { id: "symptom" as Tab, emoji: "🤒", label: "Symptom Checker" },
    { id: "lab" as Tab, emoji: "🧪", label: "Lab Tests" },
    { id: "medicine" as Tab, emoji: "💊", label: "Order Medicines" },
  ];

  return (
    <section className="py-10 bg-white border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex gap-0 border-b border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span>{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* Specialization Tab */}
        {activeTab === "specialization" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {SPECIALIZATIONS.slice(0, 5).map((spec) => (
              <Link key={spec.value} href={`/doctors?specialization=${spec.value}`}>
                <Card className="group cursor-pointer border hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                  <CardContent className="flex flex-col items-center p-4 text-center gap-1">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${spec.accent} mb-1 text-xl`}>
                      {spec.emoji}
                    </div>
                    <p className="font-semibold text-[13px] leading-tight">{spec.label}</p>
                    <p className="text-[11px] text-muted-foreground">{DOCTOR_COUNTS[spec.value] || "500+"} Doctors</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
            <Link href="/doctors">
              <Card className="group cursor-pointer border hover:border-primary/40 hover:shadow-md transition-all duration-200 h-full">
                <CardContent className="flex flex-col items-center p-4 text-center gap-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-1">
                    <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="font-semibold text-[13px]">More</p>
                  <p className="text-[11px] text-muted-foreground">View all Specializations</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        )}

        {/* Symptom Checker Tab */}
        {activeTab === "symptom" && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {SYMPTOMS.map((s) => (
              <Card key={s.label} className="hover:shadow-md hover:border-primary/30 transition-all">
                <CardContent className="p-4">
                  <div className="text-2xl mb-2">{s.emoji}</div>
                  <h3 className="font-semibold text-sm mb-2">{s.label}</h3>
                  <div className="flex flex-wrap gap-1">
                    {s.services.map((sv) => (
                      <Link key={sv.l} href={sv.h}>
                        <span className="text-[10px] bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium hover:bg-primary/20 transition-colors">
                          {sv.l} →
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lab Tests Tab */}
        {activeTab === "lab" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🧪</div>
            <h3 className="text-xl font-bold mb-2">Book Lab Tests from Home</h3>
            <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm">NABL-certified labs, free home sample collection, digital reports in 6–24 hrs at up to 60% off.</p>
            <Link href="/lab-tests">
              <Button className="gap-2 rounded-full px-8">Browse Lab Tests →</Button>
            </Link>
          </div>
        )}

        {/* Medicines Tab */}
        {activeTab === "medicine" && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">💊</div>
            <h3 className="text-xl font-bold mb-2">Order Medicines Online</h3>
            <p className="text-muted-foreground mb-5 max-w-md mx-auto text-sm">Search from 10,000+ genuine medicines by name or salt. Free home delivery above ₹299.</p>
            <Link href="/medicines">
              <Button className="gap-2 rounded-full px-8">Order Medicines →</Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
