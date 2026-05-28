"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import DietPlanCard from "@/components/shared/DietPlanCard";
import { DIET_PLANS, type DietPlan } from "@/lib/diet-plans-data";
import {
  Salad,
  CheckCircle2,
  Star,
  ChevronRight,
  Stethoscope,
  Calendar,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function NutritionPage() {
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);
  const [selectedDetailsPlan, setSelectedDetailsPlan] = useState<DietPlan | null>(null);


  const handleSelect = (plan: DietPlan) => {
    setSelectedPlan(plan);
    toast.success(`${plan.title} selected! 🥗`, {
      description: "A nutritionist will contact you within 24 hours to start your plan.",
    });
  };

  const howItWorks = [
    {
      step: "01",
      icon: Stethoscope,
      title: "Choose Your Plan",
      desc: "Browse and select a diet plan that matches your health goal.",
    },
    {
      step: "02",
      icon: Calendar,
      title: "Initial Consultation",
      desc: "Get a 30-min video call with a certified nutritionist to personalise your plan.",
    },
    {
      step: "03",
      icon: MessageSquare,
      title: "Follow & Track",
      desc: "Receive personalised meal plans, recipes, and ongoing chat support.",
    },
    {
      step: "04",
      icon: CheckCircle2,
      title: "Achieve Your Goal",
      desc: "Regular check-ins and plan adjustments to keep you on track.",
    },
  ];

  const nutritionistTestimonials = [
    {
      name: "Priya Sharma",
      goal: "Weight Loss",
      rating: 5,
      text: "Lost 8 kg in 6 weeks! The meal plans were practical and the nutritionist was incredibly supportive.",
    },
    {
      name: "Rahul Gupta",
      goal: "Diabetes Management",
      rating: 5,
      text: "My HbA1c dropped from 8.2 to 6.5 in 3 months. Life-changing guidance!",
    },
    {
      name: "Anita Patel",
      goal: "PCOS Management",
      rating: 5,
      text: "Finally found a plan that worked for my PCOS. Periods are regular, energy is amazing!",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.12)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-5 px-4 py-1.5 text-sm font-medium rounded-full">
              <Salad className="h-3.5 w-3.5 mr-1.5" />
              Nutrition &amp; Diet Plans
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Eat Smart,{" "}
              <span className="gradient-text">Live Healthy</span>
              <br />
              with Expert Dietitians
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Personalised diet plans crafted by certified nutritionists. Whether it&apos;s weight loss, diabetes, muscle gain, or PCOS — we have a plan for you.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link href="/doctors?specialization=nutritionist">
                <Button size="lg" className="gap-2 h-12 rounded-xl px-8">
                  Consult a Nutritionist <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#plans">
                <Button size="lg" variant="outline" className="gap-2 h-12 rounded-xl px-8">
                  Browse Diet Plans <ChevronRight className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap gap-x-10 gap-y-2 justify-center">
            {[
              { value: "50,000+", label: "Successful Plans" },
              { value: "200+", label: "Certified Nutritionists" },
              { value: "4.8★", label: "Average Rating" },
              { value: "95%", label: "Goal Achievement Rate" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-lg font-bold text-primary">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-14 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
            <p className="mt-2 text-muted-foreground">Your journey to better health in 4 simple steps</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center p-5 rounded-2xl bg-card border hover:shadow-md transition-shadow">
                <div className="text-xs font-bold text-primary/40 mb-2">{step}</div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diet Plans */}
      <section id="plans" className="py-14 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Choose Your Diet Plan</h2>
            <p className="mt-2 text-muted-foreground">Personalised, expert-designed, result-driven plans</p>
          </div>
          <Link href="/doctors?specialization=nutritionist" className="hidden sm:block">
            <Button variant="outline" className="gap-2">
              Find Nutritionist <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {DIET_PLANS.map((plan) => (
            <DietPlanCard 
              key={plan.id} 
              plan={plan} 
              onSelect={handleSelect} 
              onViewDetails={(plan) => setSelectedDetailsPlan(plan)}
            />
          ))}
        </div>
      </section>

      {/* Find a Nutritionist CTA */}
      <section className="py-12 bg-gradient-to-br from-green-50 to-emerald-50 border-y">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">🥗 Speak to a Nutritionist Today</h2>
              <p className="text-muted-foreground text-sm max-w-lg">
                Book a 1-on-1 video consultation with a certified nutritionist or dietitian. Get a personalised plan designed for your body, lifestyle, and health goals.
              </p>
            </div>
            <Link href="/doctors?specialization=nutritionist">
              <Button size="lg" className="gap-2 rounded-full px-8 shrink-0">
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">Real Results, Real Stories</h2>
          <p className="mt-2 text-muted-foreground">What our clients say about their journey</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nutritionistTestimonials.map(({ name, goal, rating, text }) => (
            <Card key={name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&quot;{text}&quot;</p>
                <div>
                  <p className="font-semibold text-sm">{name}</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">{goal}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {selectedDetailsPlan && (
        <Dialog 
          open={!!selectedDetailsPlan} 
          onOpenChange={(open) => {
            if (!open) setSelectedDetailsPlan(null);
          }}
        >
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-muted bg-card/95 backdrop-blur-md shadow-2xl flex flex-col gap-0">
            {/* Cover Image */}
            <div className="relative w-full h-56 sm:h-64 md:h-72 overflow-hidden bg-muted">
              {selectedDetailsPlan.image ? (
                <>
                  <Image
                    src={selectedDetailsPlan.image}
                    alt={selectedDetailsPlan.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                </>
              ) : (
                <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${selectedDetailsPlan.accent}`}>
                  <span className="text-6xl mb-4">{selectedDetailsPlan.emoji}</span>
                </div>
              )}

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex gap-2">
                {selectedDetailsPlan.popular && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full border-0 shadow-md">
                    Best Seller
                  </Badge>
                )}
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-full border-0 shadow-md">
                  {selectedDetailsPlan.duration} Program
                </Badge>
              </div>

              {/* Goal Title at the bottom of the image overlay */}
              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100/90 dark:bg-emerald-950/90 dark:text-emerald-400 px-3 py-1 rounded-full">
                  {selectedDetailsPlan.goal}
                </span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6 sm:p-8 space-y-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {selectedDetailsPlan.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-sm leading-relaxed pt-1">
                  {selectedDetailsPlan.description}
                </DialogDescription>
              </DialogHeader>

              {/* Features - Complete List */}
              <div className="space-y-3.5">
                <h4 className="text-sm font-bold tracking-wide text-foreground/90 uppercase">
                  What&apos;s Included in the Plan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedDetailsPlan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground font-medium leading-normal">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Conditions */}
              <div className="space-y-3 pt-2 border-t border-muted/50">
                <h4 className="text-xs font-bold tracking-wide text-foreground/80 uppercase">
                  Perfect For
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedDetailsPlan.targetFor.map((target) => (
                    <span
                      key={target}
                      className="text-xs bg-secondary/80 hover:bg-secondary text-secondary-foreground font-semibold px-3 py-1 rounded-full border border-muted"
                    >
                      {target}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and CTA Section */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-5 border-t border-muted/50">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground font-medium">Special Offer Pricing</span>
                  <div className="flex items-baseline gap-2.5 mt-1">
                    <span className="text-3xl font-black text-foreground">
                      ₹{selectedDetailsPlan.price}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      ₹{selectedDetailsPlan.mrp}
                    </span>
                    <Badge className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-extrabold border-0">
                      {selectedDetailsPlan.discount}% OFF
                    </Badge>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="sm:w-auto w-full font-bold h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl shadow-[0_4px_14px_rgba(16,185,129,0.2)] hover:shadow-[0_8px_24px_rgba(16,185,129,0.3)] transition-all duration-300 gap-2 flex items-center justify-center border-0"
                  onClick={() => {
                    handleSelect(selectedDetailsPlan);
                    setSelectedDetailsPlan(null);
                  }}
                >
                  <span>Get This Plan</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
