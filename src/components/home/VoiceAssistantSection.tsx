"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  ArrowUpRight, 
  Sparkles, 
  Cpu, 
  Check, 
  RotateCcw, 
  Volume2, 
  Store, 
  MapPin, 
  Zap, 
  Loader2, 
  ShieldCheck, 
  Activity, 
  PhoneCall, 
  AlertTriangle, 
  ArrowRight 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { MEDICINES } from "@/lib/medicines-data";
import { toast } from "sonner";
import { SymptomCheckerResult } from "@/types";
import { getLocalSymptomAnalysis } from "@/server/services/symptom-checker-local";

type AssistantState = "idle" | "listening" | "processing" | "success";

export default function VoiceAssistantSection() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [currentState, setCurrentState] = useState<AssistantState>("idle");
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [mockIntervalId, setMockIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [symptomResult, setSymptomResult] = useState<SymptomCheckerResult | null>(null);
  const [isMedIntent, setIsMedIntent] = useState(false);
  const [isGreetingIntent, setIsGreetingIntent] = useState(false);
  const [matchedMed, setMatchedMed] = useState({
    symptom: "Fever & Joint Pain",
    name: "Paracetamol 650mg",
    query: "paracetamol",
    chemist: "Jehanabad Pharmacy",
    savings: "35% Lower Price! 🟢"
  });
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; text: string }[]>([]);

  const getSymptomFromTranscript = (text: string, matchedMedName: string, matchedCategory: string) => {
    const t = text.toLowerCase();
    if (t.includes("dehydration") || t.includes("weakness") || t.includes("energy")) return "Dehydration / Weakness";
    if (t.includes("fever") || t.includes("temp")) return "Fever";
    if (t.includes("pain") || t.includes("headache") || t.includes("head") || t.includes("hurt")) return "Body Pain / Headache";
    if (t.includes("cough") || t.includes("cold") || t.includes("throat")) return "Cough & Cold";
    if (t.includes("sugar") || t.includes("diabetes")) return "Diabetes / High Sugar";
    if (t.includes("gas") || t.includes("acidity") || t.includes("stomach")) return "Acidity & Gastric Issue";
    if (t.includes("heart") || t.includes("bp") || t.includes("blood pressure") || t.includes("hypertension") || t.includes("cholesterol")) return "Heart & BP Issue";
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
    if (t.includes("heart") || t.includes("bp") || t.includes("blood pressure") || t.includes("hypertension") || t.includes("cholesterol")) {
      return MEDICINES.find(m => m.id === "m7") || MEDICINES[0]; // Telmisartan 40
    }
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

  const isMedicineQuery = (text: string) => {
    const t = text.toLowerCase();
    const orderKeywords = ["order", "buy", "purchase", "delivery", "chemist", "pharmacy", "medicine", "tablet", "capsule", "syrup", "salt", "mg", "ml"];
    if (orderKeywords.some(kw => t.includes(kw))) {
      return true;
    }
    for (const m of MEDICINES) {
      const name = m.name.toLowerCase();
      const salt = m.salt.toLowerCase();
      if (t.includes(name) || t.includes(salt)) {
        return true;
      }
    }
    return false;
  };

  const isGreetingQuery = (text: string) => {
    const t = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
    const greetings = ["hi", "hello", "hey", "hola", "namaste", "pranam", "kaise ho", "kaise ho aap", "good morning", "good afternoon", "good evening", "hii"];
    return greetings.includes(t) || t === "aarogya" || t === "hi aarogya" || t === "hello aarogya" || t === "hii aarogya";
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

  const getMaleVoice = (voices: SpeechSynthesisVoice[], lang: string) => {
    const l = lang.toLowerCase();
    const langVoices = voices.filter(v => v.lang.toLowerCase().includes(l));
    if (langVoices.length === 0) return null;

    if (l.includes("hi")) {
      const hemant = langVoices.find(v => v.name.toLowerCase().includes("hemant"));
      if (hemant) return hemant;
    }

    const maleNames = ["hemant", "ravi", "david", "mark", "george", "male", "standard-b", "standard-d"];
    for (const name of maleNames) {
      const found = langVoices.find(v => v.name.toLowerCase().includes(name));
      if (found) return found;
    }

    return langVoices[0];
  };

  const speakText = (text: string, lang: string = "hi-IN", autoListenAfter: boolean = false) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 0.85; // Lower pitch for a male tone
      utterance.lang = lang;
      
      const voices = window.speechSynthesis.getVoices();
      const voice = getMaleVoice(voices, lang);
      if (voice) {
        utterance.voice = voice;
      }

      if (autoListenAfter) {
        // Prevent GC of utterance by attaching to window
        (window as any)._activeUtterance = utterance;
        
        let recognitionStarted = false;
        const triggerStart = () => {
          if (recognitionStarted) return;
          recognitionStarted = true;
          (window as any)._activeUtterance = null;
          startRecognition();
        };

        // Safety fallback timeout based on text length (approx 100ms/char, min 3s)
        const durationEstimate = Math.max(3000, text.length * 100 + 1000);
        const safetyTimeout = setTimeout(triggerStart, durationEstimate);

        utterance.onend = () => {
          clearTimeout(safetyTimeout);
          triggerStart();
        };
        utterance.onerror = () => {
          clearTimeout(safetyTimeout);
          triggerStart();
        };
      }
      
      window.speechSynthesis.speak(utterance);
    } else if (autoListenAfter) {
      startRecognition();
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

      let hasError = false;

      rec.onstart = () => {
        setCurrentState("listening");
        setTranscript("Listening for symptoms...");
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
      };

      rec.onerror = (err: any) => {
        console.warn("Speech recognition warning:", err.error || err);
        hasError = true;
        
        if (err.error === "not-allowed") {
          toast.warning("Microphone access is blocked. Please enable mic permissions or type your symptoms below.", {
            id: "mic-permission-warning",
            duration: 4000
          });
        }
        
        setCurrentState("listening");
        runMockSpeechSimulation();
      };

      rec.onend = () => {
        if (!hasError) {
          setCurrentState("processing");
        }
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
        const utterance = new SpeechSynthesisUtterance("हाय, मैं आरोग्य बोल रहा हूँ। क्लीनिकबुक में आपका स्वागत है।");
        utterance.rate = 0.95;
        utterance.pitch = 0.85; // Lower pitch for masculine tone
        utterance.lang = "hi-IN";
        
        const voices = window.speechSynthesis.getVoices();
        const voice = getMaleVoice(voices, "hi-IN");
        if (voice) {
          utterance.voice = voice;
        }
        
        // Prevent GC of utterance by attaching to window
        (window as any)._activeUtterance = utterance;
        
        let recognitionStarted = false;
        const triggerStart = () => {
          if (recognitionStarted) return;
          recognitionStarted = true;
          (window as any)._activeUtterance = null;
          startRecognition();
        };

        // Safety fallback timeout (3s) to prevent hanging on "Assistant preparing..."
        const safetyTimeout = setTimeout(triggerStart, 3000);

        utterance.onend = (e) => {
          clearTimeout(safetyTimeout);
          triggerStart();
        };
        utterance.onerror = (e) => {
          clearTimeout(safetyTimeout);
          triggerStart();
        };

        setCurrentState("listening");
        setTranscript("Assistant preparing...");
        window.speechSynthesis.speak(utterance);
      } else {
        startRecognition();
      }
    }
  };

  const handleCardClick = () => {
    if (currentState === "idle" || currentState === "success") {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      handleStartListening();
    } else if (currentState === "listening") {
      handleReset();
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
    setTextInput("");
    setSymptomResult(null);
    setChatHistory([]);
  };

  const handleTextInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    setTranscript(textInput);
    setCurrentState("processing");
    setTextInput("");
  };

  const handleDirectOrder = async () => {
    let currentUser = user;
    if (!currentUser) {
      toast.info("Signing you in as a Guest Patient to complete checkout...", {
        duration: 3000
      });
      const loginRes = await login("patient@clinikbook.health", "password123");
      if (!loginRes.success) {
        toast.error("Please login to place an order");
        router.push("/login?redirect=/");
        return;
      }
      toast.success("Authenticated as Guest!");
      await new Promise(resolve => setTimeout(resolve, 300));
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
        address: "Rajabazar, NH-83, Jehanabad, Bihar",
        phone: "9876543213",
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
    let active = true;

    if (currentState === "processing") {
      const t = transcript || "fever and headache";
      
      // Detect if user is greeting, ordering medicine, or needs doctor consult
      const isGreeting = isGreetingQuery(t);
      setIsGreetingIntent(isGreeting);

      if (isGreeting) {
        setSymptomResult(null);
        setMatchedMed({
          symptom: t,
          name: "",
          query: "",
          chemist: "",
          savings: ""
        });
        const speakMsg = "हाय, मैं आरोग्य बोल रहा हूँ। क्लीनिकबुक में आपका स्वागत है।";
        speakText(speakMsg, "hi-IN", true);
        setChatHistory(prev => [
          ...prev,
          { role: "user", text: t },
          { role: "assistant", text: speakMsg }
        ]);
        setCurrentState("success");
        return;
      }

      const isMed = isMedicineQuery(t);
      setIsMedIntent(isMed);

      // Calculate local matching fallback variables just in case
      const matchedMedicine = findBestMedicineMatch(t);
      const symptom = getSymptomFromTranscript(t, matchedMedicine.name, matchedMedicine.category);
      const chemists = ["Hindustan Medical Hall", "Jehanabad Pharmacy", "Ajay Medical Hall", "Green Medical Hall", "Gudvil Medical Hall"];
      const chemistIndex = Math.abs(matchedMedicine.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % chemists.length;
      const chemist = chemists[chemistIndex];
      const savings = `${matchedMedicine.discount}% Lower Price! 🟢`;

      const performTriage = async () => {
        try {
          const response = await fetch("/api/ai/symptoms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms: t, history: chatHistory }),
          });

          const data = await response.json();
          if (!active) return;

          if (response.ok && data.success) {
            setSymptomResult(data.data);
            
            // Set local fallback matching values too
            setMatchedMed({
              symptom: data.data.understood_problem || symptom,
              name: isMed ? matchedMedicine.name : (data.data.doctor_type || matchedMedicine.name),
              query: isMed ? matchedMedicine.name : (data.data.doctor_search_keywords[0] || matchedMedicine.id),
              chemist,
              savings
            });

            // Speak out findings
            let speakMsg = "";
            let speakLang = "en-IN";

            if (isMed) {
              const hasHindi = t.match(/[\u0900-\u097F]/) || t.includes("dilao") || t.includes("chahiye") || t.includes("chahie") || t.includes("order") || t.includes("dedo");
              speakLang = hasHindi ? "hi-IN" : "en-IN";
              speakMsg = speakLang === "hi-IN"
                ? `${matchedMedicine.name} मिल गया है, आप इसे अभी आर्डर कर सकते हैं।`
                : `I found ${matchedMedicine.name}. You can order it now from ${chemist}.`;
            } else {
              speakLang = data.data.language_detected === "Hindi" ? "hi-IN" : "en-IN";
              if (data.data.is_emergency) {
                speakMsg = data.data.language_detected === "Hindi" 
                  ? "यह एक मेडिकल इमरजेंसी हो सकती है। तुरंत डॉक्टर से संपर्क करें।" 
                  : "This could be a medical emergency. Please connect with a doctor immediately.";
              } else {
                speakMsg = data.data.first_aid_advice || (
                  data.data.language_detected === "Hindi"
                    ? `आपके लक्षणों के लिए, ${data.data.doctor_type} से परामर्श करने की सलाह दी जाती है।`
                    : `For your symptoms, consulting a ${data.data.doctor_type} is recommended.`
                );
              }
            }

            speakText(speakMsg, speakLang, false);
            setChatHistory(prev => [
              ...prev,
              { role: "user", text: t },
              { role: "assistant", text: speakMsg }
            ]);
            setCurrentState("success");
          } else {
            throw new Error("Triage API error");
          }
        } catch (err) {
          console.error("Home page triage error, using local fallback:", err);
          if (!active) return;
          
          const local = getLocalSymptomAnalysis(t);
          setSymptomResult(local);
          setMatchedMed({
            symptom: local.understood_problem || symptom,
            name: isMed ? matchedMedicine.name : (local.doctor_type || matchedMedicine.name),
            query: isMed ? matchedMedicine.name : (local.doctor_search_keywords[0] || matchedMedicine.id),
            chemist,
            savings
          });

          let speakMsg = "";
          let speakLang = "en-IN";

          if (isMed) {
            const hasHindi = t.match(/[\u0900-\u097F]/) || t.includes("dilao") || t.includes("chahiye") || t.includes("chahie") || t.includes("order") || t.includes("dedo");
            speakLang = hasHindi ? "hi-IN" : "en-IN";
            speakMsg = speakLang === "hi-IN"
              ? `${matchedMedicine.name} मिल गया है, आप इसे अभी आर्डर कर सकते हैं।`
              : `I found ${matchedMedicine.name}. You can order it now.`;
          } else {
            speakLang = local.language_detected === "Hindi" ? "hi-IN" : "en-IN";
            if (local.is_emergency) {
              speakMsg = local.language_detected === "Hindi" 
                ? "यह एक मेडिकल इमरजेंसी हो सकती है। तुरंत संपर्क करें।" 
                : "This could be a medical emergency. Please contact a doctor.";
            } else {
              speakMsg = local.first_aid_advice;
            }
          }

          speakText(speakMsg, speakLang, false);
          setChatHistory(prev => [
            ...prev,
            { role: "user", text: t },
            { role: "assistant", text: speakMsg }
          ]);
          setCurrentState("success");
        }
      };

      void performTriage();
    }

    return () => {
      active = false;
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
    <section id="voice-assistant" className="relative py-24 bg-[#030712] overflow-hidden border-b border-slate-900">
      {/* Background ambient glowing shapes */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT COLUMN: INTERACTIVE VISUALIZER */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div 
              onClick={handleCardClick}
              className={`relative w-full max-w-[420px] aspect-square rounded-[2rem] bg-slate-950/65 border border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-md p-8 flex flex-col items-center justify-between overflow-hidden transition-all duration-300 cursor-pointer ${
                currentState === "idle" ? "hover:border-cyan-500/30 group" : 
                currentState === "success" ? "hover:border-emerald-500/30" : "hover:border-red-500/30"
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
                      className="w-full space-y-3 bg-slate-900/90 border border-cyan-500/20 rounded-2xl p-4 text-left shadow-lg"
                    >
                      {isGreetingIntent ? (
                        <>
                          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider font-mono">Aarogya AI Active</span>
                          </div>
                          <div className="space-y-2 text-slate-350 text-[11px] leading-relaxed font-sans">
                            <p className="font-semibold text-slate-100 text-xs">
                              Namaste! Main Aarogya bol raha hu. Clinikbook mein aapka swagat hai. 🙏
                            </p>
                            <p>
                              Aap mujhe apne symptoms (jaise: fever, stomach pain) bata sakte hain ya kisi dawai (medicine) ka naam le sakte hain.
                            </p>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartListening();
                              }} 
                              className="flex-grow py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                            >
                              Talk to me
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReset();
                              }} 
                              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      ) : isMedIntent ? (
                        <>
                          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                            <Zap className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider font-mono">Grid Optimized</span>
                          </div>
                          <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-500">MEDICINE:</span>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDirectOrder();
                              }}
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReset();
                              }} 
                              disabled={isPlacing}
                              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center disabled:opacity-50"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-1.5 mb-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider font-mono">Triage Recommended</span>
                          </div>
                          <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-500">UNDERSTOOD:</span>
                              <span className="text-slate-200 font-bold truncate max-w-[150px]">{symptomResult?.understood_problem || matchedMed.symptom}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">DOCTOR TYPE:</span>
                              <span className="text-cyan-400 font-bold">{symptomResult?.doctor_type || "General Physician"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">SEVERITY:</span>
                              <span className={`font-bold uppercase ${
                                symptomResult?.severity === "critical" ? "text-rose-400 animate-pulse" :
                                symptomResult?.severity === "high" ? "text-orange-400" :
                                symptomResult?.severity === "medium" ? "text-amber-400" : "text-emerald-400"
                              }`}>{symptomResult?.severity || "medium"}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800/80">
                              <span>PRIORITY:</span>
                              <span className="text-slate-200">{symptomResult?.booking_priority || "Standard"}</span>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-1">
                            <Link 
                              href={`/doctors?specialization=${encodeURIComponent(symptomResult?.specialty_needed?.[0] || "General Physician")}`}
                              className="flex-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button 
                                className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-550 text-white font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                              >
                                Book Doctor
                              </button>
                            </Link>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReset();
                              }} 
                              className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Text Input Field (Chatbot capability) */}
              {currentState === "idle" && (
                <div className="w-full px-1" onClick={(e) => e.stopPropagation()}>
                  <form onSubmit={handleTextInputSubmit} className="relative flex items-center bg-slate-900 border border-slate-800 focus-within:border-cyan-500/50 rounded-xl overflow-hidden transition-all duration-300">
                    <input 
                      type="text" 
                      placeholder="Type symptoms (Heart, BP, Fever)..." 
                      value={textInput} 
                      onChange={(e) => setTextInput(e.target.value)}
                      className="w-full pl-4 pr-12 py-2.5 bg-transparent text-xs text-white placeholder-slate-500 outline-none font-mono focus:ring-0"
                    />
                    <button type="submit" className="absolute right-2 px-2.5 py-1 bg-cyan-950 border border-cyan-800/30 text-cyan-400 hover:text-cyan-300 text-[10px] font-bold font-mono rounded-lg transition-colors cursor-pointer">
                      Send
                    </button>
                  </form>
                </div>
              )}

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

          {/* RIGHT COLUMN: TEXT CONTENT & CTAS OR AI TRIAGE OUTPUT CARD */}
          <div className="lg:col-span-7 text-left space-y-6">
            {currentState === "success" && symptomResult && !isMedIntent ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="space-y-4 rounded-3xl border border-slate-800 bg-slate-950/80 p-6 backdrop-blur-md relative overflow-hidden"
              >
                {/* Accent glow line */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-500" />
                
                {/* Header Triage Status */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-900">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200 font-mono">
                      Aarogya AI Triage Output
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 font-mono">Severity:</span>
                    {symptomResult.severity === "critical" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-rose-400 bg-rose-950/30 border border-rose-800/40 px-2.5 py-0.5 rounded-full animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.2)] font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Critical (Emergency)
                      </span>
                    )}
                    {symptomResult.severity === "high" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-orange-400 bg-orange-950/30 border border-orange-800/40 px-2.5 py-0.5 rounded-full font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                        High Urgency
                      </span>
                    )}
                    {symptomResult.severity === "medium" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-amber-400 bg-amber-950/30 border border-amber-800/40 px-2.5 py-0.5 rounded-full font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        Medium
                      </span>
                    )}
                    {symptomResult.severity === "low" && (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 px-2.5 py-0.5 rounded-full font-mono">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Low Priority
                      </span>
                    )}
                  </div>
                </div>

                {/* Emergency Banner Alert */}
                {symptomResult.is_emergency && (
                  <div className="bg-rose-950/40 border border-rose-800/40 text-rose-200 rounded-xl p-4 flex flex-col gap-2.5 relative overflow-hidden">
                    <div className="absolute right-2 bottom-0 opacity-10 select-none text-7xl font-bold">🚨</div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4.5 w-4.5 text-rose-500 shrink-0" />
                      <span className="font-extrabold text-xs uppercase tracking-wider text-rose-300 font-mono">
                        Critical Emergency Match Detected
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold leading-relaxed">
                      {symptomResult.emergency_message || "This is a potentially critical health state. Immediate medical attention is highly advised."}
                    </p>
                    
                    {symptomResult.action_required === "instant_doctor_connect" && (
                      <div className="mt-1 flex flex-wrap gap-2">
                        <Link href="/online-consultation" className="w-full sm:w-auto">
                          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase text-[9px] tracking-wider px-3.5 py-2 rounded-lg transition-all active:scale-[0.98] cursor-pointer">
                            <PhoneCall className="h-3 w-3" /> Instant Doctor Connect
                          </button>
                        </Link>
                        <Link href="/hospitals" className="w-full sm:w-auto">
                          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 border border-rose-850 text-rose-300 bg-slate-950 hover:bg-rose-950/20 font-bold text-[9px] uppercase tracking-wider px-3.5 py-2 rounded-lg cursor-pointer">
                            Nearest Hospital 🏥
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* Understood Problem Summary */}
                <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                    Understood Symptoms
                  </p>
                  <p className="text-xs font-semibold text-slate-300 leading-relaxed font-mono">
                    "{symptomResult.understood_problem}"
                  </p>
                </div>

                 {/* Primary Routing Suggestion Card */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="border border-slate-800/80 p-3.5 rounded-xl bg-slate-900/20">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-1 font-mono">
                      Specialty Needed
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {symptomResult.specialty_needed?.map((spec, idx) => (
                        <Link key={idx} href={`/doctors?specialization=${encodeURIComponent(spec)}`}>
                          <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-800/40 hover:bg-cyan-500/15 font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md cursor-pointer transition-all">
                            👨‍⚕️ {spec}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="border border-slate-800/80 p-3.5 rounded-xl bg-slate-900/20">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5 font-mono">
                      Booking Recommendation
                    </span>
                    <div className="text-xs font-black text-slate-200 font-mono">
                      {symptomResult.doctor_type}
                    </div>
                    <span className="text-[9px] font-medium text-slate-500 block mt-0.5 font-mono">
                      Mode: {symptomResult.consultation_mode} ({symptomResult.booking_priority})
                    </span>
                  </div>
                </div>

                {/* First Aid Response Banner */}
                {symptomResult.first_aid_advice && (
                  <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-4 flex gap-3.5 items-start">
                    <div className="h-8 w-8 rounded-lg bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-[9px] font-black text-emerald-400 uppercase tracking-wider mb-0.5 font-mono">
                        First Aid Response (प्राथमिक उपचार)
                      </h5>
                      <p className="text-xs font-bold text-emerald-300 leading-relaxed font-sans">
                        {symptomResult.first_aid_advice}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions & Doctor Search Keywords */}
                <div className="border-t border-slate-900 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                      Search Tags:
                    </span>
                    {symptomResult.doctor_search_keywords && symptomResult.doctor_search_keywords.length > 0 ? (
                      symptomResult.doctor_search_keywords?.map((kw, idx) => (
                        <span key={idx} className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg font-mono">
                          #{kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-[9px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg font-mono">
                        #general_triage
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <Link href={`/doctors?search=${encodeURIComponent(symptomResult.doctor_search_keywords?.[0] || symptomResult.doctor_type)}`} className="flex-1 md:flex-initial">
                      <button className="w-full inline-flex items-center justify-center gap-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-[9px] uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all active:scale-[0.98] cursor-pointer">
                        Book Doctor <ArrowRight className="h-3 w-3" />
                      </button>
                    </Link>
                    <button 
                      onClick={handleReset}
                      className="inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-805 border border-slate-800 text-slate-400 hover:text-white font-extrabold text-[9px] uppercase tracking-wider px-3.5 py-2.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer font-mono"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Interactive voice search indicator pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3 text-cyan-400" />
                  <span>Live Voice & AI Search</span>
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
                  ClinikBook&apos;s advanced AI agent listens to your symptoms, matches prescriptions with 
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
                      <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono">Natural Voice Input</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">Simply describe symptoms in normal English or Hindi</p>
                    </div>
                  </div>
                  <div className="flex gap-2.5">
                    <div className="mt-1 h-5 w-5 rounded-md bg-cyan-950 border border-cyan-800/40 flex items-center justify-center">
                      <Check className="h-3 w-3 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-black uppercase tracking-wider font-mono">Split-Cart Optimization</h4>
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
              </>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
