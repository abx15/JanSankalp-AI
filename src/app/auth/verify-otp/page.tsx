"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyOTPForm() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/auth/forgot-password");
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email || "", otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Store reset token and redirect to reset password page
        localStorage.setItem('resetToken', data.resetToken);
        localStorage.setItem('resetEmail', email || "");
        setTimeout(() => {
          router.push("/auth/reset-password");
        }, 1000);
      } else {
        setError(data.error || "Invalid OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email || "" }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("New OTP sent to your email");
        setTimeLeft(600); // Reset timer to 10 minutes
        setOtp(""); // Clear OTP input
      } else {
        setError(data.error || "Failed to resend OTP");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }

    setResendLoading(false);
  };

  const handleOtpChange = (value: string) => {
    // Only allow numbers and max 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setOtp(numericValue);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1">
          <div className="flex flex-col items-center justify-center gap-4 mb-2">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-transparent rounded-2xl flex items-center justify-center overflow-hidden relative">
              <Image
                src="/logojansanklp.png"
                alt="JanSankalp AI Logo"
                fill
                className="object-contain scale-110"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Verify OTP
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            Enter the 6-digit OTP sent to {email}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md text-center">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Enter OTP</label>
              <Input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => handleOtpChange(e.target.value)}
                maxLength={6}
                className="text-center text-2xl font-bold tracking-widest"
                required
                disabled={loading}
              />
              <div className="text-center text-sm text-muted-foreground">
                {timeLeft > 0 ? (
                  <span>OTP expires in {formatTime(timeLeft)}</span>
                ) : (
                  <span className="text-destructive">OTP has expired</span>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full flex gap-2"
              type="submit"
              disabled={loading || otp.length !== 6 || timeLeft === 0}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Verify OTP <Shield className="w-4 h-4" />
                </>
              )}
            </Button>
            
            <div className="flex flex-col gap-2 w-full">
              <Button
                type="button"
                variant="outline"
                className="w-full flex gap-2"
                onClick={handleResendOTP}
                disabled={resendLoading || timeLeft > 540} // Allow resend after 1 minute
              >
                {resendLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </>
                )}
              </Button>
              
              <Link
                href="/auth/forgot-password"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Forgot Password
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <VerifyOTPForm />
    </Suspense>
  );
}
