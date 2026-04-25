"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { LabTest } from "@/lib/lab-tests-data";
import { TIME_SLOTS_LAB } from "@/lib/lab-tests-data";
import { Calendar, CheckCircle2, Clock, FlaskConical, Home, MapPin } from "lucide-react";
import { toast } from "sonner";

type Props = {
  test: LabTest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function LabBookingModal({ test, open, onOpenChange }: Props) {
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [address, setAddress] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [step, setStep] = useState<1 | 2>(1);

  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  const maxDateObj = new Date(today);
  maxDateObj.setDate(today.getDate() + 14);
  const maxDate = maxDateObj.toISOString().split("T")[0];

  const handleConfirm = () => {
    if (!selectedDate || !selectedSlot || !address.trim()) {
      toast.error("Please fill all fields to proceed.");
      return;
    }
    setStep(2);
  };

  const handleClose = () => {
    setStep(1);
    setSelectedDate("");
    setSelectedSlot("");
    setAddress("");
    onOpenChange(false);
  };

  if (!test) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
              {test.emoji}
            </div>
            <div>
              <h2 className="font-bold text-base">{test.name}</h2>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-sm font-bold text-primary">₹{test.price}</span>
                <Badge variant="secondary" className="text-[10px]">{test.category}</Badge>
              </div>
            </div>
          </div>
        </div>

        {step === 1 ? (
          <div className="px-6 py-5 space-y-5">
            {/* Meta */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" />
                Report in {test.reportTime}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <FlaskConical className="h-3.5 w-3.5 text-blue-500" />
                {test.sampleType}
              </div>
              {test.homeCollection && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <Home className="h-3.5 w-3.5" />
                  Home Collection Available
                </div>
              )}
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Select Date
              </label>
              <input
                type="date"
                min={minDate}
                max={maxDate}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            {/* Time Slot */}
            <div>
              <label className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Select Time Slot
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS_LAB.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      selectedSlot === slot
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 hover:bg-accent/50"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm font-semibold mb-1.5 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Home Address for Sample Collection
              </label>
              <Input
                placeholder="Enter your full address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-10"
              />
            </div>

            <Button
              className="w-full h-11 font-semibold rounded-xl"
              onClick={handleConfirm}
              disabled={!selectedDate || !selectedSlot || !address.trim()}
            >
              Confirm Booking
            </Button>
          </div>
        ) : (
          <div className="px-6 py-10 flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 mb-4">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-emerald-700 mb-2">Booking Confirmed!</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Your <span className="font-semibold text-foreground">{test.name}</span> has been booked for{" "}
              <span className="font-semibold text-foreground">{selectedDate}</span> at{" "}
              <span className="font-semibold text-foreground">{selectedSlot}</span>.
            </p>
            <div className="w-full rounded-xl bg-muted/60 p-4 text-left space-y-2 text-sm mb-5">
              <p><span className="font-medium">Collection at:</span> {address}</p>
              <p><span className="font-medium">Report expected:</span> within {test.reportTime}</p>
              <p className="text-emerald-600 font-medium">✓ A confirmation SMS will be sent shortly</p>
            </div>
            <Button className="w-full h-11 rounded-xl" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
