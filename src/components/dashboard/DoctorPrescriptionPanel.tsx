"use client";

import { useEffect, useState } from "react";
import { Download, Loader2, Plus, WandSparkles, Pill, AlertTriangle, FileText } from "lucide-react";
import { AppointmentInfo, PrescriptionInfo, PrescriptionMedicine } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const emptyMedicine = (): PrescriptionMedicine => ({
  name: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

export default function DoctorPrescriptionPanel({
  appointments,
}: {
  appointments: AppointmentInfo[];
}) {
  const [prescriptions, setPrescriptions] = useState<PrescriptionInfo[]>([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    appointmentId: "",
    patientId: "",
    symptoms: "",
    diagnosis: "",
    precautions: "",
    medicines: [emptyMedicine()],
  });

  const availableAppointments = appointments.filter((appointment) =>
    ["CONFIRMED", "COMPLETED"].includes(appointment.status)
  );

  async function fetchPrescriptions() {
    const response = await fetch("/api/prescriptions");
    const data = await response.json();
    if (data.success) {
      setPrescriptions(data.data);
    }
  }

  useEffect(() => {
    async function loadPrescriptions() {
      await fetchPrescriptions();
    }

    void loadPrescriptions();
  }, []);

  function syncPatientFromAppointment(appointmentId: string) {
    const selected = availableAppointments.find((appointment) => appointment.id === appointmentId);
    if (!selected) return;

    setForm((current) => ({
      ...current,
      appointmentId,
      patientId: selected.patientId,
      symptoms: selected.symptoms || current.symptoms,
    }));
  }

  async function generateSuggestion() {
    setLoadingAi(true);
    try {
      const response = await fetch("/api/ai/prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptoms: form.symptoms,
          diagnosis: form.diagnosis,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Failed to generate suggestion");
        return;
      }

      setForm((current) => ({
        ...current,
        medicines: data.data.medicines,
        precautions: Array.isArray(data.data.precautions)
          ? data.data.precautions.join(", ")
          : current.precautions,
      }));
      toast.success("AI suggestion added");
    } finally {
      setLoadingAi(false);
    }
  }

  async function savePrescription() {
    setSaving(true);
    try {
      const response = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Failed to save prescription");
        return;
      }

      toast.success("Prescription saved");
      setForm({
        appointmentId: "",
        patientId: "",
        symptoms: "",
        diagnosis: "",
        precautions: "",
        medicines: [emptyMedicine()],
      });
      fetchPrescriptions();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-primary" />
            Smart Prescription Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Select Appointment</Label>
            <select
              value={form.appointmentId}
              onChange={(e) => syncPatientFromAppointment(e.target.value)}
              className="mt-1 h-10 w-full rounded-md border bg-background px-3 text-sm"
            >
              <option value="">Choose an appointment...</option>
              {availableAppointments.map((appointment) => (
                <option key={appointment.id} value={appointment.id}>
                  {appointment.patient?.name} - {appointment.date} {appointment.startTime}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs text-muted-foreground">Symptoms</Label>
              <Textarea
                rows={3}
                placeholder="Enter patient symptoms..."
                value={form.symptoms}
                onChange={(e) => setForm((prev) => ({ ...prev, symptoms: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Diagnosis</Label>
              <Textarea
                rows={3}
                placeholder="Enter diagnosis..."
                value={form.diagnosis}
                onChange={(e) => setForm((prev) => ({ ...prev, diagnosis: e.target.value }))}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {form.medicines.map((medicine, index) => (
              <div key={`${medicine.name}-${index}`} className="grid gap-2 rounded-lg border p-3 md:grid-cols-2">
                <Input
                  placeholder="Medicine"
                  value={medicine.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      medicines: current.medicines.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, name: e.target.value } : item
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Dosage"
                  value={medicine.dosage}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      medicines: current.medicines.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, dosage: e.target.value } : item
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Frequency"
                  value={medicine.frequency}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      medicines: current.medicines.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, frequency: e.target.value } : item
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Duration"
                  value={medicine.duration}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      medicines: current.medicines.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, duration: e.target.value } : item
                      ),
                    }))
                  }
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => setForm((current) => ({ ...current, medicines: [...current.medicines, emptyMedicine()] }))}>
              <Plus className="mr-2 h-4 w-4" />
              Add Medicine
            </Button>
            <Button type="button" variant="outline" onClick={generateSuggestion} disabled={loadingAi || !form.symptoms || !form.diagnosis}>
              {loadingAi ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WandSparkles className="mr-2 h-4 w-4" />}
              AI Suggestion
            </Button>
            <Button type="button" onClick={savePrescription} disabled={saving || !form.patientId || !form.diagnosis}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save Prescription
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Prescriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {prescriptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No prescriptions saved yet.</p>
          ) : (
            prescriptions.map((prescription) => (
              <div key={prescription.id} className="rounded-lg border p-3">
                <p className="font-medium">{prescription.patient?.name || "Patient"}</p>
                <p className="text-sm text-muted-foreground">{prescription.diagnosis}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(prescription.createdAt).toLocaleDateString("en-IN")}
                </p>
                {prescription.pdfUrl && (
                  <a href={prescription.pdfUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex">
                    <Button size="sm" variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </a>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
