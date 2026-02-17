"use client";

import { signIn } from "next-auth/react";
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
import { LogIn, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import { Suspense } from "react";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl,
    });

    if ((result as any)?.error) {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
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
            Sign In
          </CardTitle>
        </div>
        <CardDescription className="text-center">
          Access the JanSankalp AI Dashboard
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
              {error}
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
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="text-right">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
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
                Sign In <LogIn className="w-4 h-4" />
              </>
            )}
          </Button>
          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-semibold hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Suspense
        fallback={<Loader2 className="w-8 h-8 animate-spin text-primary" />}
      >
        <SignInForm />
      </Suspense>
    </div>
  );
}
