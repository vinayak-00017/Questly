"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Swords, Key, Mail, ArrowRight, Scroll } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AuthBackground,
  AuthFormCard,
  AuthHeader,
  FormInput,
  SocialLoginButtons,
} from "@/components/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign in with email/password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authClient.signIn.email({
        email,
        password,
        callbackURL: `http://localhost:3000/`,
      });
    } catch (err) {
      setError("Failed to embark on your journey. Check your scroll and key.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `http://localhost:3000/`,
      });
    } catch (err) {
      setError("Failed to summon the Google portal.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign in as guest (anonymous auth)
  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      await authClient.signIn.anonymous();
      router.push("/");
    } catch (err) {
      setError("Failed to enter as a traveler.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background with particles */}
      <AuthBackground variant="amber" />

      <div className="z-10 w-full max-w-md">
        {/* Header with title and icon */}
        <AuthHeader
          icon={<Swords className="h-12 w-12 text-amber-400" />}
          title="Rejoin Your Quest"
          subtitle="Sign in and continue your epic journey"
          variant="amber"
        />

        {/* Login form card */}
        <AuthFormCard error={error} variant="amber">
          <form onSubmit={handleSignIn} className="space-y-6">
            <FormInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@realm.com"
              required
              icon={<Mail className="h-4 w-4 text-zinc-500" />}
              label="Your Scroll (Email)"
            />

            <div className="space-y-2">
              <FormInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                icon={<Key className="h-4 w-4 text-zinc-500" />}
                label="Your Key (Password)"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-amber-500/70 hover:text-amber-400 transition-colors"
                >
                  Lost your key?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white border-none shadow-lg shadow-amber-900/20 transition-all duration-300 group"
              >
                {isLoading ? (
                  "Opening portal..."
                ) : (
                  <>
                    <span>Enter the Realm</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Social login buttons */}
          <SocialLoginButtons
            onGoogleLogin={handleGoogleSignIn}
            onGuestLogin={handleGuestSignIn}
            isLoading={isLoading}
            variant="amber"
          />
        </AuthFormCard>

        {/* Register link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-zinc-400 text-sm">
            New to Questly?{" "}
            <Link
              href="/register"
              className="text-amber-500 hover:text-amber-400 transition-colors font-medium"
            >
              Start your adventure
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
