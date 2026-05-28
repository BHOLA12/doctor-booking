"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, ArrowUpRight, Sparkles, Cpu, Check, RotateCcw, Volume2, Store, MapPin, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MEDICINES } from "@/lib/medicines-data";
import { toast } from "sonner";

type AssistantState = "idle" | "listening" | "processing" | "success";

export default function VoiceAssistantSection() {
  const { user } = useAuth();
  const router = useRouter();
  const [currentState, setCurrentState] = useState<AssistantState>("idle");
  const [transcript, setTranscript] = useState("");
  const [mockIntervalId, setMockIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [matchedMed, setMatchedMed] = useState({
    symptom: "Fever & Joint Pain",
    name: "Paracetamol 650mg",
    query: "paracetamol",
    chemist: "Jehanabad Pharmacy",
    savings: "35% Lower Price! 🟢"
  });

  const getSymptomFromTranscript = (text: string, matchedMedName: string, matchedCategory: string) => {
    const t = text.toLowerCase();
    if (t.includes("dehydration") || t.includes("weakness") || t.includes("energy")) return "Dehydration / Weakness";
    if (t.includes("fever") || t.includes("temp")) return "Fever";
    if (t.includes("pain") || t.includes("headache") || t.includes("head") || t.includes("hurt")) return "Body Pain / Headache";
    if (t.includes("cough") || t.includes("cold") || t.includes("throat")) return "Cough & Cold";
    if (t.includes("sugar") || t.includes("diabetes")) return "Diabetes / High Sugar";
    if (t.includes("gas") || t.includes("acidity") || t.includes("stomach")) return "Acidity & Gastric Issue";
    return `${matchedCategory} (${matchedMedName})`;
  };

  const findBestMedicineMatch = (text: string) => {
    const t = text.toLowerCase();
    
    // 1. Try to find direct match in name or salt
    for (const m of MEDICINES) {
      if (t.includes(m.name.toLowerCase()) || t.includes(m.salt.toLowerCase())) {
        return m;
      }
    }

    // 2. Try matching individual words (excluding common filler words)
    const fillerWords = new Set(["i", "need", "a", "fast", "delivery", "for", "and", "near", "please", "me", "the", "to", "of", "some"]);
    const words = t.split(/[\s,._\-]+/);
    
    for (const word of words) {
      if (word.length < 3 || fillerWords.has(word)) continue;
      
      const found = MEDICINES.find(m => 
        m.name.toLowerCase().includes(word) || 
        m.salt.toLowerCase().includes(word) ||
        m.category.toLowerCase().includes(word)
      );
      if (found) return found;
    }

    // 3. Fallback semantic checks for common symptoms if no direct word match
    if (t.includes("fever") || t.includes("temp") || t.includes("cold")) {
      return MEDICINES.find(m => m.id === "m2") || MEDICINES[0]; // Dolo 650 / Crocin
    }
    if (t.includes("pain") || t.includes("headache") || t.includes("hurt")) {
      return MEDICINES.find(m => m.id === "m11") || MEDICINES[0]; // Combiflam / Crocin
    }
    if (t.includes("dehydration") || t.includes("weakness") || t.includes("energy") || t.includes("hydrate")) {
      return MEDICINES.find(m => m.id === "m12") || MEDICINES[0]; // Glucon-D (for dehydration)
    }
    if (t.includes("cough") || t.includes("throat")) {
      return MEDICINES.find(m => m.id === "m18") || MEDICINES[0]; // Cetirizine
    }
    if (t.includes("gas") || t.includes("acidity") || t.includes("stomach")) {
      return MEDICINES.find(m => m.id === "m8") || MEDICINES[0]; // Pantop 40
    }
    if (t.includes("diabetes") || t.includes("sugar")) {
      return MEDICINES.find(m => m.id === "m4") || MEDICINES[0]; // Metformin 500
    }

    // Default fallback
    return MEDICINES[0];
  };

  const runMockSpeechSimulation = () => {
    setTranscript("");
    let phraseIdx = 0;
    const listeningPhrases = [
      "I need",
      "I need a fast delivery",
      "I need a fast delivery for paracetamol",
      "I need a fast delivery for paracetamol and pain killer",
      "I need a fast delivery for paracetamol and pain killer near Jehanabad",
    ];

    const interval = setInterval(() => {
      if (phraseIdx < listeningPhrases.length) {
        setTranscript(listeningPhrases[phraseIdx]);
        phraseIdx++;
      } else {
        clearInterval(interval);
        setMockIntervalId(null);
        setCurrentState("processing");
      }
    }, 700);

    setMockIntervalId(interval);
  };

  const speakText = (text: string, lang: string = "hi-IN") => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.toLowerCase().includes(lang.toLowerCase()));
      if (voice) {
        utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  const startRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setCurrentState("listening");
      runMockSpeechSimulation();
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-IN";

      rec.onstart = () => {
        setCurrentState("listening");
        setTranscript("Listening for symptoms...");
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (err: any) => {
        console.error("Speech recognition error:", err);
        setCurrentState("listening");
        runMockSpeechSimulation();
      };

      rec.onend = () => {
        setCurrentState("processing");
      };

      rec.start();
    } catch (e) {
      console.error("Failed to start SpeechRecognition:", e);
      setCurrentState("listening");
      runMockSpeechSimulation();
    }
  };

  const handleStartListening = () => {
    if (currentState === "idle" || currentState === "success") {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("मैं सुन रहा हूँ, please describe your symptoms.");
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        utterance.lang = "hi-IN";
        
        utterance.onend = () => {
          startRecognition();
        };

        setCurrentState("listening");
        setTranscript("Assistant preparing...");
        window.speechSynthesis.speak(utterance);
      } else {
        startRecognition();
      }
    }
  };

  const handleReset = () => {
    if (mockIntervalId) {
      clearInterval(mockIntervalId);
      setMockIntervalId(null);
    }
    speakText("असिस्टेंट रीसेट कर दिया गया है।");
    setCurrentState("idle");
    setTranscript("");
  };

  const handleDirectOrder = async () => {
    if (!user) {
      toast.error("Please login to place an order");
      router.push("/login?redirect=/");
      return;
    }

    setIsPlacing(true);
    try {
      // Find the medicine in our dataset
      const med = MEDICINES.find(m => 
        m.name.toLowerCase().includes(matchedMed.query.toLowerCase()) || 
        m.salt.toLowerCase().includes(matchedMed.query.toLowerCase())
      ) || MEDICINES.find(m => 
        m.name.toLowerCase().includes(matchedMed.name.toLowerCase()) || 
        m.salt.toLowerCase().includes(matchedMed.name.toLowerCase())
      );

      const item = med ? {
        medicineId: med.id,
        name: med.name,
        price: med.price,
        quantity: 1,
        imageEmoji: med.imageEmoji,
        dosage: med.dosage,
        manufacturer: med.manufacturer,
      } : {
        medicineId: "custom-" + matchedMed.query,
        name: matchedMed.name,
        price: 45, // default fallback price
        quantity: 1,
        imageEmoji: "💊",
        dosage: "15 Tablets",
        manufacturer: "Generic",
      };

      const payload = {
        items: [item],
        totalAmount: item.price,
        address: user.name ? `Delivery to ${user.name}'s address` : "Direct Voice Order Address",
        phone: undefined,
      };

      const res = await fetch("/api/orders/medicine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success("Order placed successfully! 🎉", {
          description: `Order #${data.data.id.slice(-8).toUpperCase()} confirmed — medicines on the way!`,
          duration: 4000,
        });
        router.push(`/orders/${data.data.id}/track`);
      } else {
        toast.error(data.error || "Failed to place order. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error. Please check your connection.");
    } finally {
      setIsPlacing(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentState === "processing") {
      const t = transcript || "paracetamol";
      const matchedMedicine = findBestMedicineMatch(t);
      const symptom = getSymptomFromTranscript(t, matchedMedicine.name, matchedMedicine.category);
      
      const chemists = ["Hindustan Medical Hall", "Jehanabad Pharmacy", "Ajay Medical Hall", "Green Medical Hall", "Gudvil Medical Hall"];
      const chemistIndex = Math.abs(matchedMedicine.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % chemists.length;
      const chemist = chemists[chemistIndex];
      const savings = `${matchedMedicine.discount}% Lower Price! 🟢`;

      setMatchedMed({
        symptom,
        name: matchedMedicine.name,
        query: matchedMedicine.id,
        chemist,
        savings
      });

      // Language detection helper
      const detectLanguage = (text: string): "hi" | "en" => {
        const textLower = text.toLowerCase();
        
        // Detect Devanagari script characters
        if (/[\u0900-\u097F]/.test(text)) return "hi";
        
        // Detect common Hinglish terms for medical issues
        const hindiWords = [
          "dard", "bukhar", "khansi", "sardi", "jukaam", "zukam", "pet",
          "gas", "kamzori", "thakan", "chakar", "ulti", "goli", "dawai", "badan"
        ];
        if (hindiWords.some(word => textLower.includes(word))) {
          return "hi";
        }
        return "en";
      };

      const lang = detectLanguage(t);
      let speakMsg = "";
      let speakLang = "en-IN";

      if (lang === "hi") {
        const getHindiSymptom = (sName: string) => {
          const s = sName.toLowerCase();
          if (s.includes("dehydration")) return "डीहाइड्रेशन और कमजोरी";
          if (s.includes("fever")) return "बुखार";
          if (s.includes("pain") || s.includes("headache")) return "शरीर दर्द और सिर दर्द";
          if (s.includes("cough") || s.includes("cold")) return "खांसी और जुकाम";
          if (s.includes("sugar") || s.includes("diabetes")) return "डायबिटीज";
          if (s.includes("gas") || s.includes("acidity")) return "एसिडिटी और गैस";
          return sName;
        };

        const hindiSymptom = getHindiSymptom(symptom);
        speakMsg = `मुझे आपके लक्षण के लिए दवा मिल गई है। ${hindiSymptom} के लिए, मैं ${matchedMedicine.name} लेने की सलाह देता हूँ, जो आपको ${chemist} पर मिल जाएगी। इससे आपकी ${matchedMedicine.discount} प्रतिशत बचत होगी। आर्डर करने के लिए आर्डर नाओ बटन दबाएँ।`;
        speakLang = "hi-IN";
      } else {
        speakMsg = `I found a medicine recommendation. For ${symptom}, I suggest ${matchedMedicine.name} from ${chemist}, saving you ${matchedMedicine.discount} percent. You can click the order now button to place your order.`;
        speakLang = "en-IN";
      }

      // Speak out the suggestion in the matched language
      speakText(speakMsg, speakLang);

      timer = setTimeout(() => {
        setCurrentState("success");
      }, 2500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [currentState]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Waveform heights configuration
  const waveHeights = [24, 40, 16, 48, 32, 56, 28, 44, 20];

  return (
    <section className="relative py-24 bg-[#030712] overflow-hidden border-b border-slate-900">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: INTERACTIVE VISUALIZER */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div 
              onClick={currentState === "idle" ? handleStartListening : undefined}
              className={`relative w-full max-w-[420px] aspect-square rounded-[2rem] bg-slate-950/65 border border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md p-8 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 ${
                currentState === "idle" ? "cursor-pointer hover:border-cyan-500/30 group" : ""
              }`}
            >
              {/* Corner accent lines */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-700 rounded-tl-sm pointer-events-none" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-700 rounded-tr-sm pointer-events-none" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-700 rounded-bl-sm pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-700 rounded-br-sm pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center gap-2 mt-2">
                <span className={`h-2 w-2 rounded-full ${
                  currentState === "listening" ? "bg-red-500 animate-pulse" :
                  currentState === "processing" ? "bg-amber-500 animate-pulse" :
                  currentState === "success" ? "bg-emerald-500" : "bg-cyan-400"
                }`} />
                <span className="text-[10px] tracking-[0.2em] font-black font-mono text-slate-400 uppercase">
                  {currentState === "idle" && "AI Assistant Ready"}
                  {currentState === "listening" && "AI Active & Listening"}
                  {currentState === "processing" && "Analyzing Audio Feed"}
                  {currentState === "success" && "Routing Complete"}
                </span>
              </div>

              {/* Central Glowing Orb & Icon */}
              <div className="relative flex items-center justify-center my-6">
                
                {/* Outer animated glow ring */}
                <AnimatePresence>
                  {currentState !== "idle" && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ 
                        scale: [1, 1.25, 1],
                        opacity: [0.15, 0.4, 0.15]
                      }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: currentState === "listening" ? 1.5 : 2.5,
                        ease: "easeInOut" 
                      }}
                      className={`absolute w-44 h-44 rounded-full blur-md ${
                        currentState === "listening" ? "bg-red-500/20" :
                        currentState === "processing" ? "bg-amber-500/20" :
                        "bg-emerald-500/20"
                      }`}
                    />
                  )}
                </AnimatePresence>

                {/* Main Pulsing Ring */}
                <motion.div 
                  animate={{
                    scale: currentState === "listening" ? [1, 1.08, 1] : 
                           currentState === "processing" ? [1, 1.04, 1] : [1, 1.02, 1],
                    boxShadow: currentState === "listening" 
                      ? ["0px 0px 20px 2px rgba(6,182,212,0.1)", "0px 0px 40px 6px rgba(6,182,212,0.4)", "0px 0px 20px 2px rgba(6,182,212,0.1)"]
                      : currentState === "processing"
                      ? ["0px 0px 20px 2px rgba(168,85,247,0.1)", "0px 0px 40px 6px rgba(168,85,247,0.4)", "0px 0px 20px 2px rgba(168,85,247,0.1)"]
                      : ["0px 0px 15px 1px rgba(6,182,212,0.05)", "0px 0px 25px 3px rgba(6,182,212,0.15)", "0px 0px 15px 1px rgba(6,182,212,0.05)"]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: currentState === "listening" ? 1.2 : 2,
                    ease: "easeInOut"
                  }}
                  className={`w-32 h-32 rounded-full border-2 p-1.5 flex items-center justify-center transition-colors duration-500 ${
                    currentState === "listening" ? "border-red-500/50 bg-slate-900" :
                    currentState === "processing" ? "border-amber-500/50 bg-slate-900" :
                    currentState === "success" ? "border-emerald-500/50 bg-slate-900" :
                    "border-cyan-500/35 bg-slate-900/40 group-hover:border-cyan-500/60"
                  }`}
                >
                  {/* Inner Gradient border wrapper */}
                  <div className={`w-full h-full rounded-full flex items-center justify-center bg-gradient-to-tr transition-all duration-500 ${
                    currentState === "listening" ? "from-red-600 via-rose-500 to-amber-500" :
                    currentState === "processing" ? "from-amber-600 via-yellow-500 to-orange-500 animate-spin-slow" :
                    currentState === "success" ? "from-emerald-600 via-teal-500 to-cyan-500" :
                    "from-cyan-600 via-blue-500 to-purple-600"
                  }`}>
                    {/* Dark center node */}
                    <div className="w-[94%] h-[94%] rounded-full bg-[#090d16] flex items-center justify-center shadow-inner">
                      {currentState === "idle" && (
                        <Cpu className="h-10 w-10 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                      )}
                      {currentState === "listening" && (
                        <Mic className="h-10 w-10 text-rose-400 animate-pulse" />
                      )}
                      {currentState === "processing" && (
                        <Cpu className="h-10 w-10 text-amber-400 animate-pulse" />
                      )}
                      {currentState === "success" && (
                        <motion.div
                          initial={{ scale: 0.5, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        >
                          <Check className="h-10 w-10 text-emerald-400" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Orbiting particles for futuristic design */}
                <div className="absolute inset-0 w-36 h-36 border border-dashed border-slate-800 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
                <div className="absolute top-1 left-8 w-1.5 h-1.5 bg-cyan-400 rounded-full blur-[1px] pointer-events-none" />
                <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-purple-500 rounded-full blur-[1px] pointer-events-none" />
              </div>

              {/* Dynamic Transcript & State Panel */}
              <div className="w-full flex-grow flex flex-col items-center justify-center min-h-[80px] px-2 text-center">
                <AnimatePresence mode="wait">
                  {currentState === "idle" && (
                    <motion.div
                      key="idle-txt"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-1.5"
                    >
                      <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[280px]">
                        Click <span className="text-cyan-400 font-bold">Talk to Live Agent</span> or tap this card to test the voice search.
                      </p>
                    </motion.div>
                  )}

                  {currentState === "listening" && (
                    <motion.div
                      key="listening-txt"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-1"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-rose-500 font-black font-mono">Recognizing Speech...</span>
                      <p className="text-slate-200 text-xs sm:text-sm font-semibold font-mono italic max-w-[320px] leading-relaxed">
                        &ldquo;{transcript || "Listening..."}&rdquo;
                      </p>
                    </motion.div>
                  )}

                  {currentState === "processing" && (
                    <motion.div
                      key="processing-txt"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-1"
                    >
                      <span className="text-[9px] uppercase tracking-wider text-amber-500 font-black font-mono">Natural Language Routing...</span>
                      <p className="text-slate-300 text-xs font-mono max-w-[300px]">
                        {transcript}
                      </p>
                    </motion.div>
                  )}

                  {currentState === "success" && (
                    <motion.div
                      key="success-txt"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="w-full space-y-3 bg-slate-900/90 border border-emerald-500/20 rounded-2xl p-3 text-left shadow-lg"
                    >
                      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                        <Zap className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider font-mono">Grid Optimized</span>
                      </div>
                      <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
                        <div className="flex justify-between">
                          <span className="text-slate-500">SYMPTOM:</span>
                          <span className="text-slate-200 font-bold">{matchedMed.symptom}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">PRESCRIPTION:</span>
                          <span className="text-slate-200 font-bold">{matchedMed.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">NEAREST CHEMIST:</span>
                          <span className="text-slate-200 font-bold">{matchedMed.chemist}</span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-400 font-bold pt-1 border-t border-slate-800/80">
                          <span>SAVINGS:</span>
                          <span>{matchedMed.savings}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button 
                          onClick={handleDirectOrder}
                          disabled={isPlacing}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
                        >
                          {isPlacing ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Placing...
                            </>
                          ) : (
                            "Order Now"
                          )}
                        </button>
                        <button 
                          onClick={handleReset} 
                          disabled={isPlacing}
                          className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
                        >
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sound Wave Visualizer */}
              <div className="w-full flex items-center justify-center gap-1.5 h-16 border-t border-slate-900/60 pt-4">
                {waveHeights.map((maxHeight, index) => {
                  let animatedDuration = 0.5 + (index % 3) * 0.2;
                  let animatedDelay = (index % 4) * 0.15;
                  
                  // Compute dynamic scale and duration based on current state
                  let scaleValues = [1, 1.3, 1];
                  let duration = animatedDuration;

                  if (currentState === "listening") {
                    scaleValues = [0.8, 2.5 + (index % 3) * 0.8, 0.8];
                    duration = 0.4 + (index % 4) * 0.08;
                  } else if (currentState === "processing") {
                    scaleValues = [1, 1.6, 1];
                    duration = 0.25;
                  } else if (currentState === "success") {
                    scaleValues = [1, 1, 1];
                    duration = 2;
                  }

                  return (
                    <motion.div
                      key={index}
                      animate={{ scaleY: scaleValues }}
                      transition={{
                        repeat: Infinity,
                        duration: duration,
                        delay: currentState === "success" ? 0 : animatedDelay,
                        ease: "easeInOut"
                      }}
                      style={{ 
                        height: `${maxHeight}px`,
                        transformOrigin: "center"
                      }}
                      className={`w-1 sm:w-1.5 rounded-full transition-colors duration-500 ${
                        currentState === "listening" ? "bg-rose-500/80 shadow-[0_0_10px_rgba(244,63,94,0.3)]" :
                        currentState === "processing" ? "bg-amber-400/80 shadow-[0_0_10px_rgba(251,191,36,0.3)]" :
                        currentState === "success" ? "bg-emerald-500/40" :
                        "bg-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.15)] group-hover:bg-cyan-400/70"
                      }`}
                    />
                  );
                })}
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: TEXT CONTENT & CTAS */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Interactive voice search indicator pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>Interactive Voice & Search</span>
            </div>

            {/* Premium heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
              Meet Your Personal <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 bg-clip-text text-transparent">
                Hyperlocal Health Assistant.
              </span>
            </h2>

            {/* Description */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              No more typing long names or searching multiple stores. Just speak naturally. 
              DocBook&apos;s advanced AI agent listens to your symptoms, matches prescriptions with 
              closest verified doctors, and splits your medicine cart across local pharmacies to find 
              the absolute lowest bill instantly.
            </p>

            {/* Quick stats / Features */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-900 pt-6">
              <div className="flex gap-2.5">
                <div className="mt-1 h-5 w-5 rounded-md bg-cyan-950 border border-cyan-800/40 flex items-center justify-center">
                  <Check className="h-3 w-3 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-black uppercase tracking-wider">Natural Voice Input</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Simply describe symptoms in normal English or Hindi</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="mt-1 h-5 w-5 rounded-md bg-cyan-950 border border-cyan-800/40 flex items-center justify-center">
                  <Check className="h-3 w-3 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-white text-xs font-black uppercase tracking-wider">Split-Cart Optimization</h4>
                  <p className="text-slate-500 text-[11px] mt-0.5">Compare and split medications across local stores</p>
                </div>
              </div>
            </div>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleStartListening}
                className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] active:scale-[0.98] cursor-pointer"
              >
                <Mic className="h-4.5 w-4.5 text-cyan-200 animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-white">🤖 Talk to Live Agent</span>
              </button>

              <button
                onClick={currentState === "success" ? handleReset : handleStartListening}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-[0.98] cursor-pointer group"
              >
                <span>
                  {currentState === "success" ? "Try Another Search" : "See How It Works"}
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-slate-350 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
