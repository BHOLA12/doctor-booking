"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { RegisterInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Stethoscope,
  Microscope,
  Eye,
  EyeOff,
  Loader2,
  User,
  Mail,
  Phone,
  Lock,
  Award,
  Building2,
  GraduationCap,
  Briefcase,
  ImagePlus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.07 } },
};

function InputField({
  id,
  label,
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  min,
  max,
  minLength,
  maxLength,
  rightElement,
  className = "",
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  rightElement?: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} className="space-y-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
      >
        {label}
      </Label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200 pointer-events-none" />
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          minLength={minLength}
          maxLength={maxLength}
          className={`h-12 pl-10 ${rightElement ? "pr-10" : ""} bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 transition-all duration-200 shadow-sm hover:border-slate-300 dark:hover:border-white/20 ${className}`}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function RegisterContent() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchRole = searchParams.get("role")?.toUpperCase();
  const defaultRole =
    searchRole === "PATHOLOGIST"
      ? "PATHOLOGIST"
      : searchRole === "DOCTOR"
      ? "DOCTOR"
      : searchRole === "PHARMACY"
      ? "PHARMACY"
      : "PATIENT";

  const [form, setForm] = useState<RegisterInput>({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: defaultRole as RegisterInput["role"],
    avatar: "",
    specialization: "",
    experience: 0,
    licenseNumber: "",
    degree: "",
    college: "",
    experienceHospitals: "",
    currentHospitalName: "",
    // Pharmacy fields
    ownerName: "",
    pharmacistName: "",
    pharmacistRegNo: "",
    dl20: "",
    dl21: "",
    gstin: "",
    address: "",
    pincode: "",
  } as RegisterInput);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(form);
    if (result.success) {
      if (form.role === "DOCTOR" || form.role === "PATHOLOGIST") {
        toast.success(
          "Registration successful! Your account is pending admin approval. You'll be notified once approved.",
          { duration: 6000 }
        );
        router.push("/dashboard/doctor");
      } else if (form.role === "PHARMACY") {
        toast.success("Pharmacy registration submitted. Verification is required before you can go live.");
        router.push("/pharmacy/dashboard");
      } else {
        toast.success("Registration successful!");
        router.push("/dashboard/patient");
      }
    } else {
      toast.error(result.error || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Ambient background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-300/20 blur-[120px] animate-pulse-soft" />
        <div className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-400/20 blur-[100px] animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-sky-300/10 blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #0ea5e9 1px, transparent 1px), linear-gradient(to bottom, #0ea5e9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 blur-xl opacity-50 scale-110" />
              <div className="relative h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/30">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 dark:from-white dark:via-cyan-200 dark:to-teal-300 bg-clip-text text-transparent">
            Create your account
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            Join{" "}
            <span className="font-bold tracking-tight text-slate-900 dark:text-white">
              Doc<span className="text-primary">Book</span>
            </span>{" "}
            — trusted healthcare, simplified
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Card glow border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/30 via-transparent to-teal-400/20 p-px">
            <div className="h-full w-full rounded-3xl bg-white/80 dark:bg-slate-900/80" />
          </div>

          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl shadow-cyan-500/10 p-8">
            {/* Role Toggle */}
            <motion.div variants={fadeUp} className="mb-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                I am a
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(["PATIENT", "DOCTOR", "PATHOLOGIST", "PHARMACY"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`relative py-3 px-1.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 overflow-hidden group ${
                      form.role === role
                        ? "text-white shadow-lg"
                        : "bg-slate-100/80 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10"
                    }`}
                  >
                    {form.role === role && (
                      <motion.div
                        layoutId="roleTab"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-2xl"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-1">
                      {role === "PATIENT" ? (
                        <User className="h-3.5 w-3.5" />
                      ) : role === "DOCTOR" ? (
                        <Stethoscope className="h-3.5 w-3.5" />
                      ) : (
                        <Building2 className="h-3.5 w-3.5" />
                      )}
                      {role === "PATIENT" ? "Patient" : role === "DOCTOR" ? "Doctor" : role === "PATHOLOGIST" ? "Pathologist" : "Pharmacy"}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>

            <form onSubmit={handleSubmit}>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
                <InputField
                  id="name"
                  label={form.role === "PHARMACY" ? "Pharmacy Name" : "Full Name"}
                  icon={form.role === "PHARMACY" ? Building2 : User}
                  placeholder={
                    form.role === "DOCTOR" || form.role === "PATHOLOGIST"
                      ? "Dr. Full Name"
                      : form.role === "PHARMACY"
                      ? "e.g. Wellness Forever Pharmacy"
                      : "Your full name"
                  }
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <InputField
                  id="email"
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <InputField
                  id="phone"
                  label="Phone (optional)"
                  icon={Phone}
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                <AnimatePresence mode="wait">
                  {(form.role === "DOCTOR" || form.role === "PATHOLOGIST") && (
                    <motion.div
                      key="doctor-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {/* Doctor section divider */}
                        <motion.div variants={fadeUp} className="flex items-center gap-3 pt-1">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-200 dark:via-cyan-800 to-transparent" />
                          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                            Professional Details
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-200 dark:via-cyan-800 to-transparent" />
                        </motion.div>

                        <InputField
                          id="specialization"
                          label="Specialization"
                          icon={Award}
                          placeholder="e.g. Cardiologist"
                          value={form.specialization}
                          onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                          required
                        />

                        <InputField
                          id="experience"
                          label="Years of Experience"
                          icon={Briefcase}
                          type="number"
                          placeholder="0"
                          value={form.experience}
                          onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                          required
                        />

                        <InputField
                          id="licenseNumber"
                          label="License Number"
                          icon={CheckCircle2}
                          placeholder="Medical license number"
                          value={form.licenseNumber}
                          onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                          required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            id="degree"
                            label="Degree"
                            icon={GraduationCap}
                            placeholder="e.g. MBBS, MD"
                            value={form.degree}
                            onChange={(e) => setForm({ ...form, degree: e.target.value })}
                            required
                          />
                          <InputField
                            id="college"
                            label="MBBS College"
                            icon={GraduationCap}
                            placeholder="Medical college"
                            value={form.college}
                            onChange={(e) => setForm({ ...form, college: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            id="experienceHospitals"
                            label="Past Hospitals"
                            icon={Building2}
                            placeholder="Former hospitals"
                            value={form.experienceHospitals}
                            onChange={(e) => setForm({ ...form, experienceHospitals: e.target.value })}
                          />
                          <InputField
                            id="currentHospitalName"
                            label="Current Hospital"
                            icon={Building2}
                            placeholder="Current workplace"
                            value={form.currentHospitalName}
                            onChange={(e) => setForm({ ...form, currentHospitalName: e.target.value })}
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {form.role === "PHARMACY" && (
                    <motion.div
                      key="pharmacy-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {/* Pharmacy section divider */}
                        <motion.div variants={fadeUp} className="flex items-center gap-3 pt-1">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-200 dark:via-cyan-800 to-transparent" />
                          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                            Pharmacy Compliance & Info
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-cyan-200 dark:via-cyan-800 to-transparent" />
                        </motion.div>

                        <InputField
                          id="ownerName"
                          label="Owner Name"
                          icon={User}
                          placeholder="Owner's full name"
                          value={form.ownerName}
                          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                          required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            id="pharmacistName"
                            label="Regd. Pharmacist Name"
                            icon={User}
                            placeholder="Pharmacist name"
                            value={form.pharmacistName}
                            onChange={(e) => setForm({ ...form, pharmacistName: e.target.value })}
                            required
                          />
                          <InputField
                            id="pharmacistRegNo"
                            label="Pharmacist Reg Number"
                            icon={CheckCircle2}
                            placeholder="e.g. REG-1249-PH"
                            value={form.pharmacistRegNo}
                            onChange={(e) => setForm({ ...form, pharmacistRegNo: e.target.value })}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <InputField
                            id="dl20"
                            label="Drug License Form 20 No."
                            icon={CheckCircle2}
                            placeholder="Form 20 DL"
                            value={form.dl20}
                            onChange={(e) => setForm({ ...form, dl20: e.target.value.toUpperCase() })}
                            required
                          />
                          <InputField
                            id="dl21"
                            label="Drug License Form 21 No."
                            icon={CheckCircle2}
                            placeholder="Form 21 DL"
                            value={form.dl21}
                            onChange={(e) => setForm({ ...form, dl21: e.target.value.toUpperCase() })}
                            required
                          />
                        </div>

                        <InputField
                          id="gstin"
                          label="GSTIN Number"
                          icon={Award}
                          placeholder="15-character GSTIN"
                          value={form.gstin}
                          onChange={(e) => setForm({ ...form, gstin: e.target.value.toUpperCase() })}
                          required
                          minLength={15}
                          maxLength={15}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-2">
                            <InputField
                              id="address"
                              label="Physical Address"
                              icon={Building2}
                              placeholder="Sector, Street, City"
                              value={form.address}
                              onChange={(e) => setForm({ ...form, address: e.target.value })}
                              required
                            />
                          </div>
                          <InputField
                            id="pincode"
                            label="Pincode"
                            icon={Building2}
                            placeholder="6-digit PIN"
                            value={form.pincode}
                            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                            required
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Avatar Upload */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label
                    htmlFor="avatar"
                    className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
                  >
                    Profile Picture
                    <span className="normal-case text-slate-400 ml-1 font-normal">(optional)</span>
                  </Label>
                  <label
                    htmlFor="avatar"
                    className="flex items-center gap-3 h-12 px-4 bg-white/60 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-xl cursor-pointer hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10 hover:border-cyan-400 transition-all duration-200 group"
                  >
                    <ImagePlus className="h-4 w-4 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    <span className="text-sm text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                      {form.avatar ? "Change photo" : "Upload profile photo"}
                    </span>
                    <input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <AnimatePresence>
                    {form.avatar && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        className="flex items-center gap-3 mt-2 p-2 rounded-xl bg-cyan-50/80 dark:bg-cyan-900/20 border border-cyan-200/50 dark:border-cyan-800/30"
                      >
                        <Image
                          src={form.avatar}
                          alt="Preview"
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-cyan-400/50"
                        />
                        <span className="text-xs text-cyan-700 dark:text-cyan-300 font-medium flex-1">
                          Photo selected ✓
                        </span>
                        <button
                          type="button"
                          onClick={() => setForm({ ...form, avatar: "" })}
                          className="text-xs text-slate-500 hover:text-red-500 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          Remove
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Password */}
                <InputField
                  id="password"
                  label="Password"
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  minLength={6}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  }
                />

                {/* Submit Button */}
                <motion.div variants={fadeUp} className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full h-13 py-3.5 rounded-2xl font-semibold text-white text-sm overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600 transition-all duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating Account…
                        </>
                      ) : (
                        <>
                          {form.role === "DOCTOR" ? (
                            <Stethoscope className="h-4 w-4" />
                          ) : form.role === "PATHOLOGIST" ? (
                            <Microscope className="h-4 w-4" />
                          ) : form.role === "PHARMACY" ? (
                            <Building2 className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                          {form.role === "DOCTOR"
                            ? "Register as Doctor"
                            : form.role === "PATHOLOGIST"
                            ? "Register as Pathologist"
                            : form.role === "PHARMACY"
                            ? "Register Pharmacy & Verify"
                            : "Create Account"}
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </form>

            {/* Footer link */}
            <motion.div
              variants={fadeUp}
              className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400"
            >
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors underline-offset-2 hover:underline"
              >
                Sign In
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-400"
        >
          {["HIPAA Compliant", "256-bit Encrypted", "Trusted by 10K+ Users"].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-500" />
              {badge}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-2 border-cyan-200 dark:border-cyan-900" />
            <div className="absolute inset-0 h-12 w-12 rounded-full border-2 border-t-cyan-500 animate-spin" />
          </div>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
