"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Stripes } from "@/components/brand/Stripes";
import { ApiError } from "@/lib/api/client";
import { requestCode, verifyCode } from "@/lib/api/portal";
import { cn } from "@/lib/utils/cn";

const RESEND_COOLDOWN_SECONDS = 60;

function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams?.get("next") || "/";

  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (step === "code") codeInputRef.current?.focus();
  }, [step]);

  async function handleRequestCode(event?: React.FormEvent) {
    event?.preventDefault();
    if (email.trim() === "" || busy) return;

    setBusy(true);
    setError(null);
    try {
      await requestCode(email.trim());
      // The API answers the same way for unknown addresses, so we always move
      // on: never reveal whether an account exists.
      setStep("code");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(event?: React.FormEvent) {
    event?.preventDefault();
    if (code.trim().length < 6 || busy) return;

    setBusy(true);
    setError(null);
    try {
      await verifyCode(email.trim(), code.trim());
      router.replace(nextPath);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 429
          ? "Too many attempts. Please request a new code in a few minutes."
          : "That code is invalid or has expired.",
      );
      setBusy(false);
    }
  }

  return (
    <main className="portal-field flex min-h-screen flex-col items-center justify-center px-6 py-12 md:items-start md:px-[10%] lg:px-[14%]">
      <Stripes src="/stripes_footer.png" variant="fill" />

      {/* Left-aligned and offset from the right stripes on desktop. */}
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-start text-left">
          <Logo href={null} size="large" />
          <span aria-hidden="true" className="mt-6 block h-px w-14 bg-white/40" />
          <h1 className="mt-7 w-full text-3xl font-light text-white">Your journey begins here.</h1>
        </div>

        <div className="mt-10">
          {step === "email" ? (
            <form onSubmit={handleRequestCode} className="space-y-6">
              <div className="space-y-2.5">
                <label htmlFor="email" className="u-eyebrow block text-white">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    "w-full border-b border-white/35 bg-transparent px-0 py-2.5 text-base text-white",
                    "outline-none transition-colors placeholder:text-white/45 focus:border-white",
                  )}
                />
              </div>

              {error && <p className="text-sm text-red-200">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-3 border-2 border-white px-6 py-3.5",
                  "font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white",
                  "transition-colors hover:bg-white/10 disabled:cursor-not-allowed",
                )}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <p className="text-sm text-white/80">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-white">{email}</span>
              </p>

              <div className="space-y-2.5">
                <label htmlFor="code" className="u-eyebrow block text-white">
                  Your code
                </label>
                <input
                  id="code"
                  ref={codeInputRef}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className={cn(
                    "w-full border-b border-white/35 bg-transparent px-0 py-2.5",
                    "text-center font-display text-2xl tracking-[0.6em] text-white",
                    "outline-none transition-colors placeholder:text-white/30 focus:border-white",
                  )}
                />
              </div>

              {error && <p className="text-sm text-red-200">{error}</p>}

              <button
                type="submit"
                disabled={busy || code.length < 6}
                className={cn(
                  "inline-flex w-full items-center justify-center gap-3 border-2 border-white px-6 py-3.5",
                  "font-display text-[12px] font-semibold uppercase tracking-[0.18em] text-white",
                  "transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60",
                )}
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />}
                Enter my space
              </button>

              <div className="flex items-center justify-between pt-1 text-xs text-white/70">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError(null);
                  }}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Change email
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestCode()}
                  disabled={cooldown > 0 || busy}
                  className="transition-colors hover:text-white disabled:opacity-50"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-10 text-xs text-white/50">
          <Link href="/legal/terms" className="underline underline-offset-2 hover:text-white/80">
            Terms &amp; Conditions
          </Link>
          <span className="mx-2">·</span>
          <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-white/80">
            Privacy Policy
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="portal-field min-h-screen" />}>
      <LoginScreen />
    </Suspense>
  );
}
