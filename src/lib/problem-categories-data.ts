export type Brand = {
  id: string;
  name: string;
  emoji: string;
  description: string;
  medicineCount: number;
};

export type ConditionMedicine = {
  id: string;
  name: string;
  salt: string;
  price: number;
  mrp: number;
  discount: number;
  brandId: string;
  conditionId: string;
  imageEmoji: string;
  availability: "In Stock" | "Out of Stock";
};

export type ProblemCategory = {
  id: string;
  label: string;
  slug: string;
  emoji: string;
  color: string;
  description: string;
};

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  { id: "c1", label: "Diabetes", slug: "diabetes", emoji: "🩸", color: "from-red-50 to-red-100", description: "Comprehensive care for blood sugar management and related symptoms." },
  { id: "c2", label: "Heart Care", slug: "heart-care", emoji: "❤️", color: "from-rose-50 to-rose-100", description: "Specialized medicines for blood pressure, cholesterol, and cardiac health." },
  { id: "c3", label: "Stomach Care", slug: "stomach-care", emoji: "🫃", color: "from-orange-50 to-orange-100", description: "Effective relief from acidity, indigestion, bloating, and gas." },
  { id: "c4", label: "Liver Care", slug: "liver-care", emoji: "🫀", color: "from-yellow-50 to-yellow-100", description: "Supplements and medicines to support liver detoxification and health." },
  { id: "c5", label: "Bone & Joint", slug: "bone-joint", emoji: "🦴", color: "from-blue-50 to-blue-100", description: "Pain relief and strengthening for joints, bones, and cartilage." },
  { id: "c6", label: "Kidney Care", slug: "kidney-care", emoji: "🫘", color: "from-teal-50 to-teal-100", description: "Advanced support for renal health and urinary tract functions." },
  { id: "c7", label: "Derma Care", slug: "derma-care", emoji: "✨", color: "from-pink-50 to-pink-100", description: "Solutions for skin infections, allergies, acne, and pigmentation." },
  { id: "c8", label: "Respiratory", slug: "respiratory", emoji: "🫁", color: "from-cyan-50 to-cyan-100", description: "Relief for asthma, cough, allergies, and lung health." },
  { id: "c9", label: "Eye Care", slug: "eye-care", emoji: "👁️", color: "from-indigo-50 to-indigo-100", description: "Lubricating drops and supplements for vision and eye fatigue." },
];

export const BRANDS: Brand[] = [
  { id: "b1", name: "Sun Pharma", emoji: "🏢", description: "Global leader in generic and specialty medicines.", medicineCount: 450 },
  { id: "b2", name: "Cipla", emoji: "🏥", description: "Dedicated to providing high-quality, affordable healthcare.", medicineCount: 380 },
  { id: "b3", name: "Abbott", emoji: "🔬", description: "Focusing on nutrition, diagnostics, and established pharma.", medicineCount: 320 },
  { id: "b4", name: "Sanofi", emoji: "💊", description: "Innovative solutions for diabetes, vaccines, and rare diseases.", medicineCount: 290 },
  { id: "b5", name: "Dr. Reddy's", emoji: "🧪", description: "Specializing in oncology, cardiology, and gastroenterology.", medicineCount: 310 },
  { id: "b6", name: "Mankind", emoji: "🤝", description: "One of India's leading pharmaceutical companies.", medicineCount: 410 },
  { id: "b7", name: "GSK", emoji: "🛡️", description: "Science-led global healthcare company.", medicineCount: 240 },
  { id: "b8", name: "Torrent", emoji: "⚡", description: "Niche segments like cardio, CNS, and gastro.", medicineCount: 210 },
  { id: "b9", name: "Alkem", emoji: "🧪", description: "Leaders in anti-infectives and pain management.", medicineCount: 270 },
  { id: "b10", name: "Lupin", emoji: "🧬", description: "Innovative drug delivery systems and biosimilars.", medicineCount: 330 },
  { id: "b11", name: "Himalaya", emoji: "🌿", description: "Ayurvedic solutions for personal and health care.", medicineCount: 180 },
  { id: "b12", name: "Baidyanath", emoji: "🏺", description: "Traditional wisdom for modern health challenges.", medicineCount: 150 },
];

export const CONDITION_MEDICINES: ConditionMedicine[] = [
  // Diabetes
  { id: "cm1", name: "Metformin 500", salt: "Metformin", price: 45, mrp: 60, discount: 25, brandId: "b1", conditionId: "c1", imageEmoji: "💊", availability: "In Stock" },
  { id: "cm2", name: "Glycomet GP1", salt: "Glimepiride + Metformin", price: 98, mrp: 130, discount: 25, brandId: "b6", conditionId: "c1", imageEmoji: "🧪", availability: "In Stock" },
  { id: "cm3", name: "Janumet 50/500", salt: "Sitagliptin + Metformin", price: 350, mrp: 420, discount: 16, brandId: "b4", conditionId: "c1", imageEmoji: "💊", availability: "In Stock" },
  { id: "cm4", name: "Galvus Met", salt: "Vildagliptin + Metformin", price: 280, mrp: 350, discount: 20, brandId: "b3", conditionId: "c1", imageEmoji: "🧪", availability: "In Stock" },
  { id: "cm5", name: "Insulin Glargine", salt: "Insulin", price: 650, mrp: 750, discount: 13, brandId: "b4", conditionId: "c1", imageEmoji: "💉", availability: "In Stock" },
  
  // Heart Care
  { id: "cm6", name: "Atorva 10", salt: "Atorvastatin", price: 85, mrp: 110, discount: 22, brandId: "b1", conditionId: "c2", imageEmoji: "❤️", availability: "In Stock" },
  { id: "cm7", name: "Telma 40", salt: "Telmisartan", price: 92, mrp: 120, discount: 23, brandId: "b5", conditionId: "c2", imageEmoji: "💊", availability: "In Stock" },
  { id: "cm8", name: "Rosuvas 10", salt: "Rosuvastatin", price: 120, mrp: 150, discount: 20, brandId: "b1", conditionId: "c2", imageEmoji: "🧪", availability: "In Stock" },
  { id: "cm9", name: "Ecosprin 75", salt: "Aspirin", price: 5, mrp: 8, discount: 37, brandId: "b6", conditionId: "c2", imageEmoji: "💊", availability: "In Stock" },
  
  // Stomach Care
  { id: "cm10", name: "Pan 40", salt: "Pantoprazole", price: 110, mrp: 145, discount: 24, brandId: "b2", conditionId: "c3", imageEmoji: "🟡", availability: "In Stock" },
  { id: "cm11", name: "Omez 20", salt: "Omeprazole", price: 55, mrp: 75, discount: 26, brandId: "b5", conditionId: "c3", imageEmoji: "💊", availability: "In Stock" },
  { id: "cm12", name: "Digene Syrup", salt: "Antacid", price: 145, mrp: 170, discount: 14, brandId: "b3", conditionId: "c3", imageEmoji: "🥤", availability: "In Stock" },
  { id: "cm13", name: "Eno Powder", salt: "Sodium Bicarbonate", price: 10, mrp: 12, discount: 16, brandId: "b7", conditionId: "c3", imageEmoji: "⚡", availability: "In Stock" },

  // Liver Care
  { id: "cm14", name: "Liv 52", salt: "Herbal Formulation", price: 120, mrp: 140, discount: 14, brandId: "b11", conditionId: "c4", imageEmoji: "🌿", availability: "In Stock" },
  { id: "cm15", name: "Udiliv 300", salt: "Ursodeoxycholic Acid", price: 450, mrp: 520, discount: 13, brandId: "b3", conditionId: "c4", imageEmoji: "🧪", availability: "In Stock" },
  
  // Bone & Joint
  { id: "cm16", name: "Calcirol 60K", salt: "Vitamin D3", price: 110, mrp: 140, discount: 21, brandId: "b1", conditionId: "c5", imageEmoji: "☀️", availability: "In Stock" },
  { id: "cm17", name: "Shelcal 500", salt: "Calcium + Vitamin D3", price: 95, mrp: 120, discount: 20, brandId: "b8", conditionId: "c5", imageEmoji: "🦴", availability: "In Stock" },
  { id: "cm18", name: "Moov Gel", salt: "Analgesic", price: 150, mrp: 180, discount: 16, brandId: "b6", conditionId: "c5", imageEmoji: "🧴", availability: "In Stock" },

  // Kidney Care
  { id: "cm19", name: "Cystone", salt: "Herbal Formulation", price: 135, mrp: 160, discount: 15, brandId: "b11", conditionId: "c6", imageEmoji: "🌿", availability: "In Stock" },
  { id: "cm20", name: "Alkasol Syrup", salt: "Disodium Hydrogen Citrate", price: 125, mrp: 150, discount: 16, brandId: "b12", conditionId: "c6", imageEmoji: "🥤", availability: "In Stock" },

  // Derma Care
  { id: "cm21", name: "Betnovate N", salt: "Betamethasone + Neomycin", price: 45, mrp: 55, discount: 18, brandId: "b7", conditionId: "c7", imageEmoji: "🧴", availability: "In Stock" },
  { id: "cm22", name: "Clingard Gel", salt: "Clindamycin + Adapalene", price: 195, mrp: 240, discount: 18, brandId: "b2", conditionId: "c7", imageEmoji: "✨", availability: "In Stock" },

  // Respiratory
  { id: "cm23", name: "Asthalin Inhaler", salt: "Salbutamol", price: 165, mrp: 190, discount: 13, brandId: "b2", conditionId: "c8", imageEmoji: "🌬️", availability: "In Stock" },
  { id: "cm24", name: "Ascoril LS", salt: "Ambroxol + Levosalbutamol", price: 115, mrp: 140, discount: 17, brandId: "b7", conditionId: "c8", imageEmoji: "🥤", availability: "In Stock" },

  // Eye Care
  { id: "cm25", name: "Refresh Tears", salt: "Carboxymethylcellulose", price: 180, mrp: 220, discount: 18, brandId: "b4", conditionId: "c9", imageEmoji: "👁️", availability: "In Stock" },
  { id: "cm26", name: "Latanoprost", salt: "Latanoprost", price: 450, mrp: 550, discount: 18, brandId: "b1", conditionId: "c9", imageEmoji: "💧", availability: "In Stock" },
];

// Pre-computed cache
const conditionCache = new Map<string, { medicines: ConditionMedicine[], brands: Brand[] }>();

export function getConditionData(slug: string) {
  if (conditionCache.has(slug)) return conditionCache.get(slug)!;

  const category = PROBLEM_CATEGORIES.find(c => c.slug === slug);
  if (!category) return null;

  const medicines = CONDITION_MEDICINES.filter(m => m.conditionId === category.id);
  const brandIds = Array.from(new Set(medicines.map(m => m.brandId)));
  const brands = BRANDS.filter(b => brandIds.includes(b.id));

  const result = { medicines, brands };
  conditionCache.set(slug, result);
  return result;
}

export function getMedicinesByBrand(brandId: string, conditionId: string) {
  return CONDITION_MEDICINES.filter(m => m.brandId === brandId && m.conditionId === conditionId);
}

export function getBrandsBySalt(salt: string, conditionId: string) {
  const medicinesWithSalt = CONDITION_MEDICINES.filter(m => m.salt === salt && m.conditionId === conditionId);
  const brandIds = Array.from(new Set(medicinesWithSalt.map(m => m.brandId)));
  return BRANDS.filter(b => brandIds.includes(b.id)).map(b => {
    const specificMedicine = medicinesWithSalt.find(m => m.brandId === b.id);
    return {
      ...b,
      price: specificMedicine?.price || 0,
      mrp: specificMedicine?.mrp || 0,
      discount: specificMedicine?.discount || 0,
    };
  });
}
