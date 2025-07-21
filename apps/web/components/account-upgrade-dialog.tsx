"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Crown, Mail, Key } from "lucide-react";
import { useAnonymousUser } from "./anonymous-login-provider";

interface AccountUpgradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountUpgradeDialog({
  open,
  onOpenChange,
}: AccountUpgradeDialogProps) {
  const { upgradeAccount, upgradeWithOAuth } = useAnonymousUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [upgradeMethod, setUpgradeMethod] = useState<"email" | "oauth">(
    "email"
  );

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await upgradeAccount(email, password);

      if (result.success) {
        onOpenChange(false);
        // Reset form
        setEmail("");
        setPassword("");
      } else {
        setError(result.error || "Failed to upgrade account");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthUpgrade = async (provider: "google") => {
    setIsLoading(true);
    setError("");

    try {
      const result = await upgradeWithOAuth(provider);

      if (result.success) {
        // OAuth will redirect, so we don't need to close the dialog here
        // The callback will handle the completion
      } else {
        setError(result.error || "Failed to upgrade account with OAuth");
      }
    } catch (error) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEmail("");
    setPassword("");
    setError("");
    setUpgradeMethod("email");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <Crown className="h-5 w-5" />
            Upgrade Your Account
          </DialogTitle>
          <DialogDescription className="text-amber-600">
            Transform your guest journey into a permanent adventure! Create an
            account to save your progress forever.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OAuth Upgrade Options */}
        <div className="space-y-3">
          <Button
            onClick={() => handleOAuthUpgrade("google")}
            disabled={isLoading}
            variant="outline"
            className="w-full flex items-center gap-3 border-amber-200 hover:bg-amber-50"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isLoading ? "Upgrading..." : "Continue with Google"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or upgrade with email
              </span>
            </div>
          </div>
        </div>

        {/* Email/Password Upgrade Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="flex items-center gap-2 text-amber-700"
            >
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border-amber-200 focus:border-amber-400"
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="flex items-center gap-2 text-amber-700"
            >
              <Key className="h-4 w-4" />
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a secure password"
                className="border-amber-200 focus:border-amber-400 pr-10"
                disabled={isLoading}
                required
                minLength={6}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-amber-600" />
                ) : (
                  <Eye className="h-4 w-4 text-amber-600" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isLoading ? "Upgrading..." : "Upgrade Account"}
            </Button>
          </div>
        </form>

        <div className="text-xs text-amber-600 bg-gray-800 p-3 rounded-lg">
          <strong>Note:</strong> If an account with this email or OAuth provider
          already exists, you'll need to sign in with that account instead. This
          prevents accidentally overriding existing user data.
        </div>
      </DialogContent>
    </Dialog>
  );
}
