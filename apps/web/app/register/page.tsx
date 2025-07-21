"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Key, Mail, User, Sparkles, AlertTriangle, CheckCircle } from "lucide-react";
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
import { TimezoneSelectDialog } from "@/components/timezone-select-dialog";
import { useAnonymousUser } from "@/components/anonymous-login-provider";
import { registerSchema, type RegisterFormData } from "@/lib/validation/auth-schemas";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTimezoneDialog, setShowTimezoneDialog] = useState(false);
  const { isAnonymous } = useAnonymousUser();

  // Form validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  // Real-time validation
  const validateField = (field: keyof RegisterFormData, value: string) => {
    try {
      registerSchema.shape[field].parse(value);
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    } catch (error: any) {
      const errorMessage = error.errors?.[0]?.message || "Invalid input";
      setFieldErrors(prev => ({ ...prev, [field]: errorMessage }));
    }
  };

  // Validate entire form
  const validateForm = (): boolean => {
    try {
      registerSchema.parse({ name, email, password });
      setFieldErrors({});
      return true;
    } catch (error: any) {
      const errors: { [key: string]: string } = {};
      error.errors?.forEach((err: any) => {
        if (err.path?.[0]) {
          errors[err.path[0]] = err.message;
        }
      });
      setFieldErrors(errors);
      return false;
    }
  };

  // Handle timezone selection completion
  const handleTimezoneComplete = () => {
    router.push("/");
  };

  // Sign up with email/password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Quest creation blocked", {
        description: "Please fix the errors in your adventurer profile",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}`,
      });

      // Check if the result contains an error
      if (result?.error) {
        toast.error("Adventure creation failed", {
          description: "This scroll address may already be claimed by another adventurer",
          icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        });
        return;
      }

      // Success case
      toast.success("Welcome to the realm, brave adventurer!", {
        description: "Your epic journey begins now...",
        icon: <CheckCircle className="h-4 w-4 text-purple-500" />,
      });
      
      // Redirect to homepage after successful registration
      router.push("/");
    } catch (err: any) {
      console.error("Registration error:", err);
      
      toast.error("Adventure creation failed", {
        description: "The realm's scribes are overwhelmed. Try again, brave soul.",
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with Google
  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      // We need to keep callbackURL for social auth, but we'll check for timezone in the callback page
      await authClient.signIn.social({
        provider: "google",
        callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?showTimezone=true`,
      });
    } catch (err) {
      setError("Failed to summon the Google portal.");
      console.error(err);
      setIsLoading(false);
    }
  };

  // Sign in as guest (anonymous auth)
  const handleGuestSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (isAnonymous) {
        // Already anonymous, just redirect
        router.push("/");
        return;
      }
      await authClient.signIn.anonymous();
      setShowTimezoneDialog(true);
    } catch (err) {
      setError("Failed to enter as a traveler.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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
              <div className="space-y-2">
                <FormInput
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value) validateField('name', e.target.value);
                  }}
                  onBlur={() => name && validateField('name', name)}
                  placeholder="Noble Adventurer"
                  required
                  icon={<User className="h-4 w-4 text-zinc-500" />}
                  label="Adventurer Name"
                  error={fieldErrors.name}
                />
                {fieldErrors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {fieldErrors.name}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <FormInput
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) validateField('email', e.target.value);
                  }}
                  onBlur={() => email && validateField('email', email)}
                  placeholder="your-email@realm.com"
                  required
                  icon={<Mail className="h-4 w-4 text-zinc-500" />}
                  label="Your Scroll (Email)"
                  error={fieldErrors.email}
                />
                {fieldErrors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {fieldErrors.email}
                  </motion.p>
                )}
              </div>

              <div className="space-y-2">
                <FormInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) validateField('password', e.target.value);
                  }}
                  onBlur={() => password && validateField('password', password)}
                  placeholder="••••••••"
                  required
                  icon={<Key className="h-4 w-4 text-zinc-500" />}
                  label="Create a Key (Password)"
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={fieldErrors.password}
                />
                {fieldErrors.password ? (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" />
                    {fieldErrors.password}
                  </motion.p>
                ) : (
                  <p className="text-xs text-zinc-500">
                    At least 8 characters with at least one letter and one number
                  </p>
                )}
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
      <TimezoneSelectDialog
        open={showTimezoneDialog}
        onOpenChange={setShowTimezoneDialog}
        onComplete={handleTimezoneComplete}
      />
    </>
  );
}
