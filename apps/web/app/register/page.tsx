"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, Mail, User, Sparkles } from "lucide-react";
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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign up with email/password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });
      router.push("/");
    } catch (err) {
      setError(
        "Failed to create your adventure log. Try a different scroll name or key."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with Google
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      await authClient.signIn.social({
        provider: "google",
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
      {/* Background and particles */}
      <AuthBackground variant="purple" />

      <div className="z-10 w-full max-w-md">
        {/* Header with title and icon */}
        <AuthHeader
          icon={<Sparkles className="h-12 w-12 text-purple-400" />}
          title="Begin Your Adventure"
          subtitle="Create your adventurer's profile and embark on an epic journey"
          variant="purple"
        />

        {/* Register form card */}
        <AuthFormCard error={error} variant="purple">
          <form onSubmit={handleSignUp} className="space-y-6">
            <FormInput
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Noble Adventurer"
              required
              icon={<User className="h-4 w-4 text-zinc-500" />}
              label="Adventurer Name"
            />

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
                label="Create a Key (Password)"
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              <p className="text-xs text-zinc-500">
                At least 8 characters with epic strength
              </p>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500 text-white border-none shadow-lg shadow-purple-900/20 transition-all duration-300 group"
              >
                {isLoading ? (
                  "Forging your destiny..."
                ) : (
                  <>
                    <span>Begin Your Quest</span>
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Social login options */}
          <SocialLoginButtons
            onGoogleLogin={handleGoogleSignUp}
            onGuestLogin={handleGuestSignIn}
            isLoading={isLoading}
            variant="purple"
          />
        </AuthFormCard>

        {/* Login link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-zinc-400 text-sm">
            Already a legendary hero?{" "}
            <Link
              href="/login"
              className="text-purple-500 hover:text-purple-400 transition-colors font-medium"
            >
              Return to your quest
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
