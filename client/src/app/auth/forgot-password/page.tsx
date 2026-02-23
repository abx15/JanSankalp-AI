"use client";

import { useState } from "react";
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
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // For development, show the OTP (remove in production)
        if (data.debug?.otp) {
          setMessage(
            `${data.message || "OTP sent"}. Development OTP: ${data.debug.otp}`,
          );
        }
        // Redirect to OTP verification page after 2 seconds
        setTimeout(() => {
          router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        const errorMessage =
          typeof data.error === "object" && data.error.message
            ? data.error.message
            : data.error || "Something went wrong";

        setError(errorMessage);

        if (data.needsRegistration) {
          // SUGGESTION: Don't redirect automatically if they need to see the error
          // user can click the link manually
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    }

    setLoading(false);
  };

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
              Forgot Password
            </CardTitle>
          </div>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you an OTP to reset
            your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && typeof message === "string" && (
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded-md text-center">
                {message}
                {message.toLowerCase().includes("development otp") && (
                  <div className="mt-2 text-xs">
                    <strong>For Testing:</strong> Use the OTP shown above
                  </div>
                )}
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 text-sm p-3 rounded-md text-center">
                {typeof error === "string" ? error : "An error occurred"}
                {typeof error === "string" &&
                  error.toLowerCase().includes("register") && (
                    <div className="mt-2">
                      <Link
                        href="/auth/signup"
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Create an account →
                      </Link>
                    </div>
                  )}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Development testing section */}
            {process.env.NODE_ENV === "development" && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-xs text-blue-700 font-medium mb-2">
                  🧪 Development Testing:
                </p>
                <button
                  type="button"
                  onClick={async () => {
                    if (!email) {
                      setError("Please enter an email first");
                      return;
                    }
                    try {
                      const response = await fetch("/api/test-email", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                      });
                      const data = await response.json();
                      if (response.ok) {
                        setMessage(`Test email sent! OTP: ${data.otp}`);
                      } else {
                        setError(`Test failed: ${data.error}`);
                      }
                    } catch (error) {
                      setError("Test email failed");
                    }
                  }}
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Test Email Service
                </button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              className="w-full flex gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Send OTP <Mail className="w-4 h-4" />
                </>
              )}
            </Button>
            <Link
              href="/auth/signin"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
