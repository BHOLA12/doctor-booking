"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Upload } from "lucide-react";
import { MedicalReportInfo } from "@/types";
import { REPORT_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function MedicalReportsPanel() {
  const [reports, setReports] = useState<MedicalReportInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    type: REPORT_TYPES[0],
    date: new Date().toISOString().split("T")[0],
    file: null as File | null,
  });

  async function fetchReports() {
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      if (data.success) {
        setReports(data.data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  async function handleUpload() {
    if (!form.file) {
      toast.error("Please choose a report file");
      return;
    }

    setUploading(true);
    const payload = new FormData();
    payload.append("file", form.file);
    payload.append("type", form.type);
    payload.append("date", form.date);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        body: payload,
      });
      const data = await response.json();

      if (!data.success) {
        toast.error(data.error || "Upload failed");
        return;
      }

      toast.success("Report uploaded");
      setForm((current) => ({ ...current, file: null }));
      fetchReports();
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Medical Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.2fr_auto]">
          <Select
            value={form.type}
            onValueChange={(value) => {
              if (!value) return;
              setForm((current) => ({ ...current, type: value }));
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {REPORT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="date" value={form.date} onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))} />
          <Input type="file" accept=".pdf,image/*" onChange={(e) => setForm((current) => ({ ...current, file: e.target.files?.[0] || null }))} />
          <Button onClick={handleUpload} disabled={uploading} className="gap-2">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reports uploaded yet.</p>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-primary/20" />
            
            <div className="space-y-6">
              {reports.map((report, index) => (
                <div key={report.id} className="relative pl-8">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-1.5 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/30">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <div className="min-w-[100px]">
                      <p className="text-xs text-muted-foreground">
                        {new Date(report.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="bg-primary/5">
                          {report.type}
                        </Badge>
                        <span className="text-sm font-medium">{report.fileName}</span>
                      </div>
                      {report.summary && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {report.summary}
                        </p>
                      )}
                      <a
                        href={report.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        View Report
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
