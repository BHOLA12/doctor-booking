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
    name: "Hindustan Medical Hall",
    image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "0.5 km",
    rating: 4.8,
    reviews: 180,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Available",
    deliveryTime: "30-45 mins",
    isFreeDelivery: true,
    isPickupAvailable: true,
    address: "Jehanabad Court, Patna-Gaya Highway, Jehanabad, Bihar",
  },
  {
    id: "s2",
    name: "Ajay Medical Hall",
    image: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "1.2 km",
    rating: 4.6,
    reviews: 95,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Available",
    deliveryTime: "45-60 mins",
    isFreeDelivery: true,
    isPickupAvailable: true,
    address: "Main Market, Hospital Road, Jehanabad, Bihar",
  },
  {
    id: "s3",
    name: "Gudvil Medical Hall",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "2.1 km",
    rating: 4.5,
    reviews: 64,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Limited",
    deliveryTime: "60-90 mins",
    isFreeDelivery: false,
    isPickupAvailable: true,
    address: "Rajabazar, NH-83, Patna-Gaya Road, Jehanabad, Bihar",
  },
  {
    id: "s4",
    name: "Green Medical Hall",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?q=80&w=200&h=200&auto=format&fit=crop",
    distance: "1.5 km",
    rating: 4.3,
    reviews: 42,
    isOpen: true,
    isVerified: true,
    hasGST: true,
    medicineStock: "Available",
    deliveryTime: "15-20 mins",
    isFreeDelivery: true,
    isPickupAvailable: true,
    address: "Main Market, Hospital Road, Jehanabad, Bihar",
  },
];

export function getCombinedStores(savedStoreStr: string | null): PharmacyStore[] {
  if (!savedStoreStr) return PHARMACY_STORES;
  try {
    const savedStore = JSON.parse(savedStoreStr);
    const newStore: PharmacyStore = {
      id: "registered-store",
      name: savedStore.storeName || savedStore.name || "My Registered Pharmacy",
      image: savedStore.avatar || "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=200&h=200&auto=format&fit=crop",
      distance: "0.2 km",
      rating: 5.0,
      reviews: 1,
      isOpen: true,
      isVerified: true,
      hasGST: !!savedStore.gstin,
      medicineStock: "Available",
      deliveryTime: "15-30 mins",
      isFreeDelivery: true,
      isPickupAvailable: true,
      address: `${savedStore.address || "Main Road"}, ${savedStore.pincode || "804408"}, Jehanabad, Bihar`,
    };
    
    // Return registered store prepended to general stores list
    return [newStore, ...PHARMACY_STORES];
  } catch {
    return PHARMACY_STORES;
  }
}

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
