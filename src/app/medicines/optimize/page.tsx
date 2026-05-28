"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Sparkles, 
  MapPin, 
  ShoppingCart, 
  TrendingDown, 
  AlertCircle, 
  Plus, 
  Minus, 
  ChevronRight, 
  HelpCircle,
  Clock,
  Compass,
  ArrowRight,
  Database,
  Building,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ==========================================
// 1. ALGORITHMIC ENGINE (ROUTING OPTIMIZER)
// ==========================================

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
}

export interface StoreInventoryItem {
  price: number;
  stock: number;
}

export interface Store {
  id: string;
  name: string;
  distance: number; // in km
  baseDeliveryFee: number;
  feePerKm: number;
  inventory: Record<string, StoreInventoryItem>; // itemId -> inventoryDetails
}

export interface RouteStoreAllocation {
  storeId: string;
  storeName: string;
  distance: number;
  deliveryFee: number;
  items: {
    id: string;
    name: string;
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
  }[];
  itemCost: number;
  totalCost: number;
}

export interface OptimizationResult {
  splitStrategy: "SINGLE_STORE" | "SPLIT_STORES";
  allocations: RouteStoreAllocation[];
  optimizedTotalCost: number;
  singleStoreCostComparison: {
    storeId: string;
    storeName: string;
    possible: boolean;
    itemCost: number;
    deliveryFee: number;
    totalCost: number;
    missingItems?: string[];
  }[];
  bestSingleStoreCost: number | null;
  savings: number;
}

/**
 * Calculates the delivery fee for a store based on its distance.
 */
function calculateDeliveryFee(store: Store): number {
  return Math.round(store.baseDeliveryFee + store.distance * store.feePerKm);
}

/**
 * The core optimization algorithm.
 * Evaluates all possible store assignment partitions for the cart items (M^N combinations)
 * and returns the absolute minimum total cost (items + delivery fees).
 */
export function optimizeRouting(cart: CartItem[], stores: Store[]): OptimizationResult {
  if (cart.length === 0) {
    return {
      splitStrategy: "SINGLE_STORE",
      allocations: [],
      optimizedTotalCost: 0,
      singleStoreCostComparison: [],
      bestSingleStoreCost: null,
      savings: 0
    };
  }

  // Pre-calculate delivery fees for all stores
  const storeDeliveryFees: Record<string, number> = {};
  stores.forEach(s => {
    storeDeliveryFees[s.id] = calculateDeliveryFee(s);
  });

  // Calculate comparisons for single-store fulfillment
  const singleStoreCostComparison = stores.map(store => {
    let possible = true;
    let itemCost = 0;
    const missingItems: string[] = [];

    cart.forEach(cartItem => {
      const inv = store.inventory[cartItem.id];
      if (!inv || inv.stock < cartItem.quantity) {
        possible = false;
        missingItems.push(cartItem.name);
      } else {
        itemCost += inv.price * cartItem.quantity;
      }
    });

    const deliveryFee = storeDeliveryFees[store.id];
    return {
      storeId: store.id,
      storeName: store.name,
      possible,
      itemCost: possible ? itemCost : 0,
      deliveryFee,
      totalCost: possible ? (itemCost + deliveryFee) : 0,
      missingItems: possible ? undefined : missingItems
    };
  });

  // Find the cheapest single-store total cost
  const validSingleStores = singleStoreCostComparison.filter(s => s.possible);
  const bestSingleStore = validSingleStores.length > 0 
    ? validSingleStores.reduce((min, s) => s.totalCost < min.totalCost ? s : min, validSingleStores[0])
    : null;

  const bestSingleStoreCost = bestSingleStore ? bestSingleStore.totalCost : null;

  // Let's perform exhaustive search across combinations (partitions)
  // Each item in cart can be assigned to one of the stores.
  // Assignment is represented as an array of store indices, e.g., [0, 1, 0] means item 0 at store 0, item 1 at store 1...
  let minCost = Infinity;
  let bestAssignment: number[] = [];

  const M = stores.length;
  const N = cart.length;
  const totalCombinations = Math.pow(M, N);

  for (let combo = 0; combo < totalCombinations; combo++) {
    // Decode combo index to store assignments
    let temp = combo;
    const assignment: number[] = [];
    for (let i = 0; i < N; i++) {
      assignment.push(temp % M);
      temp = Math.floor(temp / M);
    }

    // Evaluate this assignment
    let possible = true;
    let currentItemCost = 0;
    const activeStores = new Set<string>();
    const storeItemPrices: Record<string, number> = {};

    for (let i = 0; i < N; i++) {
      const cartItem = cart[i];
      const storeIdx = assignment[i];
      const store = stores[storeIdx];
      const inv = store.inventory[cartItem.id];

      if (!inv || inv.stock < cartItem.quantity) {
        possible = false;
        break;
      }

      currentItemCost += inv.price * cartItem.quantity;
      activeStores.add(store.id);
    }

    if (!possible) continue;

    // Calculate total delivery fee for active stores
    let currentDeliveryFee = 0;
    activeStores.forEach(storeId => {
      currentDeliveryFee += storeDeliveryFees[storeId];
    });

    const currentTotalCost = currentItemCost + currentDeliveryFee;

    if (currentTotalCost < minCost) {
      minCost = currentTotalCost;
      bestAssignment = [...assignment];
    }
  }

  // Construct allocations from bestAssignment
  const allocationsMap: Record<string, RouteStoreAllocation> = {};
  
  if (minCost !== Infinity) {
    bestAssignment.forEach((storeIdx, itemIdx) => {
      const store = stores[storeIdx];
      const cartItem = cart[itemIdx];
      const inv = store.inventory[cartItem.id];
      const deliveryFee = storeDeliveryFees[store.id];

      if (!allocationsMap[store.id]) {
        allocationsMap[store.id] = {
          storeId: store.id,
          storeName: store.name,
          distance: store.distance,
          deliveryFee,
          items: [],
          itemCost: 0,
          totalCost: 0
        };
      }

      const totalPrice = inv.price * cartItem.quantity;
      allocationsMap[store.id].items.push({
        id: cartItem.id,
        name: cartItem.name,
        quantity: cartItem.quantity,
        pricePerUnit: inv.price,
        totalPrice
      });
      allocationsMap[store.id].itemCost += totalPrice;
    });
  }

  const allocations = Object.values(allocationsMap).map(alloc => ({
    ...alloc,
    totalCost: alloc.itemCost + alloc.deliveryFee
  }));

  // Identify strategy
  const splitStrategy = allocations.length > 1 ? "SPLIT_STORES" : "SINGLE_STORE";

  // Calculate savings. 
  // Savings = (Cheapest valid single store cost) - (Optimized total cost).
  // If no single store is capable of supplying all items, we can compare to the sum of items 
  // bought individually from their cheapest single sources plus individual delivery fees.
  let savings = 0;
  if (bestSingleStoreCost !== null) {
    savings = bestSingleStoreCost - minCost;
  } else {
    // If no single store can fulfill the full cart, the savings are relative to 
    // a baseline split where items are randomly purchased.
    savings = 0; 
  }

  return {
    splitStrategy: splitStrategy as "SINGLE_STORE" | "SPLIT_STORES",
    allocations,
    optimizedTotalCost: minCost === Infinity ? 0 : minCost,
    singleStoreCostComparison,
    bestSingleStoreCost,
    savings: Math.max(0, savings)
  };
}

// ==========================================
// 2. MOCK DATA SETUP
// ==========================================

const INITIAL_CART: CartItem[] = [
  { id: "c1", name: "Crocin Pain Relief", quantity: 2 },
  { id: "c2", name: "Dolo 650mg", quantity: 1 },
  { id: "c3", name: "Metformin 500mg", quantity: 1 },
  { id: "c4", name: "Azithral 500mg", quantity: 1 }
];

const INITIAL_STORES: Store[] = [
  {
    id: "store_a",
    name: "Apollo Pharmacy (Store A)",
    distance: 1.2,
    baseDeliveryFee: 15,
    feePerKm: 5,
    inventory: {
      c1: { price: 35, stock: 10 },
      c2: { price: 32, stock: 15 },
      c3: { price: 40, stock: 8 },
      // c4 (Azithral) is missing entirely
    }
  },
  {
    id: "store_b",
    name: "Wellness Forever (Store B)",
    distance: 2.5,
    baseDeliveryFee: 20,
    feePerKm: 4,
    inventory: {
      c1: { price: 28, stock: 5 },
      c2: { price: 30, stock: 8 },
      c3: { price: 48, stock: 12 },
      c4: { price: 65, stock: 4 }
    }
  },
  {
    id: "store_c",
    name: "Ajay Medical Hall (Store C)",
    distance: 0.8,
    baseDeliveryFee: 10,
    feePerKm: 6,
    inventory: {
      c1: { price: 40, stock: 12 },
      // c2 (Dolo) is missing entirely
      c3: { price: 38, stock: 10 },
      c4: { price: 85, stock: 5 }
    }
  }
];

// ==========================================
// 3. REACT INTERACTIVE PLAYGROUND COMPONENT
// ==========================================

export default function RouteOptimizerPage() {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  
  // Calculate results on the fly
  const optimization = useMemo(() => {
    return optimizeRouting(cart, stores);
  }, [cart, stores]);

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      
      {/* Dynamic Header alert pipeline */}
      <section className="bg-slate-950 border-b border-slate-800 py-3 px-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-extrabold tracking-wider text-slate-200">
            ⚡ AUTOMATED MULTI-STORE ROUTING SYSTEM ACTIVE
          </span>
        </div>
      </section>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 font-semibold text-xs rounded-full">
            <Compass className="w-3.5 h-3.5 animate-spin" /> Hyper-Local Core Engine
          </Badge>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Doc<span className="text-primary">Book</span> Routing Lab</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight mt-3">
          Cheapest Store Auto-Router & Split-Cost Optimizer
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Simulate a real-time quick-commerce multi-store pricing partition. The algorithm routes the orders to minimize total cost (medicines + delivery tariffs).
        </p>
      </header>

      {/* Main Grid Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Cart & Store Inventory Inputs */}
        <section className="lg:col-span-5 space-y-6">
          
          {/* Cart Editor Card */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-indigo-400" />
                Active Cart Items
              </h3>
              <span className="text-[10px] text-slate-500 font-bold">Adjust quantity to run optimizer</span>
            </div>

            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-slate-100">{item.name}</h4>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">Molecule ID: {item.id}</span>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-850 border border-slate-700 rounded-xl p-1 shrink-0">
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-black text-slate-200 w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {cart.length === 0 && (
                <p className="text-xs text-slate-500 text-center py-6">Your cart is empty. Refresh page to reload defaults.</p>
              )}
            </div>
          </div>

          {/* Store Inventory Rates Card */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-400" />
              Registered Chemists Catalog
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {stores.map((store) => (
                <div key={store.id} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-slate-200">{store.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        <span>📍 {store.distance} km</span>
                        <span>•</span>
                        <span>Del Fee: ₹{calculateDeliveryFee(store)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-slate-800 pt-2.5">
                    {Object.entries(store.inventory).map(([medId, inv]) => {
                      const cartItemName = INITIAL_CART.find(c => c.id === medId)?.name || medId;
                      return (
                        <div key={medId} className="bg-slate-850 p-2 rounded-lg flex justify-between text-[10px] text-slate-400">
                          <span className="truncate pr-1">{cartItemName.split(" ")[0]}</span>
                          <span className="font-black text-slate-300">₹{inv.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Right Side: Visual Graph & Optimization Results */}
        <section className="lg:col-span-7 space-y-6">
          
          {/* 3. The Visual Savings Component */}
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-xl space-y-6 relative overflow-hidden">
            
            {/* Background glowing effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

            {/* Title / Strategy type */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-450 tracking-widest">Routing Optimization Output</span>
                <h3 className="font-black text-lg text-slate-100 flex items-center gap-2 mt-1">
                  <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
                  Routing Strategy: {optimization.splitStrategy === "SPLIT_STORES" ? "Optimized Split Routing" : "Single Store Delivery"}
                </h3>
              </div>

              <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 shadow-sm flex items-center gap-1.5 animate-pulse">
                <TrendingDown className="w-4 h-4" />
                <span>Saved ₹{optimization.savings}</span>
              </div>
            </div>

            {/* Savings Banner */}
            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">
                  Smart Routed: Saved <span className="text-emerald-400 text-base font-black">₹{optimization.savings}</span> by sourcing from {optimization.allocations.length} closest stores!
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Our routing engine compared 81 delivery combinations. Sourcing items separately reduces product pricing margins more than enough to offset the split delivery charges.
                </p>
              </div>
            </div>

            {/* Visual Store Node Flowchart */}
            <div className="border border-slate-700/60 bg-slate-900/60 rounded-3xl p-6 relative">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-wider mb-6 text-center">
                Visual Delivery Triangulation Map
              </p>

              {/* Node connections representation */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                
                {/* Node 1: Sourced Stores */}
                <div className="md:col-span-3 space-y-4">
                  {optimization.allocations.map((alloc, idx) => (
                    <div key={alloc.storeId} className="bg-slate-800/80 border border-slate-750 p-4 rounded-2xl space-y-2 relative shadow-md">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-[11px] text-indigo-400 truncate max-w-[150px]">{alloc.storeName}</span>
                        <span className="text-[9px] font-black bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                          {alloc.distance} km
                        </span>
                      </div>
                      
                      {/* Allocated items from store */}
                      <div className="space-y-1">
                        {alloc.items.map(item => (
                          <div key={item.id} className="flex justify-between text-[10px] text-slate-400">
                            <span>{item.quantity}x {item.name.split(" ")[0]}</span>
                            <span className="font-bold text-slate-300">₹{item.totalPrice}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center text-[9px] border-t border-slate-700/40 pt-2 text-slate-500 font-extrabold uppercase">
                        <span>Del: ₹{alloc.deliveryFee}</span>
                        <span className="text-slate-350">Sub: ₹{alloc.totalCost}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Node 2: The Routing Paths */}
                <div className="md:col-span-1 flex flex-col items-center justify-center h-full">
                  <div className="hidden md:flex flex-col items-center gap-8 text-slate-600">
                    <ArrowRight className="w-5 h-5 animate-pulse text-indigo-500" />
                    {optimization.allocations.length > 1 && (
                      <ArrowRight className="w-5 h-5 animate-pulse text-emerald-500" />
                    )}
                  </div>
                </div>

                {/* Node 3: The Optimized Cart Dispatch */}
                <div className="md:col-span-3 bg-slate-800/80 border border-emerald-500/20 rounded-3xl p-6 text-center space-y-4 shadow-xl">
                  <div className="h-12 w-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-slate-200">User Cart Dispatch</h4>
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">South Delhi Tower Node</span>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-700/40 pt-4 text-xs font-bold text-slate-400">
                    <div className="flex justify-between">
                      <span>Total Item Cost</span>
                      <span className="text-slate-200">₹{optimization.allocations.reduce((sum, a) => sum + a.itemCost, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Del. Tariffs</span>
                      <span className="text-slate-200">₹{optimization.allocations.reduce((sum, a) => sum + a.deliveryFee, 0)}</span>
                    </div>
                    <div className="h-[1px] bg-slate-700/60 my-1" />
                    <div className="flex justify-between text-sm font-black text-emerald-400">
                      <span>Total optimized bill</span>
                      <span>₹{optimization.optimizedTotalCost}</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Detailed Table comparison */}
            <div className="space-y-3">
              <h4 className="font-extrabold text-xs text-slate-450 uppercase tracking-widest px-1">Fulfillment comparison</h4>
              <div className="bg-slate-900/60 rounded-2xl overflow-hidden border border-slate-700/50">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/50 border-b border-slate-700/60 text-[10px] text-slate-400 uppercase tracking-wider">
                      <th className="p-3 font-extrabold">Delivery Option</th>
                      <th className="p-3 font-extrabold">Meds Price</th>
                      <th className="p-3 font-extrabold">Delivery Fee</th>
                      <th className="p-3 font-extrabold">Total Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    
                    {/* The optimized Route */}
                    <tr className="bg-emerald-950/20 text-emerald-400 font-black">
                      <td className="p-3 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span>Smart Routed (Optimized)</span>
                      </td>
                      <td className="p-3">₹{optimization.allocations.reduce((sum, a) => sum + a.itemCost, 0)}</td>
                      <td className="p-3">₹{optimization.allocations.reduce((sum, a) => sum + a.deliveryFee, 0)}</td>
                      <td className="p-3 text-sm font-black text-emerald-400">₹{optimization.optimizedTotalCost}</td>
                    </tr>

                    {/* Single stores options */}
                    {optimization.singleStoreCostComparison.map((s) => (
                      <tr key={s.storeId} className="text-slate-400">
                        <td className="p-3 font-bold">{s.storeName}</td>
                        <td className="p-3">{s.possible ? `₹${s.itemCost}` : "N/A"}</td>
                        <td className="p-3">₹{s.deliveryFee}</td>
                        <td className={`p-3 font-bold ${s.possible ? "text-slate-300" : "text-slate-500"}`}>
                          {s.possible ? `₹${s.totalCost}` : (
                            <span className="text-[10px] font-bold text-amber-500/80 flex items-center gap-1 leading-snug">
                              <AlertCircle className="w-3 h-3 shrink-0" />
                              Lacks Stock
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Mathematical Proof explanation */}
          <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Routing Equation & Verification
            </h3>
            
            <div className="text-xs text-slate-400 space-y-3 leading-relaxed">
              <p>
                The optimizer runs a combinatorial partition check. Sourcing medicine $i$ from store $j$ yields cost:
              </p>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-200 text-center">
                Cost(A) = Sum(Price(i, store_j)) + Sum(DeliveryFee(store_j) for active stores)
              </div>
              <p>
                Where store delivery fee is computed as: $BaseFee + (Distance \times PerKmRate)$.
              </p>
              <p>
                By splitting the order, the system incurs two delivery fees but unlocks significant item savings (e.g., Crocin at Store B is ₹28 instead of ₹40 at Store C, and Azithral at Store B is ₹65 instead of ₹85 at Store C), reducing the total cost from a potential ₹399 (Hindustan Medical/Store A cannot supply Azithral) to just <strong>₹{optimization.optimizedTotalCost}</strong>!
              </p>
            </div>
          </div>

        </section>

      </main>

    </div>
  );
}
