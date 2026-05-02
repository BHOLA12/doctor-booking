"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Stethoscope, Eye, EyeOff, Loader2, Mail, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function LoginContent() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password);
    if (result.success) {
      toast.success("Login successful!");
      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } else {
      toast.error(result.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full bg-cyan-300/20 blur-[120px] animate-pulse-soft" />
        <div className="absolute -bottom-20 -left-40 h-[500px] w-[500px] rounded-full bg-teal-400/20 blur-[100px] animate-pulse-soft" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-sky-300/10 blur-[80px]" />
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
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {/* Header */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 to-teal-500 blur-xl opacity-50 scale-110" />
              <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 shadow-lg shadow-cyan-500/30">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-800 via-cyan-700 to-teal-600 dark:from-white dark:via-cyan-200 dark:to-teal-300 bg-clip-text text-transparent">
            Welcome back
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm">
            Sign in to your{" "}
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
              DocBook
            </span>{" "}
            account
          </p>
        </motion.div>

        {/* Glass Card */}
        <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden">
          {/* Gradient border */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-400/30 via-transparent to-teal-400/20 p-px">
            <div className="h-full w-full rounded-3xl bg-white/80 dark:bg-slate-900/80" />
          </div>

          <div className="relative backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-white/10 rounded-3xl shadow-2xl shadow-cyan-500/10 p-8">
            <form onSubmit={handleSubmit}>
              <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-5">
                {/* Email */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label
                    htmlFor="email"
                    className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
                  >
                    Email Address
                  </Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200 pointer-events-none" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-10 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 transition-all duration-200 shadow-sm hover:border-slate-300 dark:hover:border-white/20"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp} className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
                  >
                    Password
                  </Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors duration-200 pointer-events-none" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-10 pr-10 bg-white/60 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 rounded-xl text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-cyan-400/40 focus:border-cyan-400 focus:bg-white dark:focus:bg-white/10 transition-all duration-200 shadow-sm hover:border-slate-300 dark:hover:border-white/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp} className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full py-3.5 rounded-2xl font-semibold text-white text-sm overflow-hidden group disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-500 to-cyan-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Signing In…
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </>
                      )}
                    </span>
                  </button>
                </motion.div>
              </motion.div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent" />
              <span className="text-xs text-slate-400 font-medium">or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 dark:via-white/10 to-transparent" />
            </div>

            {/* Sign up link */}
            <motion.div
              variants={fadeUp}
              className="text-center text-sm text-slate-500 dark:text-slate-400"
            >
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:text-teal-600 dark:hover:text-teal-300 transition-colors underline-offset-2 hover:underline"
              >
                Sign Up
              </Link>
            </motion.div>

            {/* Demo Accounts */}
            <motion.div
              variants={fadeUp}
              className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-slate-50/80 to-cyan-50/50 dark:from-white/5 dark:to-cyan-900/10 border border-slate-200/60 dark:border-white/10"
            >
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Demo Accounts
              </p>
              <div className="space-y-1">
                {[
                  { label: "Admin", creds: "admin@docbook.com / admin123" },
                  { label: "Doctor", creds: "dr.sharma@docbook.com / password123" },
                  { label: "Patient", creds: "patient@docbook.com / password123" },
                ].map((item) => (
                  <p key={item.label} className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-slate-600 dark:text-slate-300">
                      {item.label}:
                    </span>{" "}
                    {item.creds}
                  </p>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          variants={fadeUp}
          className="mt-6 flex items-center justify-center gap-6 flex-wrap text-xs text-slate-400"
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

export default function LoginPage() {
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
      <LoginContent />
    </Suspense>
  );
}
