/**
 * Pre-built Fuse.js search indexes for static data (medicines, lab tests, diet plans).
 * Indexes are built ONCE at module load time (singleton) — zero latency on subsequent searches.
 * No database or network call needed.
 */

import Fuse from "fuse.js";
import { MEDICINES, type Medicine } from "@/lib/medicines-data";
import { LAB_TESTS, type LabTest } from "@/lib/lab-tests-data";
import { DIET_PLANS, type DietPlan } from "@/lib/diet-plans-data";

// ── Medicine Index ──────────────────────────────────────────────────────────

const medicineIndex = new Fuse<Medicine>(MEDICINES, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "salt", weight: 0.3 },
    { name: "category", weight: 0.1 },
    { name: "manufacturer", weight: 0.1 },
  ],
  threshold: 0.35,         // 0 = exact, 1 = match anything
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,    // search anywhere in the string (prefix + infix)
  findAllMatches: false,
});

export type MedicineResult = Pick<
  Medicine,
  "id" | "name" | "salt" | "price" | "mrp" | "discount" | "category" | "imageEmoji" | "availability"
>;

export function searchMedicines(query: string, limit = 10): MedicineResult[] {
  if (!query.trim()) {
    return MEDICINES.slice(0, limit).map(toMedicineResult);
  }
  return medicineIndex
    .search(query, { limit })
    .map((r) => toMedicineResult(r.item));
}

function toMedicineResult(m: Medicine): MedicineResult {
  return {
    id: m.id,
    name: m.name,
    salt: m.salt,
    price: m.price,
    mrp: m.mrp,
    discount: m.discount,
    category: m.category,
    imageEmoji: m.imageEmoji,
    availability: m.availability,
  };
}

// ── Lab Test Index ──────────────────────────────────────────────────────────

const labTestIndex = new Fuse<LabTest>(LAB_TESTS, {
  keys: [
    { name: "name", weight: 0.5 },
    { name: "category", weight: 0.25 },
    { name: "description", weight: 0.15 },
    { name: "testsIncluded", weight: 0.1 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,
});

export type LabTestResult = Pick<
  LabTest,
  "id" | "name" | "price" | "mrp" | "discount" | "reportTime" | "category" | "emoji" | "homeCollection" | "popular"
>;

export function searchLabTests(query: string, limit = 10): LabTestResult[] {
  if (!query.trim()) {
    return LAB_TESTS.slice(0, limit).map(toLabTestResult);
  }
  return labTestIndex
    .search(query, { limit })
    .map((r) => toLabTestResult(r.item));
}

function toLabTestResult(t: LabTest): LabTestResult {
  return {
    id: t.id,
    name: t.name,
    price: t.price,
    mrp: t.mrp,
    discount: t.discount,
    reportTime: t.reportTime,
    category: t.category,
    emoji: t.emoji,
    homeCollection: t.homeCollection,
    popular: t.popular,
  };
}

// ── Diet Plan Index ─────────────────────────────────────────────────────────

const dietPlanIndex = new Fuse<DietPlan>(DIET_PLANS, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "goal", weight: 0.25 },
    { name: "targetFor", weight: 0.15 },
    { name: "description", weight: 0.1 },
  ],
  threshold: 0.4,
  minMatchCharLength: 2,
  includeScore: true,
  shouldSort: true,
  ignoreLocation: true,
});

export type DietPlanResult = Pick<
  DietPlan,
  "id" | "title" | "goal" | "price" | "mrp" | "discount" | "duration" | "emoji"
>;

export function searchDietPlans(query: string, limit = 6): DietPlanResult[] {
  if (!query.trim()) {
    return DIET_PLANS.slice(0, limit).map(toDietPlanResult);
  }
  return dietPlanIndex
    .search(query, { limit })
    .map((r) => toDietPlanResult(r.item));
}

function toDietPlanResult(p: DietPlan): DietPlanResult {
  return {
    id: p.id,
    title: p.title,
    goal: p.goal,
    price: p.price,
    mrp: p.mrp,
    discount: p.discount,
    duration: p.duration,
    emoji: p.emoji,
  };
}
