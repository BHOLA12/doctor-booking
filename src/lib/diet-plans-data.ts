export type DietPlan = {
  id: string;
  title: string;
  goal: string;
  duration: string;
  price: number;
  mrp: number;
  discount: number;
  description: string;
  features: string[];
  targetFor: string[];
  emoji: string;
  accent: string;
  popular: boolean;
};

export const DIET_PLANS: DietPlan[] = [
  {
    id: "dp1",
    title: "Weight Loss Plan",
    goal: "Lose 4–6 kg in 4 weeks",
    duration: "4 Weeks",
    price: 999,
    mrp: 1999,
    discount: 50,
    description:
      "A science-backed calorie-deficit plan with balanced macros, weekly check-ins, and personalised meal adjustments by a certified dietitian.",
    features: [
      "Personalised 7-day meal plans",
      "Weekly nutritionist video call",
      "Grocery shopping list",
      "Healthy recipe book (40+ recipes)",
      "Progress tracking dashboard",
      "24/7 chat support",
    ],
    targetFor: ["Obesity", "PCOS", "High cholesterol", "Sedentary lifestyle"],
    emoji: "🏃",
    accent: "from-orange-100 to-amber-50 text-orange-600",
    popular: true,
  },
  {
    id: "dp2",
    title: "Muscle Gain Plan",
    goal: "Gain 3–4 kg lean muscle in 6 weeks",
    duration: "6 Weeks",
    price: 1299,
    mrp: 2499,
    discount: 48,
    description:
      "High-protein, calorie-surplus diet plan synced with your workout schedule. Includes supplement recommendations and recovery nutrition.",
    features: [
      "High-protein meal planning",
      "Pre & post workout nutrition",
      "Supplement guide & recommendations",
      "Body composition tracking",
      "Bi-weekly dietitian consultations",
      "Workout nutrition timing guide",
    ],
    targetFor: ["Athletes", "Gym beginners", "Skinny fat", "Underweight"],
    emoji: "💪",
    accent: "from-blue-100 to-sky-50 text-blue-600",
    popular: false,
  },
  {
    id: "dp3",
    title: "Diabetes Care Plan",
    goal: "Control blood sugar & improve HbA1c",
    duration: "8 Weeks",
    price: 1499,
    mrp: 2999,
    discount: 50,
    description:
      "Low glycaemic index diet designed to stabilise blood sugar, reduce insulin resistance, and improve metabolic health — supervised by a diabetologist-trained dietitian.",
    features: [
      "Low GI food guidance",
      "Blood sugar friendly meal plans",
      "Portion control coaching",
      "Glycaemic load calculations",
      "Monthly HbA1c tracking support",
      "Diabetes nutritionist consultation",
    ],
    targetFor: ["Type 2 Diabetes", "Pre-diabetes", "Insulin resistance", "Metabolic syndrome"],
    emoji: "🩺",
    accent: "from-teal-100 to-emerald-50 text-teal-600",
    popular: true,
  },
  {
    id: "dp4",
    title: "Heart-Healthy Plan",
    goal: "Lower cholesterol & improve heart health",
    duration: "6 Weeks",
    price: 1199,
    mrp: 2299,
    discount: 48,
    description:
      "A DASH-inspired diet reducing sodium, saturated fats, and processed foods while increasing fibre, omega-3s, and antioxidants for optimal cardiovascular health.",
    features: [
      "DASH diet meal planning",
      "Sodium & fat tracking",
      "Heart-healthy recipes (50+)",
      "Cholesterol management guide",
      "Cardiologist-reviewed plan",
      "Bi-weekly check-ins",
    ],
    targetFor: ["High BP", "High cholesterol", "Post-cardiac surgery", "Family history of heart disease"],
    emoji: "❤️",
    accent: "from-rose-100 to-pink-50 text-rose-600",
    popular: false,
  },
  {
    id: "dp5",
    title: "PCOS & Hormonal Balance",
    goal: "Regulate hormones & reduce PCOS symptoms",
    duration: "8 Weeks",
    price: 1399,
    mrp: 2699,
    discount: 48,
    description:
      "Anti-inflammatory, low-GI diet combined with lifestyle modifications to address PCOS-related weight gain, insulin resistance, and hormonal imbalances.",
    features: [
      "Anti-inflammatory meal plans",
      "Hormone-balancing food guide",
      "Inositol & supplement advice",
      "Cycle-synced nutrition",
      "Gynaecologist-coordinated plan",
      "Stress & sleep nutrition tips",
    ],
    targetFor: ["PCOS/PCOD", "Hormonal imbalance", "Irregular periods", "Fertility support"],
    emoji: "🌸",
    accent: "from-violet-100 to-purple-50 text-violet-600",
    popular: false,
  },
  {
    id: "dp6",
    title: "Kids Nutrition Plan",
    goal: "Optimal growth & immunity for children",
    duration: "4 Weeks",
    price: 799,
    mrp: 1499,
    discount: 47,
    description:
      "Age-appropriate, fun, and nutrient-dense meal plans to support healthy growth, immunity, cognitive development, and good eating habits in children aged 3–15.",
    features: [
      "Age-appropriate meal plans",
      "Picky eater strategies",
      "School tiffin ideas (30+ options)",
      "Immunity boosting foods",
      "Paediatrician-reviewed",
      "Parent consultation session",
    ],
    targetFor: ["Underweight children", "Low immunity", "Picky eaters", "Growing teenagers"],
    emoji: "👶",
    accent: "from-green-100 to-lime-50 text-green-600",
    popular: false,
  },
];
