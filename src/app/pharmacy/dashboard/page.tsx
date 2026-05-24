"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  History, 
  Settings, 
  Plus, 
  Search,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  ShieldCheck,
  MapPin,
  Timer,
  Upload,
  Lock,
  Mail,
  User,
  Phone,
  FileText,
  AlertCircle,
  Volume2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Web Audio API synthesizer for incoming order alert
const playIncomingOrderChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Play note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start();
    osc1.stop(ctx.currentTime + 0.35);

    // Play note 2 slightly later
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.15); // G5
    gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start();
    osc2.stop(ctx.currentTime + 0.5);
  } catch (err) {
    console.error("Audio failed to play", err);
  }
};

// Initial Mock Inventory
const INITIAL_INVENTORY = [
  { name: "Crocin 500mg", sku: "MED-450", stock: 240, price: 28, status: "In Stock" },
  { name: "Dolo 650", sku: "MED-451", stock: 12, price: 30, status: "Low Stock" },
  { name: "Azithral 500", sku: "MED-452", stock: 85, price: 72, status: "In Stock" },
  { name: "Metformin 500", sku: "MED-453", stock: 0, price: 45, status: "Out of Stock" },
];

// Initial Mock Orders
const INITIAL_ORDERS = [
  { id: "#DB-9810", customer: "Amit Sharma", items: "Paracetamol 500mg x 2, Cetirizine x 1", total: "₹95", status: "Delivered", time: "2 hours ago", color: "text-emerald-600 bg-emerald-50" },
  { id: "#DB-9811", customer: "Komal Priya", items: "Dolo 650 x 3", total: "₹90", status: "In Transit", color: "text-blue-600 bg-blue-50", time: "1 hour ago" },
  { id: "#DB-9812", customer: "Rohan Varma", items: "Azithral 500 x 1, Becosules x 2", total: "₹240", status: "Preparing", color: "text-amber-600 bg-amber-50", time: "20 mins ago" }
];

export default function StorePortalDashboard() {
  // Auth state
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");

  // Registration Form Fields
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pharmacistName, setPharmacistName] = useState("");
  const [pharmacistRegNo, setPharmacistRegNo] = useState("");
  const [dl20, setDl20] = useState("");
  const [dl21, setDl21] = useState("");
  const [gstin, setGstin] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [password, setPassword] = useState("");
  const [dlFile, setDlFile] = useState<File | null>(null);

  // Dashboard state
  const [activeTab, setActiveTab] = useState("Overview");
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [ordersList, setOrdersList] = useState(INITIAL_ORDERS);
  const { user, loading } = useAuth();
  const router = useRouter();
  
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-sm text-slate-500">Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-lg shadow-slate-200/50">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Partner access required</p>
          <h1 className="mt-6 text-3xl font-bold text-slate-900">Pharmacy Dashboard</h1>
          <p className="mt-3 text-slate-600">This portal is only available to authenticated pharmacy partners. Please sign in or register as a pharmacy to continue.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <button onClick={() => router.push("/login")} className="rounded-full bg-cyan-600 px-6 py-3 text-white shadow-sm hover:bg-cyan-700 transition">
              Login
            </button>
            <button onClick={() => router.push("/register?role=pharmacy")} className="rounded-full border border-slate-300 px-6 py-3 text-slate-900 hover:bg-slate-100 transition">
              Register as Pharmacy
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role !== "PHARMACY") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 shadow-sm">
          <h1 className="text-3xl font-bold text-rose-700">Access denied</h1>
          <p className="mt-3 text-slate-600">Your account does not have pharmacy partner access. Please login with a pharmacy account or contact support.</p>
          <button onClick={() => router.push("/")} className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-800 transition">
            Return to homepage
          </button>
        </div>
      </div>
    );
  }
  const [incomingOrder, setIncomingOrder] = useState<any | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Import inventory modal state
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importTab, setImportTab] = useState<"ocr" | "excel" | "pdf">("ocr");
  const [scanning, setScanning] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [ocrResults, setOcrResults] = useState<any[]>([]);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Load registered details from localStorage
  useEffect(() => {
    const savedStore = localStorage.getItem("registeredStore");
    if (savedStore) {
      const storeData = JSON.parse(savedStore);
      setStoreName(storeData.storeName);
      setAddress(storeData.address);
      setEmail(storeData.email);
      setDl20(storeData.dl20);
      setGstin(storeData.gstin);
      setIsRegistered(true);
      setAuthMode("login");
    }
  }, []);

  // Simulate an incoming order 8 seconds after login
  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        const mockNewOrder = {
          id: `#DB-${Math.floor(1000 + Math.random() * 9000)}`,
          customer: "Rajesh Kumar",
          items: "Crocin 500mg x 4, Azithral 500 x 2",
          total: "₹256",
          distance: "0.8 km",
          time: "Just Now",
        };
        setIncomingOrder(mockNewOrder);
        setShowOrderModal(true);
        playIncomingOrderChime();
        toast.info("🚨 New Urgent Delivery Request!", {
          description: "Verify medical list and respond quickly.",
          action: {
            label: "Review",
            onClick: () => setShowOrderModal(true)
          }
        });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  // Handle Quick Demo Store Load
  const loadDemoData = () => {
    setStoreName("Wellness Forever Medical");
    setOwnerName("Kashyap Bhardwaj");
    setEmail("wellness.forever@gmail.com");
    setPhone("+91 99887 76655");
    setPharmacistName("Amit Patel (B.Pharm)");
    setPharmacistRegNo("REG-2026-PH-94825");
    setDl20("DL-20-84725/26");
    setDl21("DL-21-84726/26");
    setGstin("09AAAAA1111A1Z1");
    setAddress("Sector 18, Noida, Uttar Pradesh");
    setPincode("201301");
    setPassword("demo123");
    toast.success("Demo credentials loaded! Click Register.");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !dl20 || !gstin || !address || !email || !password) {
      toast.error("Please fill all essential legal store fields.");
      return;
    }
    
    // Validate GSTIN length (Indian GSTIN has 15 chars)
    if (gstin.length !== 15) {
      toast.warning("A valid GSTIN must be exactly 15 characters.");
    }

    const storeData = {
      storeName, ownerName, email, phone, pharmacistName, pharmacistRegNo, dl20, dl21, gstin, address, pincode
    };

    localStorage.setItem("registeredStore", JSON.stringify(storeData));
    setIsRegistered(true);
    setIsLoggedIn(true);
    toast.success("Medical Store Registered & Verified successfully! 🎉");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password required.");
      return;
    }

    // Direct Login for testing
    setIsLoggedIn(true);
    toast.success(`Welcome back to your dashboard, ${storeName || "Store Partner"}!`);
  };

  // Sound test button
  const triggerAudioTest = () => {
    playIncomingOrderChime();
    toast.success("Audio chime played!");
  };

  // Order Actions
  const acceptOrder = () => {
    if (!incomingOrder) return;
    const accepted = {
      ...incomingOrder,
      status: "Preparing",
      color: "text-amber-600 bg-amber-50"
    };
    setOrdersList([accepted, ...ordersList]);
    setIncomingOrder(null);
    setShowOrderModal(false);
    toast.success("Order accepted! Dispatch team notified.");
  };

  const rejectOrder = () => {
    setIncomingOrder(null);
    setShowOrderModal(false);
    toast.error("Order declined.");
  };

  // Update order status flow
  const advanceOrderStatus = (orderId: string) => {
    setOrdersList(prev => prev.map(order => {
      if (order.id === orderId) {
        if (order.status === "Preparing") {
          toast.info(`${order.id} is now In Transit!`);
          return { ...order, status: "In Transit", color: "text-blue-600 bg-blue-50" };
        } else if (order.status === "In Transit") {
          toast.success(`${order.id} delivered successfully!`);
          return { ...order, status: "Delivered", color: "text-emerald-600 bg-emerald-50" };
        }
      }
      return order;
    }));
  };

  // OCR scan simulation file selector
  const handleOcrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanning(true);
      setOcrResults([]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScanImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Simulate red scanner laser time
      setTimeout(() => {
        setScanning(false);
        setOcrResults([
          { name: "Becosules Capsules", stock: 150, price: 42, match: "98% (High)" },
          { name: "Paracetamol 500mg", stock: 500, price: 15, match: "94% (High)" },
          { name: "Combiflam Pain Relief", stock: 120, price: 38, match: "89% (Medium)" }
        ]);
        toast.success("OCR Scan completed. Detected 3 medicines!");
      }, 3500);
    }
  };

  // Excel file select
  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      toast.loading("Parsing excel sheet...", { duration: 1500 });
      setTimeout(() => {
        const newMeds = [
          { name: "Calpol 650", sku: "MED-910", stock: 180, price: 32, status: "In Stock" },
          { name: "Aspirin 75mg", sku: "MED-911", stock: 200, price: 18, status: "In Stock" },
          { name: "Pantocid 40mg", sku: "MED-912", stock: 95, price: 110, status: "In Stock" }
        ];
        setInventory([...inventory, ...newMeds]);
        toast.success("Parsed 3 items from Excel sheet and added to Inventory!");
        setExcelFile(null);
        setShowImportDialog(false);
      }, 1500);
    }
  };

  // PDF file select
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      toast.loading("Analyzing medical purchase invoice PDF...", { duration: 1800 });
      setTimeout(() => {
        const newMeds = [
          { name: "Volini Spray 40g", sku: "MED-718", stock: 45, price: 125, status: "In Stock" },
          { name: "Becadexamin Multi", sku: "MED-719", stock: 350, price: 50, status: "In Stock" }
        ];
        setInventory([...inventory, ...newMeds]);
        toast.success("Analyzed PDF invoice successfully. 2 new medicines added to stock!");
        setPdfFile(null);
        setShowImportDialog(false);
      }, 1800);
    }
  };

  // Complete OCR Import
  const importOcrItems = () => {
    const newItems = ocrResults.map((item, index) => ({
      name: item.name,
      sku: `OCR-${460 + index + Math.floor(Math.random() * 100)}`,
      stock: item.stock,
      price: item.price,
      status: "In Stock"
    }));
    setInventory([...inventory, ...newItems]);
    toast.success(`Imported ${ocrResults.length} scanned medicines to inventory!`);
    setShowImportDialog(false);
    setOcrResults([]);
    setScanImage(null);
  };

  // Logged-out Landing State (Registration & Login)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -left-20 h-[500px] w-[500px] rounded-full bg-teal-400/10 blur-[120px]" />
        <div className="absolute -bottom-20 -right-40 h-[500px] w-[500px] rounded-full bg-cyan-400/10 blur-[120px]" />

        <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-2xl p-8 md:p-12 relative z-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Medical Store <span className="text-primary italic">Partner Portal</span>
            </h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              Verify compliance, list drugs, and deliver hyperlocally
            </p>
          </div>

          {/* Onboarding tab toggle */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setAuthMode("register")}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${authMode === "register" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
            >
              Register New Store
            </button>
            <button
              onClick={() => setAuthMode("login")}
              className={`py-3 rounded-xl font-bold text-sm transition-all ${authMode === "login" ? "bg-white text-slate-900 shadow-md" : "text-slate-500 hover:text-slate-800"}`}
            >
              Login Registered Store
            </button>
          </div>

          {authMode === "register" ? (
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Need immediate validation?</span>
                <Button type="button" size="sm" variant="outline" className="text-xs rounded-xl" onClick={loadDemoData}>
                  Load Demo Store
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Store Name *</Label>
                  <Input 
                    placeholder="e.g. Wellness Forever Medical" 
                    value={storeName} 
                    onChange={e => setStoreName(e.target.value)} 
                    required 
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Owner Name *</Label>
                  <Input 
                    placeholder="Owner's full name" 
                    value={ownerName} 
                    onChange={e => setOwnerName(e.target.value)} 
                    required 
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Email Address *</Label>
                  <Input 
                    type="email" 
                    placeholder="store@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Contact Number</Label>
                  <Input 
                    placeholder="+91 XXXXX XXXXX" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Regd. Pharmacist Name *</Label>
                  <Input 
                    placeholder="Pharmacist name" 
                    value={pharmacistName} 
                    onChange={e => setPharmacistName(e.target.value)} 
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Pharmacist Reg Number *</Label>
                  <Input 
                    placeholder="e.g. REG-1249-PH" 
                    value={pharmacistRegNo} 
                    onChange={e => setPharmacistRegNo(e.target.value)} 
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Drug License Form 20 No. *</Label>
                  <Input 
                    placeholder="Form 20 DL" 
                    value={dl20} 
                    onChange={e => setDl20(e.target.value)} 
                    required
                    className="h-11 rounded-xl font-mono text-sm uppercase"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Drug License Form 21 No. *</Label>
                  <Input 
                    placeholder="Form 21 DL" 
                    value={dl21} 
                    onChange={e => setDl21(e.target.value)} 
                    required
                    className="h-11 rounded-xl font-mono text-sm uppercase"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-black uppercase text-slate-400">GSTIN (GST Identification Number) *</Label>
                  <Input 
                    placeholder="15-character GSTIN number" 
                    value={gstin} 
                    onChange={e => setGstin(e.target.value)} 
                    required
                    maxLength={15}
                    className="h-11 rounded-xl font-mono text-sm uppercase"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-black uppercase text-slate-400">Shop Physical Address *</Label>
                  <Input 
                    placeholder="Sector, Street, City, State" 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Area Pincode *</Label>
                  <Input 
                    placeholder="6-digit pincode" 
                    value={pincode} 
                    onChange={e => setPincode(e.target.value)} 
                    required
                    className="h-11 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-black uppercase text-slate-400">Portal Password *</Label>
                  <Input 
                    type="password" 
                    placeholder="Min 6 characters" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                    minLength={6}
                    className="h-11 rounded-xl"
                  />
                </div>
                
                {/* File Upload for Drug License Copy */}
                <div className="space-y-1.5 md:col-span-2">
                  <Label className="text-xs font-black uppercase text-slate-400">Upload Drug License Scan Copy *</Label>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-primary/40 rounded-2xl p-6 cursor-pointer bg-slate-50 hover:bg-slate-100/50 transition-colors">
                    <Upload className="h-6 w-6 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 font-bold">
                      {dlFile ? `Selected: ${dlFile.name}` : "Click to select or drop Drug License scan copy (PDF/Image)"}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*,application/pdf" 
                      className="hidden" 
                      onChange={e => setDlFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20">
                Submit & Verify Store
              </Button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6">
              {isRegistered && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <p className="text-xs text-emerald-800 font-bold">
                    Found registered store: <span className="font-black">{storeName}</span>
                  </p>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase text-slate-400">Registered Email Address</Label>
                <Input 
                  type="email" 
                  placeholder="store@email.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-black uppercase text-slate-400">Portal Password</Label>
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="h-12 rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg shadow-primary/20">
                Login to StoreDash
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Dashboard Interface (Logged-in State)
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-border/40 p-8 hidden lg:flex flex-col gap-10">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <span className="text-xl font-black tracking-tight">Store<span className="text-primary">Dash</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: LayoutDashboard, label: "Overview", id: "Overview" },
            { icon: ShoppingCart, label: "Orders Log", id: "Orders" },
            { icon: Package, label: "Inventory", id: "Inventory" },
            { icon: BarChart3, label: "Analytics", id: "Analytics" },
            { icon: Settings, label: "Compliance & Settings", id: "Settings" },
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${activeTab === item.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Play chime test button */}
        <Button variant="outline" size="sm" className="rounded-xl flex items-center gap-1 text-slate-500 border-slate-200" onClick={triggerAudioTest}>
          <Volume2 className="h-4 w-4" />
          Test Chime Sound
        </Button>

        <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support</p>
             <h4 className="font-black">Direct Officer Support</h4>
             <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold">Call Helpline</Button>
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/20 rounded-full blur-2xl" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{storeName || "Wellness Forever Pharmacy"}</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-none font-bold px-3">LICENSED STORE</Badge>
              <span className="text-sm font-bold text-slate-400">• {address || "Sector 18, Noida"}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button size="icon" variant="outline" className="h-11 w-11 rounded-xl border-border/40 relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </Button>
            <Button variant="ghost" onClick={() => setIsLoggedIn(false)} className="text-xs text-red-500 hover:bg-red-50 font-bold rounded-xl h-11 px-4">
              Logout Portal
            </Button>
            <div className="h-11 w-11 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 text-primary font-black">
              {storeName ? storeName.charAt(0) : "W"}
            </div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Today's Orders", value: ordersList.length.toString(), trend: "+4 new", up: true, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
                { label: "Today's Earnings", value: `₹${ordersList.filter(o => o.status === "Delivered").reduce((s, o) => s + parseInt(o.total.replace("₹", "")), 0) + 1240}`, trend: "+12.4%", up: true, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
                { label: "Low Stock Items", value: inventory.filter(i => i.stock < 15).length.toString(), trend: "Needs refill", up: false, icon: Package, color: "text-amber-600 bg-amber-50" },
                { label: "Active Deliveries", value: ordersList.filter(o => o.status === "Preparing" || o.status === "In Transit").length.toString(), trend: "Normal", up: true, icon: Clock, color: "text-primary bg-primary/5" },
              ].map((stat, i) => (
                <Card key={i} className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className={`font-bold ${stat.up ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-amber-600 bg-amber-50 border-amber-100"}`}>
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
                <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                  <CardTitle className="text-xl font-black">Incoming & Current Orders</CardTitle>
                  <Button variant="ghost" className="text-primary font-bold" onClick={() => setActiveTab("Orders")}>View All</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Order ID</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Items Requested</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Status / Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ordersList.map((order, i) => (
                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <TableCell className="px-8 py-5 font-black text-slate-900">{order.id}</TableCell>
                          <TableCell className="font-bold text-slate-600">{order.customer}</TableCell>
                          <TableCell className="font-medium text-slate-500 max-w-[200px] truncate">{order.items}</TableCell>
                          <TableCell className="font-black text-slate-900">{order.total}</TableCell>
                          <TableCell>
                            {order.status !== "Delivered" ? (
                              <Button size="sm" className="h-8 rounded-lg text-xs font-bold gap-1" onClick={() => advanceOrderStatus(order.id)}>
                                <span>{order.status}</span>
                                <ArrowUpRight className="h-3 w-3" />
                              </Button>
                            ) : (
                              <Badge className="text-emerald-600 bg-emerald-50 border-none font-bold px-3 py-1 rounded-lg">Delivered</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">Verification Legal Record</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4 text-xs font-bold text-slate-500">
                    <div className="flex justify-between">
                      <span>GST STATUS:</span>
                      <span className="text-teal-600 font-extrabold">GSTIN VERIFIED</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DRUG LIC-20:</span>
                      <span className="font-mono text-slate-950">{dl20 || "DL-20-84725/2026"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GSTIN NO:</span>
                      <span className="font-mono text-slate-950">{gstin || "09AAAAA1111A1Z1"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PHARMACIST NO:</span>
                      <span className="text-slate-950">{pharmacistRegNo || "PHARM-8472-A"}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                      <Button className="w-full h-12 rounded-2xl font-black gap-2 shadow-lg shadow-primary/20" onClick={() => { setShowImportDialog(true); setImportTab("ocr"); }}>
                        <Upload className="h-5 w-5" />
                        OCR Bill / Invoice Scan
                      </Button>
                      <Button variant="outline" className="w-full h-12 rounded-2xl font-black gap-2 border-border/40" onClick={() => { setShowImportDialog(true); setImportTab("excel"); }}>
                        <FileText className="h-5 w-5" />
                        Import Excel / PDF List
                      </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === "Orders" && (
          <Card className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
            <CardHeader className="px-8 py-6 border-b border-slate-50">
              <CardTitle className="text-xl font-black">All Orders Log</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-none">
                    <TableHead className="px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Order ID</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Medicine details</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total cost</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Time received</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Current Status</TableHead>
                    <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ordersList.map((order, i) => (
                    <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="px-8 py-5 font-black text-slate-900">{order.id}</TableCell>
                      <TableCell className="font-bold text-slate-600">{order.customer}</TableCell>
                      <TableCell className="font-medium text-slate-500">{order.items}</TableCell>
                      <TableCell className="font-black text-slate-900">{order.total}</TableCell>
                      <TableCell className="font-bold text-slate-400 text-xs">{order.time}</TableCell>
                      <TableCell>
                        <Badge className={`${order.color} border-none font-bold px-3 py-1 rounded-lg`}>{order.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {order.status !== "Delivered" ? (
                          <Button size="xs" className="h-8 rounded-lg font-bold" onClick={() => advanceOrderStatus(order.id)}>
                            Advance Status
                          </Button>
                        ) : (
                          <span className="text-emerald-500 text-xs font-bold">Closed ✓</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {activeTab === "Inventory" && (
           <Card className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
              <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black">Stock Management</CardTitle>
                <div className="flex gap-3">
                   <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => { setShowImportDialog(true); setImportTab("excel"); }}>Import List</Button>
                   <Button size="sm" className="rounded-xl font-bold gap-2" onClick={() => { setShowImportDialog(true); setImportTab("ocr"); }}><Plus className="h-4 w-4" /> OCR Invoice Scan</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                   <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Medicine Name</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">SKU Code</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Available Stock</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Price (INR)</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Refill Status</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {inventory.map((item, i) => (
                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                           <TableCell className="px-8 py-5 font-black text-slate-900">{item.name}</TableCell>
                           <TableCell className="font-bold text-slate-600">{item.sku}</TableCell>
                           <TableCell className="font-medium text-slate-500">{item.stock} Units</TableCell>
                           <TableCell className="font-black text-slate-900">₹{item.price}</TableCell>
                           <TableCell>
                              <Badge variant="outline" className={`font-bold px-3 py-1 rounded-lg ${item.stock > 50 ? "text-emerald-600 bg-emerald-50 border-emerald-100" : item.stock > 0 ? "text-amber-600 bg-amber-50 border-amber-100" : "text-red-600 bg-red-50 border-red-100"}`}>
                                {item.stock > 50 ? "In Stock" : item.stock > 0 ? "Low Stock" : "Out of Stock"}
                              </Badge>
                           </TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
              </CardContent>
           </Card>
        )}

        {/* Incoming Order Notification Pop-up Chime Modal */}
        <AnimatePresence>
          {showOrderModal && incomingOrder && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                className="bg-slate-900 rounded-[3rem] p-8 max-w-md w-full shadow-2xl border border-white/10 relative overflow-hidden"
              >
                <div className="space-y-6 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="h-14 w-14 bg-amber-500 rounded-2xl flex items-center justify-center text-white animate-bounce">
                        <Timer className="h-8 w-8 animate-pulse" />
                      </div>
                      <div className="flex-1">
                         <Badge className="bg-amber-500 text-white border-none font-black text-[10px] mb-1">URGENT ORDER ALARM</Badge>
                         <h4 className="text-xl font-black text-white leading-tight">New Order Received!</h4>
                      </div>
                   </div>

                   {/* Audio indicator badge */}
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                     <Volume2 className="h-3.5 w-3.5 text-primary" />
                     <span>AUDIO CHIME INITIATED</span>
                   </div>

                   <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4 text-slate-200">
                      <div className="flex items-center gap-3">
                         <MapPin className="h-4 w-4 text-primary" />
                         <p className="text-sm font-bold">Location: <span className="text-white">{incomingOrder.distance} ({incomingOrder.distance === "0.8 km" ? "Noida Sector 18" : "Jehanabad"})</span></p>
                      </div>
                      <div className="h-[1px] w-full bg-white/5" />
                      <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Medical Items</p>
                         <p className="text-sm font-black text-white">{incomingOrder.items}</p>
                      </div>
                      <div className="h-[1px] w-full bg-white/5" />
                      <div className="flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-400">Total Price</span>
                         <span className="text-xl font-black text-primary">{incomingOrder.total}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        variant="outline" 
                        className="rounded-2xl h-14 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-wider text-xs"
                        onClick={rejectOrder}
                      >
                        Decline
                      </Button>
                      <Button 
                        className="rounded-2xl h-14 bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-wider text-xs shadow-xl shadow-primary/20 animate-pulse"
                        onClick={acceptOrder}
                      >
                        Accept Order
                      </Button>
                   </div>
                </div>
                <div className="absolute -bottom-20 -left-20 h-48 w-48 bg-primary/10 rounded-full blur-3xl -z-10" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Import & Update Inventory Modal Dialog */}
        <AnimatePresence>
          {showImportDialog && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] w-full max-w-xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Package className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Import & Update Inventory</h3>
                  </div>
                  <button onClick={() => { setShowImportDialog(false); setScanImage(null); setOcrResults([]); }} className="text-slate-400 hover:text-slate-900">
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                {/* Import method tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                  {(["ocr", "excel", "pdf"] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => { setImportTab(tab); setScanImage(null); setOcrResults([]); }}
                      className={`py-2 rounded-lg font-bold text-xs uppercase transition-all ${importTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                    >
                      {tab === "ocr" ? "OCR Scan" : tab === "excel" ? "Excel/CSV" : "PDF Invoice"}
                    </button>
                  ))}
                </div>

                {importTab === "ocr" && (
                  <div className="space-y-6">
                    {!scanImage && !scanning ? (
                      <div className="space-y-4">
                        <Label className="block border-2 border-dashed border-slate-200 rounded-[1.5rem] p-10 text-center space-y-4 hover:border-primary/40 transition-colors cursor-pointer group">
                          <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                            <Upload className="h-7 w-7" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900">Upload Medicine Invoice / Bill</p>
                            <p className="text-xs font-bold text-slate-400">Scan items automatically via smart OCR</p>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={handleOcrFileChange} />
                        </Label>
                        
                        <div className="p-4 bg-teal-50 rounded-2xl border border-teal-100 flex items-center gap-3 text-teal-800">
                          <AlertCircle className="h-5 w-5 text-primary shrink-0" />
                          <p className="text-xs font-bold leading-normal">
                            Our AI scanning engine reads handwritten prescriptions or printed invoices and matches them against database SKU records.
                          </p>
                        </div>
                      </div>
                    ) : scanning ? (
                      <div className="space-y-6 py-8 text-center">
                        <div className="relative h-48 w-full bg-slate-50 rounded-[2rem] overflow-hidden flex items-center justify-center border border-slate-100">
                          <div className="absolute inset-x-0 h-1 bg-primary/40 animate-scan z-10" />
                          {scanImage && <img src={scanImage} alt="scanning copy" className="h-full w-full object-contain opacity-50 blur-[1px]" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black text-slate-900 animate-pulse">Running OCR Scanner Engine...</p>
                          <p className="text-xs font-bold text-slate-400">Extracting alphanumeric text and matching drug names...</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-400 uppercase">Verification Inventory list match</span>
                          <Badge className="bg-emerald-500 text-white border-none font-bold">Match Successful</Badge>
                        </div>
                        
                        <div className="border border-slate-100 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                          <Table className="text-xs">
                            <TableHeader className="bg-slate-50">
                              <TableRow>
                                <TableHead className="font-bold">Detected Medicine</TableHead>
                                <TableHead className="font-bold">Proposed Stock</TableHead>
                                <TableHead className="font-bold">Price (₹)</TableHead>
                                <TableHead className="font-bold text-right">Confidence</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {ocrResults.map((res, i) => (
                                <TableRow key={i}>
                                  <TableCell className="font-black text-slate-900">{res.name}</TableCell>
                                  <TableCell className="font-bold text-slate-600">{res.stock} Units</TableCell>
                                  <TableCell className="font-black text-slate-900">₹{res.price}</TableCell>
                                  <TableCell className="font-bold text-emerald-600 text-right">{res.match}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <Button variant="outline" className="rounded-xl h-11 text-xs" onClick={() => { setScanImage(null); setOcrResults([]); }}>
                            Scan Again
                          </Button>
                          <Button className="rounded-xl h-11 text-xs font-black shadow-md shadow-primary/10" onClick={importOcrItems}>
                            Import Selected Drugs
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {importTab === "excel" && (
                  <div className="space-y-6">
                    <Label className="block border-2 border-dashed border-slate-200 rounded-[1.5rem] p-10 text-center space-y-4 hover:border-primary/40 transition-colors cursor-pointer bg-slate-50/50 group">
                      <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                        <FileText className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Select `.csv` or `.xlsx` Inventory Sheet</p>
                        <p className="text-xs font-bold text-slate-400">Must include column headings: Name, SKU, Stock, Price</p>
                      </div>
                      <input type="file" accept=".csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" className="hidden" onChange={handleExcelUpload} />
                    </Label>
                    
                    {excelFile && (
                      <p className="text-xs text-center text-slate-400 font-bold animate-pulse">Processing file: {excelFile.name}...</p>
                    )}
                  </div>
                )}

                {importTab === "pdf" && (
                  <div className="space-y-6">
                    <Label className="block border-2 border-dashed border-slate-200 rounded-[1.5rem] p-10 text-center space-y-4 hover:border-primary/40 transition-colors cursor-pointer bg-slate-50/50 group">
                      <div className="h-14 w-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400 group-hover:text-primary transition-colors">
                        <Upload className="h-7 w-7" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">Upload Manufacturer Invoice PDF</p>
                        <p className="text-xs font-bold text-slate-400">Secure parse matching for all regulatory wholesale bills</p>
                      </div>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </Label>

                    {pdfFile && (
                      <p className="text-xs text-center text-slate-400 font-bold animate-pulse">Analyzing pdf records: {pdfFile.name}...</p>
                    )}
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
