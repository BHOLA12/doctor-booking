"use client";

import { useState } from "react";
import { Brain, Loader2, Sparkles, AlertCircle, FileText, TestTube, Shield } from "lucide-react";
import { ReportAnalysisResult, SymptomCheckerResult } from "@/types";
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
            <div className="space-y-4 rounded-lg border p-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-medium">AI-Assisted Screening</span>
              </div>
              
              <div>
                <p className="font-medium mb-2">Possible Conditions</p>
                <div className="space-y-2">
                  {symptomResult.possibleDiseases.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span className="font-medium">{Math.round(item.probability * 100)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${item.probability * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{item.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <p className="font-medium text-sm mb-1">Suggested Tests</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {symptomResult.suggestedTests.map((test, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {test}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">Precautions</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {symptomResult.precautions.map((prec, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        {prec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground border-t pt-3">
                ⚠️ {symptomResult.disclaimer}
              </p>
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
