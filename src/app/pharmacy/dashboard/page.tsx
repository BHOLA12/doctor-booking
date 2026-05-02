"use client";

import { useState, useEffect } from "react";
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
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// UI components imported from shadcn/ui
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";

export default function SellerDashboard() {
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [orderAccepted, setOrderAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  // Simulate an incoming order after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewOrder(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

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
            { icon: ShoppingCart, label: "Orders", id: "Orders" },
            { icon: Package, label: "Inventory", id: "Inventory" },
            { icon: BarChart3, label: "Analytics", id: "Analytics" },
            { icon: History, label: "History", id: "History" },
            { icon: Settings, label: "Settings", id: "Settings" },
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

        <div className="p-6 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Support</p>
             <h4 className="font-black">Need Help?</h4>
             <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold">Contact Support</Button>
          </div>
          <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-primary/20 rounded-full blur-2xl" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Wellness Forever Pharmacy</h1>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3">OPEN</Badge>
              <span className="text-sm font-bold text-slate-400">• Sector 18, Noida</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input placeholder="Search orders..." className="pl-10 h-11 w-64 rounded-xl border-border/40" />
            </div>
            <Button size="icon" variant="outline" className="h-11 w-11 rounded-xl border-border/40 relative">
              <Bell className="h-5 w-5 text-slate-600" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
            </Button>
            <div className="h-11 w-11 bg-slate-200 rounded-xl overflow-hidden border border-border/40">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lucky" alt="avatar" className="h-full w-full object-cover" />
            </div>
          </div>
        </header>

        {activeTab === "Overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { label: "Today's Orders", value: "24", trend: "+12%", up: true, icon: ShoppingCart, color: "text-blue-600 bg-blue-50" },
                { label: "Today's Earnings", value: "₹12,450", trend: "+8.5%", up: true, icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
                { label: "Low Stock Items", value: "05", trend: "-2", up: false, icon: Package, color: "text-amber-600 bg-amber-50" },
                { label: "Active Deliveries", value: "08", trend: "Normal", up: true, icon: Clock, color: "text-primary bg-primary/5" },
              ].map((stat, i) => (
                <Card key={i} className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                      <Badge variant="outline" className={`font-bold ${stat.up ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-100"}`}>
                        {stat.up ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
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
                  <CardTitle className="text-xl font-black">Recent Orders</CardTitle>
                  <Button variant="ghost" className="text-primary font-bold">View All</Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Order ID</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Customer</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Items</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Total</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: "#DB-4521", customer: "Rahul Sharma", items: "3 Items", total: "₹840", status: "Delivered", color: "text-emerald-600 bg-emerald-50" },
                        { id: "#DB-4522", customer: "Priya Singh", items: "1 Item", total: "₹1,200", status: "In Transit", color: "text-blue-600 bg-blue-50" },
                        { id: "#DB-4523", customer: "Amit Patel", items: "5 Items", total: "₹450", status: "Preparing", color: "text-amber-600 bg-amber-50" },
                        { id: "#DB-4524", customer: "Sneha Roy", items: "2 Items", total: "₹2,100", status: "Preparing", color: "text-amber-600 bg-amber-50" },
                      ].map((order, i) => (
                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                          <TableCell className="px-8 py-5 font-black text-slate-900">{order.id}</TableCell>
                          <TableCell className="font-bold text-slate-600">{order.customer}</TableCell>
                          <TableCell className="font-medium text-slate-500">{order.items}</TableCell>
                          <TableCell className="font-black text-slate-900">{order.total}</TableCell>
                          <TableCell>
                            <Badge className={`${order.color} border-none font-bold px-3 py-1 rounded-lg`}>{order.status}</Badge>
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
                    <CardTitle className="text-xl font-black">Performance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8">
                     <div className="flex items-center justify-between mb-8">
                        <div className="space-y-1">
                           <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rating</p>
                           <div className="flex items-center gap-1">
                              <h4 className="text-3xl font-black text-slate-900">4.8</h4>
                              <ArrowUpRight className="h-5 w-5 text-emerald-500" />
                           </div>
                        </div>
                        <div className="h-14 w-14 bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-100">
                           <BarChart3 className="h-7 w-7 text-amber-600" />
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full w-[85%] bg-primary" />
                        </div>
                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
                           <span>Service Quality</span>
                           <span>85%</span>
                        </div>
                     </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
                  <CardHeader className="px-8 py-6 border-b border-slate-50">
                    <CardTitle className="text-xl font-black">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-4">
                      <Button className="w-full h-12 rounded-2xl font-black gap-2 shadow-lg shadow-primary/20">
                        <Plus className="h-5 w-5" />
                        Add New Product
                      </Button>
                      <Button variant="outline" className="w-full h-12 rounded-2xl font-black gap-2 border-border/40">
                        <History className="h-5 w-5" />
                        Inventory Logs
                      </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === "Inventory" && (
           <Card className="border-border/40 rounded-[2.5rem] shadow-sm overflow-hidden bg-white">
              <CardHeader className="px-8 py-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-black">Stock Management</CardTitle>
                <div className="flex gap-3">
                   <Button variant="outline" size="sm" className="rounded-xl font-bold">Export CSV</Button>
                   <Button size="sm" className="rounded-xl font-bold gap-2"><Plus className="h-4 w-4" /> Add Item</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                   <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="px-8 font-black text-slate-400 uppercase text-[10px] tracking-widest">Medicine</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">SKU</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Stock</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Price</TableHead>
                        <TableHead className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Status</TableHead>
                      </TableRow>
                   </TableHeader>
                   <TableBody>
                      {[
                        { name: "Crocin 500mg", sku: "MED-450", stock: "240 Units", price: "₹28", status: "In Stock" },
                        { name: "Dolo 650", sku: "MED-451", stock: "12 Units", price: "₹30", status: "Low Stock" },
                        { name: "Azithral 500", sku: "MED-452", stock: "85 Units", price: "₹72", status: "In Stock" },
                        { name: "Metformin 500", sku: "MED-453", stock: "0 Units", price: "₹45", status: "Out of Stock" },
                      ].map((item, i) => (
                        <TableRow key={i} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                           <TableCell className="px-8 py-5 font-black text-slate-900">{item.name}</TableCell>
                           <TableCell className="font-bold text-slate-600">{item.sku}</TableCell>
                           <TableCell className="font-medium text-slate-500">{item.stock}</TableCell>
                           <TableCell className="font-black text-slate-900">{item.price}</TableCell>
                           <TableCell>
                              <Badge variant="outline" className={`font-bold px-3 py-1 rounded-lg ${item.status === "In Stock" ? "text-emerald-600 bg-emerald-50 border-emerald-100" : item.status === "Low Stock" ? "text-amber-600 bg-amber-50 border-amber-100" : "text-red-600 bg-red-50 border-red-100"}`}>
                                {item.status}
                              </Badge>
                           </TableCell>
                        </TableRow>
                      ))}
                   </TableBody>
                </Table>
              </CardContent>
           </Card>
        )}

        {/* Incoming Order Notification (The "Zepto" Engine) */}
        <AnimatePresence>
          {showNewOrder && !orderAccepted && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="fixed bottom-10 right-10 z-[100] max-w-sm w-full"
            >
              <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden ring-8 ring-slate-900/10">
                 <div className="absolute top-0 right-0 p-4">
                   <button onClick={() => setShowNewOrder(false)} className="text-slate-500 hover:text-white transition-colors">
                     <XCircle className="h-6 w-6" />
                   </button>
                 </div>

                 <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white animate-pulse">
                         <Timer className="h-7 w-7" />
                       </div>
                       <div className="flex-1">
                          <Badge className="bg-amber-500 text-white border-none font-black text-[10px] mb-1">URGENT REQUEST</Badge>
                          <h4 className="text-lg font-black text-white leading-tight">Incoming Order!</h4>
                       </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                       <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-primary" />
                          <p className="text-sm font-bold text-slate-300">Delivery to: <span className="text-white">1.2 km away</span></p>
                       </div>
                       <div className="h-[1px] w-full bg-white/5" />
                       <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Items Requested</p>
                          <ul className="text-sm font-bold text-white space-y-1">
                             <li>• Crocin 500mg x 2</li>
                             <li>• Dolo 650 x 1</li>
                          </ul>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <Button 
                         variant="outline" 
                         className="rounded-2xl h-14 border-white/10 text-white hover:bg-white/5 font-black uppercase tracking-wider"
                         onClick={() => setShowNewOrder(false)}
                       >
                         Reject
                       </Button>
                       <Button 
                         className="rounded-2xl h-14 bg-primary hover:bg-primary-dark text-white font-black uppercase tracking-wider shadow-xl shadow-primary/20"
                         onClick={() => setOrderAccepted(true)}
                       >
                         Accept
                       </Button>
                    </div>
                 </div>
                 <div className="absolute -bottom-20 -left-20 h-48 w-48 bg-primary/10 rounded-full blur-3xl -z-10" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success State */}
        <AnimatePresence>
          {orderAccepted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-10 right-10 z-[100] max-w-sm w-full bg-emerald-500 p-8 rounded-[2.5rem] shadow-2xl text-white flex items-center gap-4"
            >
               <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <CheckCircle2 className="h-7 w-7" />
               </div>
               <div>
                  <h4 className="font-black text-lg leading-tight">Order Accepted!</h4>
                  <p className="text-emerald-50 font-bold text-sm">Now preparing for delivery.</p>
               </div>
               <Button size="sm" variant="ghost" className="text-white font-bold ml-auto" onClick={() => setOrderAccepted(false)}>Dismiss</Button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
