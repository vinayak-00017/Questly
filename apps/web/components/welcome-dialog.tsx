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
import { Separator } from "@/components/ui/separator";
import { Swords, UserCheck, UserPlus, Crown, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface WelcomeDialogProps {
  open: boolean;
  onContinueAsGuest: () => void;
  onSignIn: () => void;
}

export function WelcomeDialog({
  open,
  onContinueAsGuest,
  onSignIn,
}: WelcomeDialogProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinueAsGuest = async () => {
    setIsLoading(true);
    try {
      await onContinueAsGuest();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    onSignIn();
    router.push("/login");
  };

  const handleCreateAccount = () => {
    onSignIn();
    router.push("/register");
  };

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent className=" [&>button]:hidden sm:max-w-md border-zinc-700 bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-sm text-zinc-100">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 shadow-xl border border-zinc-600">
            <Swords className="h-8 w-8 text-zinc-300" />
          </div>
          <DialogTitle className="text-2xl font-bold text-zinc-100 flex items-center justify-center gap-2">
            Choose Your Path
            <Sparkles className="h-5 w-5 text-zinc-400" />
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Begin your quest management adventure. Select how you wish to
            proceed on your journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Continue as Guest Option - Now at top and emphasized */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-600/30 to-orange-500/30 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <Button
              onClick={handleContinueAsGuest}
              disabled={isLoading}
              className="relative w-full h-14 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-zinc-100 font-bold text-lg shadow-lg transition-all duration-200 border border-orange-500/30 hover:border-orange-400/50"
              title="Start exploring immediately without creating an account. Your progress will be saved temporarily in your browser."
            >
              <UserPlus className="h-6 w-6 mr-3 text-orange-400" />
              {isLoading
                ? "Entering the Realm..."
                : "🎭 Continue as Guest Adventurer"}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full border-zinc-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-3 text-zinc-500 font-medium">
                Or log in as a permanent adventurer
              </span>
            </div>
          </div>

          {/* Sign In Option */}
          <Button
            onClick={handleSignIn}
            variant="outline"
            className="w-full h-12 border-2 border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-orange-500/50 font-medium text-base transition-all duration-200"
            title="Access your existing account with saved progress, settings, and achievements across all devices."
          >
            <UserCheck className="h-5 w-5 mr-3" />
            Sign In to Existing Account
          </Button>

          {/* Create Account Option */}
          <Button
            onClick={handleCreateAccount}
            variant="outline"
            className="w-full h-12 border-2 border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 hover:border-orange-500/50 font-medium text-base transition-all duration-200"
            title="Create a new permanent account to save progress forever, sync across devices, and unlock premium features."
          >
            <Crown className="h-5 w-5 mr-3 text-orange-400" />
            Register for free
          </Button>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-zinc-500">
            💡 <span className="text-zinc-400">Tip:</span> Guest adventurers can
            upgrade to permanent accounts anytime without losing progress.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
