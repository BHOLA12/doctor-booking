import { Medicine, MEDICINES } from "./medicines-data";

export type PharmacyStore = {
  id: string;
  name: string;
  image: string;
  distance: string;
  rating: number;
  reviews: number;
  isOpen: boolean;
  isVerified: boolean;
  hasGST: boolean;
  medicineStock: "Available" | "Limited" | "Out of Stock";
  deliveryTime: string;
  isFreeDelivery: boolean;
  isPickupAvailable: boolean;
  address: string;
};

export const PHARMACY_STORES: PharmacyStore[] = [
  {
    id: "s1",
    name: "Wellness Forever Medical",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "1.2 km",
    rating: 4.8,
    reviews: 1250,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Available",
    deliveryTime: "30-45 mins",
    isFreeDelivery: true,
    isPickupAvailable: true,
    address: "Sector 18, Noida, UP",
  },
  {
    id: "s2",
    name: "Apollo Pharmacy",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "2.5 km",
    rating: 4.5,
    reviews: 890,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Available",
    deliveryTime: "45-60 mins",
    isFreeDelivery: true,
    isPickupAvailable: true,
    address: "Indirapuram, Ghaziabad",
  },
  {
    id: "s3",
    name: "Guardian Life Care",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "3.8 km",
    rating: 4.2,
    reviews: 450,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Limited",
    deliveryTime: "60-90 mins",
    isFreeDelivery: false,
    isPickupAvailable: true,
    address: "Preet Vihar, Delhi",
  },
  {
    id: "s4",
    name: "Local Medical Hall",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "0.5 km",
    rating: 3.9,
    reviews: 120,
    isOpen: true,
    isVerified: false,
    hasGST: true,
    medicineStock: "Available",
    deliveryTime: "15-20 mins",
    isFreeDelivery: true,
    isPickupAvailable: true,
    address: "Gautam Buddha Nagar, Noida",
  },
];

export const PHARMACY_CATEGORIES = [
  "All",
  "Pain Relief",
  "Vitamins & Supplements",
  "Antibiotics",
  "Diabetes",
  "Heart & BP",
  "Digestive Health",
  "Cold & Fever",
  "Skin Care",
  "Ayurveda",
  "Baby Care",
  "Women Care",
  "Fitness & Protein",
  "Immunity Boosters",
];

export const DELIVERY_OPTIONS = [
  {
    id: "instant",
    label: "Instant Delivery",
    time: "30–60 mins",
    price: "₹25",
    icon: "⚡",
    description: "Fastest delivery to your doorstep",
  },
  {
    id: "same-day",
    label: "Same Day Delivery",
    time: "By 8 PM",
    price: "FREE",
    icon: "🚚",
    description: "Standard delivery for non-urgent items",
  },
  {
    id: "pickup",
    label: "Store Pickup",
    time: "Ready in 15 mins",
    price: "FREE",
    icon: "🏪",
    description: "Skip the queue and collect yourself",
  },
  {
    id: "scheduled",
    label: "Schedule Delivery",
    time: "Select Slot",
    price: "₹10",
    icon: "📅",
    description: "Choose a time that works for you",
  },
];
