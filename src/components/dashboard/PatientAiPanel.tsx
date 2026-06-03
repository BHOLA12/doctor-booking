"use client";

import { useState } from "react";
import Link from "next/link";
import { Brain, Loader2, Sparkles, AlertCircle, FileText, AlertTriangle, Activity, PhoneCall, ArrowRight, ShieldCheck } from "lucide-react";
import { ReportAnalysisResult, SymptomCheckerResult } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function PatientAiPanel() {
  const [symptoms, setSymptoms] = useState("");
  const [reportText, setReportText] = useState("");
  const [symptomResult, setSymptomResult] = useState<SymptomCheckerResult | null>(null);
  const [reportResult, setReportResult] = useState<ReportAnalysisResult | null>(null);
  const [loadingSymptoms, setLoadingSymptoms] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);

  async function handleSymptomCheck() {
    setLoadingSymptoms(true);
    try {
      const response = await fetch("/api/ai/symptoms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Unable to analyze symptoms");
        return;
      }
      setSymptomResult(data.data);
    } finally {
      setLoadingSymptoms(false);
    }
  }

  async function handleReportCheck() {
    setLoadingReport(true);
    try {
      const response = await fetch("/api/ai/report-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportText }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Unable to analyze report");
        return;
      }
      setReportResult(data.data);
    } finally {
      setLoadingReport(false);
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Symptom Checker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={5}
            placeholder="Describe symptoms like fever, cough, fatigue, headache..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />
          <Button onClick={handleSymptomCheck} disabled={loadingSymptoms || symptoms.length < 10}>
            {loadingSymptoms ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Symptoms
          </Button>
          {symptomResult && (
            <div className="space-y-4 rounded-2xl border border-slate-200 p-5 bg-white shadow-xs">
              {/* Header Triage Status */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                    Aarogya AI Triage Output
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="text-[10px] font-bold text-slate-400">Severity:</span>
                  {symptomResult.severity === "critical" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 animate-pulse">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                      Critical (Emergency)
                    </span>
                  )}
                  {symptomResult.severity === "high" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      High Urgency
                    </span>
                  )}
                  {symptomResult.severity === "medium" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Medium
                    </span>
                  )}
                  {symptomResult.severity === "low" && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Low Priority
                    </span>
                  )}
                </div>
              </div>

              {/* Emergency Banner Alert */}
              {symptomResult.is_emergency && (
                <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-4 flex flex-col gap-2.5 relative overflow-hidden">
                  <div className="absolute right-2 bottom-0 opacity-10 select-none text-7xl font-bold">🚨</div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
                    <span className="font-extrabold text-sm uppercase tracking-wide">
                      Critical Emergency Match Detected
                    </span>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed">
                    {symptomResult.emergency_message || "This is a potentially critical health state. Immediate medical attention is highly advised."}
                  </p>
                  
                  {symptomResult.action_required === "instant_doctor_connect" && (
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Link href="/online-consultation" className="w-full sm:w-auto">
                        <Button size="sm" className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black uppercase text-[10px] tracking-wider rounded-lg flex items-center justify-center gap-2 py-2.5 cursor-pointer">
                          <PhoneCall className="h-3.5 w-3.5" /> Instant Doctor Connect
                        </Button>
                      </Link>
                      <Link href="/hospitals" className="w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="w-full border-rose-300 text-rose-700 bg-white hover:bg-rose-50 font-bold text-[10px] uppercase tracking-wider rounded-lg py-2.5 cursor-pointer">
                          Nearest Hospital 🏥
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Understood Problem Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Understood Problem
                </p>
                <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                  "{symptomResult.understood_problem}"
                </p>
              </div>

               {/* Primary Routing Suggestion Card */}
              <div className="grid grid-cols-1 gap-3">
                <div className="border border-slate-150 p-3.5 rounded-xl bg-slate-50/50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Specialty Needed
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {symptomResult.specialty_needed.map((spec, idx) => (
                      <Link key={idx} href={`/doctors?specialization=${encodeURIComponent(spec)}`}>
                        <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 font-black text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md cursor-pointer">
                          👨‍⚕️ {spec}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="border border-slate-150 p-3.5 rounded-xl bg-slate-50/50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Booking Recommendation
                  </span>
                  <div className="text-xs font-black text-slate-800">
                    {symptomResult.doctor_type}
                  </div>
                  <span className="text-[10px] font-medium text-slate-500 block mt-0.5">
                    Mode: {symptomResult.consultation_mode} ({symptomResult.booking_priority})
                  </span>
                </div>
              </div>

              {/* First Aid Response Banner */}
              {symptomResult.first_aid_advice && (
                <div className="bg-emerald-50/70 border border-emerald-100/60 rounded-xl p-4 flex gap-3.5 items-start">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-0.5">
                      First Aid Response (प्राथमिक उपचार)
                    </h5>
                    <p className="text-xs font-bold text-emerald-700 leading-relaxed">
                      {symptomResult.first_aid_advice}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions & Doctor Search Keywords */}
              {symptomResult.doctor_search_keywords && symptomResult.doctor_search_keywords.length > 0 && (
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Search Tags:
                    </span>
                    {symptomResult.doctor_search_keywords.map((kw, idx) => (
                      <span key={idx} className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">
                        #{kw}
                      </span>
                    ))}
                  </div>

                  <Link href={`/doctors?search=${encodeURIComponent(symptomResult.doctor_search_keywords[0] || "")}`} className="w-full">
                    <button className="w-full inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-wider py-2.5 rounded-lg transition-all active:scale-[0.98] cursor-pointer">
                      Find Doctors <ArrowRight className="h-3 w-3" />
                    </button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Report Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            placeholder="Paste report text or observations here"
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
          />
          <Button onClick={handleReportCheck} disabled={loadingReport || reportText.length < 10}>
            {loadingReport ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze Report
          </Button>
          {reportResult && (
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-blue-600">
                <FileText className="h-4 w-4" />
                <span className="text-xs font-medium">AI Analysis Results</span>
              </div>
              
              <div>
                <p className="font-medium text-sm mb-2">Key Findings</p>
                <div className="space-y-2">
                  {reportResult.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs text-blue-600">{idx + 1}</span>
                      </div>
                      <p className="text-muted-foreground">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {reportResult.abnormalValues.length > 0 && (
                <div>
                  <p className="font-medium text-sm mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    Abnormal Values to Review
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {reportResult.abnormalValues.map((value, idx) => (
                      <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="font-medium text-sm mb-1">Health Risk Summary</p>
                <p className="text-sm text-muted-foreground">{reportResult.healthRiskSummary}</p>
              </div>
              
              <p className="text-xs text-muted-foreground border-t pt-3">
                ⚠️ {reportResult.disclaimer}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
