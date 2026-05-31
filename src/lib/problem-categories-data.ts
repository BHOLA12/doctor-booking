import { MEDICINES } from "./medicines-data";

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
  image?: string;
  availability: "In Stock" | "Out of Stock";
};

export type ProblemCategory = {
  id: string;
  label: string;
  slug: string;
  emoji: string;
  color: string;
  description: string;
  image?: string;
};

export const PROBLEM_CATEGORIES: ProblemCategory[] = [
  { id: "c1", label: "Diabetes", slug: "diabetes", emoji: "🩸", color: "from-red-50 to-red-100", description: "Comprehensive care for blood sugar management and related symptoms.", image: "/images/tests/diabetes-panel.png" },
  { id: "c2", label: "Heart Care", slug: "heart-care", emoji: "❤️", color: "from-rose-50 to-rose-100", description: "Specialized medicines for blood pressure, cholesterol, and cardiac health.", image: "/images/tests/cardiac-test.png" },
  { id: "c3", label: "Stomach Care", slug: "stomach-care", emoji: "🫃", color: "from-orange-50 to-orange-100", description: "Effective relief from acidity, indigestion, bloating, and gas.", image: "/images/categories/stomach-care.png" },
  { id: "c4", label: "Liver Care", slug: "liver-care", emoji: "🫀", color: "from-yellow-50 to-yellow-100", description: "Supplements and medicines to support liver detoxification and health.", image: "/images/tests/liver-test.png" },
  { id: "c5", label: "Bone & Joint", slug: "bone-joint", emoji: "🦴", color: "from-blue-50 to-blue-100", description: "Pain relief and strengthening for joints, bones, and cartilage.", image: "/images/categories/bone-joint.png" },
  { id: "c6", label: "Kidney Care", slug: "kidney-care", emoji: "🫘", color: "from-teal-50 to-teal-100", description: "Advanced support for renal health and urinary tract functions.", image: "/images/tests/kidney-test.png" },
  { id: "c7", label: "Derma Care", slug: "derma-care", emoji: "✨", color: "from-pink-50 to-pink-100", description: "Solutions for skin infections, allergies, acne, and pigmentation.", image: "/images/categories/derma-care.png" },
  { id: "c8", label: "Respiratory", slug: "respiratory", emoji: "🫁", color: "from-cyan-50 to-cyan-100", description: "Relief for asthma, cough, allergies, and lung health.", image: "/images/categories/lungs.png" },
  { id: "c9", label: "Eye Care", slug: "eye-care", emoji: "👁️", color: "from-indigo-50 to-indigo-100", description: "Lubricating drops and supplements for vision and eye fatigue.", image: "/images/categories/eye-care.png" },
  { id: "c10", label: "Thyroid Care", slug: "thyroid-care", emoji: "🦋", color: "from-purple-50 to-purple-100", description: "Thyroxine and metabolism regulators for thyroid hormone balance.", image: "/images/tests/thyroid-test.png" },
  { id: "c11", label: "Cancer Support", slug: "cancer-care", emoji: "🎗️", color: "from-slate-50 to-slate-100", description: "Supportive oncology medicines, chemotherapy aids, and specialty vitamins.", image: "/images/categories/cancer-care.png" },
  { id: "c12", label: "Neuro & Brain", slug: "neuro-brain", emoji: "🧠", color: "from-violet-50 to-violet-100", description: "Solutions for migraine, epilepsy, nerve pain, and cognitive health.", image: "/images/categories/neuro-brain.png" },
  { id: "c13", label: "Cold & Fever", slug: "cold-fever", emoji: "🤒", color: "from-amber-50 to-amber-100", description: "Antipyretics, cough syrups, and anti-infectives for seasonal illnesses.", image: "/images/categories/cold-fever.png" },
  { id: "c14", label: "Women Health", slug: "womens-health", emoji: "🤰", color: "from-fuchsia-50 to-fuchsia-100", description: "PCOS management, pregnancy supplements, iron/calcium, and hormone care.", image: "/images/categories/womens-health.png" },
  { id: "c15", label: "Child Care", slug: "child-care", emoji: "👶", color: "from-yellow-50 to-yellow-100", description: "Drops, syrups, and kid-friendly nutrition and wellness formulations.", image: "/images/categories/child-care.png" },
  { id: "c16", label: "Ayurveda & Herbal", slug: "ayurveda", emoji: "🌿", color: "from-emerald-50 to-emerald-100", description: "Traditional Indian wellness, rasayanas, herbal tonics, and natural health care.", image: "/images/categories/ayurveda.png" },
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
  { id: "cm1", name: "Metformin 500", salt: "Metformin", price: 45, mrp: 60, discount: 25, brandId: "b1", conditionId: "c1", imageEmoji: "💊", image: "/images/medicines/metformin.png", availability: "In Stock" },
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

  // Thyroid Care
  { id: "cm27", name: "Thyronorm 100mcg", salt: "Thyroxine Sodium", price: 160, mrp: 185, discount: 13, brandId: "b3", conditionId: "c10", imageEmoji: "🦋", availability: "In Stock" },
  { id: "cm28", name: "Eltroxin 50mcg", salt: "Thyroxine Sodium", price: 120, mrp: 140, discount: 14, brandId: "b7", conditionId: "c10", imageEmoji: "💊", availability: "In Stock" },

  // Neuro & Brain
  { id: "cm29", name: "Gabapin NT", salt: "Gabapentin + Nortriptyline", price: 290, mrp: 350, discount: 17, brandId: "b10", conditionId: "c12", imageEmoji: "🧠", availability: "In Stock" },
  { id: "cm30", name: "Vasograin", salt: "Ergotamine + Caffeine + Paracetamol", price: 115, mrp: 135, discount: 14, brandId: "b6", conditionId: "c12", imageEmoji: "💊", availability: "In Stock" },

  // Cold & Fever
  { id: "cm31", name: "Calpol 650", salt: "Paracetamol", price: 32, mrp: 40, discount: 20, brandId: "b7", conditionId: "c13", imageEmoji: "🤒", availability: "In Stock" },
  { id: "cm32", name: "Allegra 120", salt: "Fexofenadine", price: 98, mrp: 130, discount: 25, brandId: "b4", conditionId: "c13", imageEmoji: "🌸", availability: "In Stock" },

  // Women Health
  { id: "cm33", name: "Orofer XT", salt: "Ferrous Ascorbate + Folic Acid", price: 185, mrp: 220, discount: 15, brandId: "b1", conditionId: "c14", imageEmoji: "🤰", availability: "In Stock" },
  { id: "cm34", name: "Folvite 5mg", salt: "Folic Acid", price: 35, mrp: 45, discount: 22, brandId: "b9", conditionId: "c14", imageEmoji: "💊", availability: "In Stock" },

  // Child Care
  { id: "cm35", name: "Crocin Drops", salt: "Paracetamol Paediatric Drops", price: 42, mrp: 50, discount: 16, brandId: "b7", conditionId: "c15", imageEmoji: "👶", availability: "In Stock" },

  // Ayurveda & Herbal
  { id: "cm36", name: "Ashwagandha Capsules", salt: "Withania Somnifera Extract", price: 160, mrp: 195, discount: 17, brandId: "b11", conditionId: "c16", imageEmoji: "🌿", availability: "In Stock" },
  { id: "cm37", name: "Chyawanprash Special", salt: "Amla and Herbal Paste", price: 245, mrp: 290, discount: 15, brandId: "b12", conditionId: "c16", imageEmoji: "🏺", availability: "In Stock" },
];

export function mapSlugToMedicineCategory(slug: string): string {
  if (slug === "diabetes") return "Diabetes";
  if (slug === "heart-care") return "Heart & BP";
  if (slug === "stomach-care") return "Digestive Health";
  if (slug === "derma-care") return "Skin Care";
  if (slug === "bone-joint" || slug === "liver-care" || slug === "kidney-care") return "Vitamins & Supplements";
  if (slug === "neuro-brain") return "Neuro & Brain";
  if (slug === "thyroid-care") return "Thyroid Care";
  if (slug === "womens-health") return "Women Health";
  if (slug === "child-care") return "Child Care";
  if (slug === "ayurveda") return "Ayurveda & Herbal";
  if (slug === "cold-fever") return "Cold & Fever";
  return "";
}

export function getConditionData(slug: string) {
  const category = PROBLEM_CATEGORIES.find(c => c.slug === slug);
  if (!category) return null;

  const medCategory = mapSlugToMedicineCategory(slug);
  const matchedMedicines = MEDICINES.filter(m => m.category === medCategory);

  // Group manufacturers to make brands dynamically
  const manufacturers = Array.from(new Set(matchedMedicines.map(m => m.manufacturer)));
  const brands = manufacturers.map((name, index) => ({
    id: `brand-${name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    name,
    emoji: "🏢",
    description: `Trusted manufacturer of medicines in this category.`,
    medicineCount: matchedMedicines.filter(m => m.manufacturer === name).length,
  }));

  // Map matchedMedicines to ConditionMedicine format
  const medicines = matchedMedicines.map(m => ({
    id: m.id,
    name: m.name,
    salt: m.salt,
    price: m.price,
    mrp: m.mrp,
    discount: m.discount,
    brandId: `brand-${m.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
    conditionId: category.id,
    imageEmoji: m.imageEmoji,
    image: m.image,
    availability: m.availability as "In Stock" | "Out of Stock",
  }));

  return { medicines, brands };
}

export function getMedicinesByBrand(brandId: string, conditionId: string) {
  const category = PROBLEM_CATEGORIES.find(c => c.id === conditionId);
  if (!category) return [];

  const medCategory = mapSlugToMedicineCategory(category.slug);
  return MEDICINES.filter(m => 
    m.category === medCategory && 
    `brand-${m.manufacturer.toLowerCase().replace(/[^a-z0-9]/g, "-")}` === brandId
  ).map(m => ({
    id: m.id,
    name: m.name,
    salt: m.salt,
    price: m.price,
    mrp: m.mrp,
    discount: m.discount,
    brandId,
    conditionId,
    imageEmoji: m.imageEmoji,
    image: m.image,
    availability: m.availability as "In Stock" | "Out of Stock",
  }));
}

export function getBrandsBySalt(saltName: string, conditionId?: string) {
  // Normalize the salt search key (take first word, e.g. "Paracetamol" or "Metformin")
  const searchSalt = saltName.toLowerCase().split(/[ +]/)[0];
  if (!searchSalt) return [];

  // Filter medicines by salt
  const matched = MEDICINES.filter(m => 
    m.salt.toLowerCase().includes(searchSalt)
  );

  return matched.map(m => {
    return {
      id: m.id,
      name: m.manufacturer,
      emoji: m.imageEmoji || "💊",
      description: m.name, // Use actual medicine name as description
      medicineCount: 1,
      price: m.price,
      mrp: m.mrp,
      discount: m.discount,
    };
  });
}
