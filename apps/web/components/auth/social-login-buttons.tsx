"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Image from "next/image";

interface SocialLoginButtonsProps {
  onGoogleLogin: () => Promise<void>;
  onGuestLogin: () => Promise<void>;
  isLoading: boolean;
  variant?: "purple" | "amber";
}

export const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({
  onGoogleLogin,
  onGuestLogin,
  isLoading,
  variant = "purple",
}) => {
  const hoverBorderColor =
    variant === "purple"
      ? "hover:border-purple-700/50"
      : "hover:border-amber-700/50";

  const iconColor = variant === "purple" ? "text-purple-500" : "text-amber-500";

  return (
    <>
      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black/40 text-zinc-400 flex items-center gap-1">
            <span className={`h-3 w-3 ${iconColor}`}>✦</span>
            <span>Or continue with</span>
            <span className={`h-3 w-3 ${iconColor}`}>✦</span>
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3">
        <Button
          onClick={onGoogleLogin}
          disabled={isLoading}
          variant="outline"
          className={`bg-black/20 border-zinc-800 hover:bg-black/40 ${hoverBorderColor} text-white`}
        >
          <div className="w-4 h-4 mr-2 relative">
            <Image
              src="/google-icon.svg"
              alt="Google"
              width={16}
              height={16}
              className="absolute inset-0"
            />
          </div>
          Sign in with Google
        </Button>

        <Button
          onClick={onGuestLogin}
          disabled={isLoading}
          variant="outline"
          className={`bg-black/20 border-zinc-800 hover:bg-black/40 ${hoverBorderColor} text-white`}
        >
          <BookOpen className={`h-4 w-4 mr-2 ${iconColor}`} />
          Continue as Guest
        </Button>
      </div>
    </>
  );
};
