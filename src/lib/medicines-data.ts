export type Medicine = {
  id: string;
  name: string;
  salt: string;
  category: string;
  price: number;
  mrp: number;
  discount: number;
  manufacturer: string;
  availability: "In Stock" | "Limited Stock" | "Out of Stock";
  requiresPrescription: boolean;
  dosage: string;
  imageEmoji: string;
  image?: string;
  isAiGenerated?: boolean;
  aiDisclaimer?: string;
};

export const MEDICINE_CATEGORIES = [
  "All",
  "Pain Relief",
  "Vitamins & Supplements",
  "Antibiotics",
  "Diabetes",
  "Heart & BP",
  "Digestive Health",
  "Cold & Fever",
  "Skin Care",
];

export const MEDICINES: Medicine[] = [
  {
    id: "m1",
    name: "Crocin 500mg",
    salt: "Paracetamol",
    category: "Pain Relief",
    price: 28,
    mrp: 35,
    discount: 20,
    manufacturer: "GSK",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "500mg, 15 Tablets",
    imageEmoji: "💊",
    image: "/images/medicines/crocin.png",
  },
  {
    id: "m2",
    name: "Dolo 650",
    salt: "Paracetamol",
    category: "Cold & Fever",
    price: 30,
    mrp: 38,
    discount: 21,
    manufacturer: "Micro Labs",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "650mg, 15 Tablets",
    imageEmoji: "💊",
    image: "/images/medicines/dolo.png",
  },
  {
    id: "m3",
    name: "Azithral 500",
    salt: "Azithromycin",
    category: "Antibiotics",
    price: 72,
    mrp: 95,
    discount: 24,
    manufacturer: "Alembic",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "500mg, 5 Tablets",
    imageEmoji: "🔬",
    image: "/images/medicines/azithral.png",
  },
  {
    id: "m4",
    name: "Metformin 500",
    salt: "Metformin HCl",
    category: "Diabetes",
    price: 45,
    mrp: 60,
    discount: 25,
    manufacturer: "Sun Pharma",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "500mg, 10 Tablets",
    imageEmoji: "🩺",
    image: "/images/medicines/metformin.png",
  },
  {
    id: "m5",
    name: "Vitamin D3 60K",
    salt: "Cholecalciferol",
    category: "Vitamins & Supplements",
    price: 120,
    mrp: 160,
    discount: 25,
    manufacturer: "Abbott",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "60,000 IU, 4 Capsules",
    imageEmoji: "☀️",
    image: "/images/medicines/vitamin_d3.png",
  },
  {
    id: "m6",
    name: "Omega 3 Fish Oil",
    salt: "Omega-3 Fatty Acids",
    category: "Vitamins & Supplements",
    price: 249,
    mrp: 320,
    discount: 22,
    manufacturer: "HealthKart",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "1000mg, 60 Softgels",
    imageEmoji: "🐟",
    image: "/images/medicines/omega_3.png",
  },
  {
    id: "m7",
    name: "Telmisartan 40",
    salt: "Telmisartan",
    category: "Heart & BP",
    price: 88,
    mrp: 115,
    discount: 23,
    manufacturer: "Cipla",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "40mg, 10 Tablets",
    imageEmoji: "❤️",
    image: "/images/medicines/telmisartan.png",
  },
  {
    id: "m8",
    name: "Pantop 40",
    salt: "Pantoprazole",
    category: "Digestive Health",
    price: 65,
    mrp: 85,
    discount: 24,
    manufacturer: "Aristo",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "40mg, 15 Tablets",
    imageEmoji: "🟡",
    image: "/images/medicines/pantop.png",
  },
  {
    id: "m9",
    name: "Allegra 120",
    salt: "Fexofenadine",
    category: "Cold & Fever",
    price: 98,
    mrp: 130,
    discount: 25,
    manufacturer: "Sanofi",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "120mg, 10 Tablets",
    imageEmoji: "🌸",
    image: "/images/medicines/allegra.png",
  },
  {
    id: "m10",
    name: "Betadine Ointment",
    salt: "Povidone Iodine",
    category: "Skin Care",
    price: 78,
    mrp: 99,
    discount: 21,
    manufacturer: "Win-Medicare",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "20g Ointment",
    imageEmoji: "🧴",
    image: "/images/medicines/betadine.png",
  },
  {
    id: "m11",
    name: "Combiflam",
    salt: "Ibuprofen + Paracetamol",
    category: "Pain Relief",
    price: 40,
    mrp: 52,
    discount: 23,
    manufacturer: "Sanofi",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "400mg+325mg, 20 Tablets",
    imageEmoji: "💊",
    image: "/images/medicines/combiflam.png",
  },
  {
    id: "m12",
    name: "Glucon-D",
    salt: "Dextrose Monohydrate",
    category: "Vitamins & Supplements",
    price: 85,
    mrp: 99,
    discount: 14,
    manufacturer: "Heinz",
    availability: "Limited Stock",
    requiresPrescription: false,
    dosage: "500g Powder",
    imageEmoji: "🍊",
    image: "/images/medicines/glucon_d.png",
  },
  {
    id: "m13",
    name: "Augmentin 625",
    salt: "Amoxicillin + Clavulanate",
    category: "Antibiotics",
    price: 195,
    mrp: 248,
    discount: 21,
    manufacturer: "GSK",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "625mg, 10 Tablets",
    imageEmoji: "🔬",
    image: "/images/medicines/augmentin.png",
  },
  {
    id: "m14",
    name: "Glycomet GP1",
    salt: "Glimepiride + Metformin",
    category: "Diabetes",
    price: 98,
    mrp: 130,
    discount: 25,
    manufacturer: "USV",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "1mg+500mg, 15 Tablets",
    imageEmoji: "🩺",
    image: "/images/medicines/glycomet.png",
  },
  {
    id: "m15",
    name: "Atorvastatin 10",
    salt: "Atorvastatin",
    category: "Heart & BP",
    price: 55,
    mrp: 72,
    discount: 24,
    manufacturer: "Cipla",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "10mg, 10 Tablets",
    imageEmoji: "❤️",
    image: "/images/medicines/atorvastatin.png",
  },
  {
    id: "m16",
    name: "Mucaine Gel",
    salt: "Oxethazaine + Antacid",
    category: "Digestive Health",
    price: 68,
    mrp: 88,
    discount: 23,
    manufacturer: "Pfizer",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "170ml Suspension",
    imageEmoji: "🟢",
    image: "/images/medicines/mucaine.png",
  },
  {
    id: "m17",
    name: "Moov Cream",
    salt: "Nimesulide (topical)",
    category: "Pain Relief",
    price: 125,
    mrp: 150,
    discount: 17,
    manufacturer: "Reckitt",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "50g Cream",
    imageEmoji: "🧴",
    image: "/images/medicines/moov.png",
  },
  {
    id: "m18",
    name: "Cetrizine 10mg",
    salt: "Cetirizine HCl",
    category: "Cold & Fever",
    price: 18,
    mrp: 24,
    discount: 25,
    manufacturer: "Cipla",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "10mg, 10 Tablets",
    imageEmoji: "🌿",
    image: "/images/medicines/cetirizine.png",
  },
  {
    id: "m19",
    name: "B-Complex with C",
    salt: "Vitamins B1, B2, B6, B12, C",
    category: "Vitamins & Supplements",
    price: 89,
    mrp: 115,
    discount: 23,
    manufacturer: "Pfizer",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "30 Tablets",
    imageEmoji: "🌟",
    image: "/images/medicines/b_complex.png",
  },
  {
    id: "m20",
    name: "Calamine Lotion",
    salt: "Calamine + Zinc Oxide",
    category: "Skin Care",
    price: 55,
    mrp: 72,
    discount: 24,
    manufacturer: "Lacto Calamine",
    availability: "Limited Stock",
    requiresPrescription: false,
    dosage: "120ml Lotion",
    imageEmoji: "🌸",
    image: "/images/medicines/calamine.png",
  },
  {
    id: "m21",
    name: "Thyronorm 100mcg",
    salt: "Thyroxine Sodium",
    category: "Thyroid Care",
    price: 160,
    mrp: 185,
    discount: 13,
    manufacturer: "Abbott",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "100mcg, 120 Tablets",
    imageEmoji: "🦋",
    image: "/images/medicines/thyronorm.png",
  },
  {
    id: "m22",
    name: "Eltroxin 50mcg",
    salt: "Thyroxine Sodium",
    category: "Thyroid Care",
    price: 120,
    mrp: 140,
    discount: 14,
    manufacturer: "GSK",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "50mcg, 100 Tablets",
    imageEmoji: "💊",
    image: "/images/medicines/eltroxin.png",
  },
  {
    id: "m23",
    name: "Gabapin NT",
    salt: "Gabapentin + Nortriptyline",
    category: "Neuro & Brain",
    price: 290,
    mrp: 350,
    discount: 17,
    manufacturer: "Lupin",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "10 Tablets",
    imageEmoji: "🧠",
    image: "/images/medicines/gabapin.png",
  },
  {
    id: "m24",
    name: "Vasograin",
    salt: "Ergotamine + Caffeine + Paracetamol",
    category: "Neuro & Brain",
    price: 115,
    mrp: 135,
    discount: 14,
    manufacturer: "Mankind",
    availability: "In Stock",
    requiresPrescription: true,
    dosage: "14 Tablets",
    imageEmoji: "💊",
    image: "/images/medicines/vasograin.png",
  },
  {
    id: "m25",
    name: "Orofer XT",
    salt: "Ferrous Ascorbate + Folic Acid",
    category: "Women Health",
    price: 185,
    mrp: 220,
    discount: 15,
    manufacturer: "Sun Pharma",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "10 Tablets",
    imageEmoji: "🤰",
    image: "/images/medicines/orofer_xt.png",
  },
  {
    id: "m26",
    name: "Folvite 5mg",
    salt: "Folic Acid",
    category: "Women Health",
    price: 35,
    mrp: 45,
    discount: 22,
    manufacturer: "Alkem",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "30 Tablets",
    imageEmoji: "💊",
    image: "/images/medicines/folvite.png",
  },
  {
    id: "m27",
    name: "Crocin Drops",
    salt: "Paracetamol Paediatric Drops",
    category: "Child Care",
    price: 42,
    mrp: 50,
    discount: 16,
    manufacturer: "GSK",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "15ml Drops",
    imageEmoji: "👶",
    image: "/images/medicines/crocin_drops.png",
  },
  {
    id: "m28",
    name: "Ashwagandha Capsules",
    salt: "Withania Somnifera Extract",
    category: "Ayurveda & Herbal",
    price: 160,
    mrp: 195,
    discount: 17,
    manufacturer: "Himalaya",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "60 Capsules",
    imageEmoji: "🌿",
    image: "/images/medicines/ashwagandha.png",
  },
  {
    id: "m29",
    name: "Chyawanprash Special",
    salt: "Amla and Herbal Paste",
    category: "Ayurveda & Herbal",
    price: 245,
    mrp: 290,
    discount: 15,
    manufacturer: "Baidyanath",
    availability: "In Stock",
    requiresPrescription: false,
    dosage: "500g Paste",
    imageEmoji: "🏺",
    image: "/images/medicines/chyawanprash.png",
  }
];

export type EnrichedMedicine = Medicine & {
  medicalUses: string[];
  sideEffects: string[];
  substitutes: string[];
  safetyWarnings: {
    alcohol: string;
    pregnancy: string;
    driving: string;
    kidneyLiver: string;
  };
};

export function enrichMedicineDetails(m: Medicine): EnrichedMedicine {
  const salt = m.salt.toLowerCase();
  
  let medicalUses = ["General health management", "Symptomatic treatment of related conditions", "To be used under proper medical advice"];
  let sideEffects = ["Mild stomach discomfort (rare)", "Headache (rare)", "Dizziness (rare)"];
  let substitutes = [`Generic ${m.name}`, `${m.salt} Alternative`, "Consult your pharmacist for other local equivalent brands"];
  let safetyWarnings = {
    alcohol: "Caution. Limit alcohol intake while on medication to reduce potential interaction risks.",
    pregnancy: "Caution. Consult your doctor or gynaecologist before use if you are pregnant or plan to conceive.",
    driving: "Safe. Does not affect alertness or trigger drowsiness in normal clinical doses.",
    kidneyLiver: "Caution. Adjustments may be required. Consult your doctor if you have kidney or liver issues."
  };

  if (salt.includes("paracetamol")) {
    medicalUses = ["Fever reduction (Antipyretic)", "Mild to moderate pain relief", "Headache & body ache", "Toothache", "Muscle pain"];
    sideEffects = ["Nausea", "Allergic skin rash (rare)", "Liver dysfunction (only in high overdose)", "Stomach pain"];
    substitutes = ["Dolo 650", "Calpol 650", "Pacimol 650", "Pyrigesic 500", "Crocin 500mg"];
    safetyWarnings = {
      alcohol: "Unsafe. Consumption of alcohol while taking Paracetamol can lead to severe liver damage.",
      pregnancy: "Safe if prescribed. Generally considered safe during pregnancy under medical advice.",
      driving: "Safe. Does not affect driving ability or cause drowsiness.",
      kidneyLiver: "Caution. Consult doctor if you have active liver or kidney disease. Dose adjustments may be required."
    };
  } else if (salt.includes("azithromycin")) {
    medicalUses = ["Bacterial infections", "Tonsillitis & pharyngitis", "Sinusitis", "Bronchitis & pneumonia", "Ear infections"];
    sideEffects = ["Diarrhoea", "Nausea", "Abdominal pain", "Vomiting", "Flatulence"];
    substitutes = ["Azee 500", "Azibact 500", "Zithrox 500", "Azilup 500"];
    safetyWarnings = {
      alcohol: "Safe. No known adverse interactions with alcohol, but moderation is advised.",
      pregnancy: "Safe if prescribed. Generally safe, but use only when clearly needed under supervision.",
      driving: "Safe. Does not cause drowsiness or impair motor skills.",
      kidneyLiver: "Caution. Consult a doctor before use if you have severe kidney or liver impairment."
    };
  } else if (salt.includes("metformin")) {
    medicalUses = ["Type 2 Diabetes Mellitus", "Insulin resistance management", "PCOS (off-label)"];
    sideEffects = ["Nausea", "Diarrhoea", "Abdominal bloating", "Metallic taste", "Loss of appetite"];
    substitutes = ["Glycomet 500", "Obimet 500", "Metformin 500", "Gluconorm 500"];
    safetyWarnings = {
      alcohol: "Unsafe. Risk of lactic acidosis is increased with alcohol consumption.",
      pregnancy: "Safe if prescribed. Consult your doctor; insulin is preferred but Metformin is used under guidance.",
      driving: "Safe. Does not affect alertness unless combined with other diabetic medicines causing low sugar.",
      kidneyLiver: "Unsafe. Contraindicated in severe kidney failure or severe liver disease."
    };
  } else if (salt.includes("cholecalciferol") || salt.includes("vitamin d")) {
    medicalUses = ["Vitamin D deficiency", "Osteoporosis support", "Calcium absorption helper", "Bone and joint pain"];
    sideEffects = ["Nausea (rare)", "Constipation (rare)", "Hypercalcaemia (only in extreme overdose)"];
    substitutes = ["Uprise-D3 60K", "Calcirol 60K", "Depura 60K", "D3-Must 60K"];
    safetyWarnings = {
      alcohol: "Safe. No known interaction with alcohol.",
      pregnancy: "Safe if prescribed. Beneficial during pregnancy to support fetal bone development.",
      driving: "Safe. No effect on alertness or coordination.",
      kidneyLiver: "Caution. Consult a doctor if you have kidney stones or severe kidney diseases."
    };
  } else if (salt.includes("telmisartan") || salt.includes("atorvastatin")) {
    medicalUses = ["Hypertension (High Blood Pressure)", "Cardiovascular risk reduction", "Prevention of heart attack/stroke"];
    sideEffects = ["Dizziness", "Headache", "Back pain", "Upper respiratory tract infection", "Nausea"];
    substitutes = ["Telma 40", "Tazloc 40", "Telvas 40", "Atorva 10", "Lipvas 10"];
    safetyWarnings = {
      alcohol: "Unsafe. May cause excessive blood pressure lowering when combined with alcohol.",
      pregnancy: "Unsafe. Contraindicated in pregnancy as it can cause harm or death to the fetus.",
      driving: "Caution. May cause dizziness or drowsiness; do not drive if affected.",
      kidneyLiver: "Caution. Close monitoring and dose adjustment needed in kidney or liver disease."
    };
  } else if (salt.includes("pantoprazole") || salt.includes("antacid")) {
    medicalUses = ["Acidity and heartburn", "Gastroesophageal reflux disease (GERD)", "Peptic ulcer disease"];
    sideEffects = ["Headache", "Diarrhoea", "Nausea", "Stomach pain", "Flatulence"];
    substitutes = ["Pantocid 40", "Pan 40", "Pantodac 40", "Pentocid 40"];
    safetyWarnings = {
      alcohol: "Caution. Alcohol increases gastric acid secretion, worsening your symptoms.",
      pregnancy: "Safe if prescribed. Consult your doctor; generally safe but avoid self-medication.",
      driving: "Safe. No known impact on driving performance.",
      kidneyLiver: "Safe. No dose adjustment needed for liver/kidney patients in standard short-term courses."
    };
  }

  return {
    ...m,
    medicalUses,
    sideEffects,
    substitutes,
    safetyWarnings
  };
}
