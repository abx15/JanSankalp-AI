"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

function VerifyForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Resend state
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        typeof err.error === "object" && err.error.message
          ? err.error.message
          : err.message || "Verification failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;

    setResendLoading(true);
    setError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend");
      }

      setResendMessage(data.message || "Code sent!");
      if (data.debug?.token) {
        console.log("Dev Token:", data.debug.token);
        setResendMessage(`Code sent! (Dev: ${data.debug.token})`);
      }
    } catch (err: any) {
      const errorMessage =
        typeof err.error === "object" && err.error.message
          ? err.error.message
          : err.message || "Failed to resend";
      setError(errorMessage);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-0 shadow-2xl rounded-[2.5rem] overflow-hidden">
      <CardHeader className="space-y-1 text-center pb-8 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-black tracking-tight">
          Verify Email
        </CardTitle>
        <CardDescription className="text-base">
          We&apos;ve sent a 6-digit code to <br />
          <span className="font-bold text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        {!success ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-2 focus:border-primary/50"
                disabled={loading}
              />
              {error && (
                <p className="text-sm font-bold text-destructive text-center">
                  {error}
                </p>
              )}
              {resendMessage && (
                <p className="text-sm font-bold text-green-600 text-center">
                  {resendMessage}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
              disabled={loading || otp.length !== 6}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Account"
              )}
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-primary font-bold hover:underline disabled:opacity-50"
                >
                  {resendLoading ? "Sending..." : "Resend"}
                </button>
              </p>
            </div>
          </form>
        ) : (
          <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-500">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Account Verified!</h3>
            <p className="text-muted-foreground">Redirecting you to login...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-8 flex flex-col items-center gap-4 group">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform relative">
          <Image
            src="/logojansanklp.png"
            alt="JanSankalp AI Logo"
            fill
            className="object-contain scale-110"
          />
        </div>
      </Link>

      <Suspense
        fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}
      >
        <VerifyForm />
      </Suspense>
    </div>
  );
}
