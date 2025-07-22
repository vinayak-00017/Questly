"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProfileErrorProps {
  type: "unauthorized" | "error";
  onRetry?: () => void;
}

export const ProfileError: React.FC<ProfileErrorProps> = ({ type, onRetry }) => {
  if (type === "unauthorized") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-black/50 border-zinc-800/50 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-medieval text-white mb-3">
                Access Denied
              </h2>
              <p className="text-zinc-400 text-sm mb-6">
                Please sign in to view your adventurer profile and continue your quest journey.
              </p>
              <Button
                onClick={() => window.location.href = "/auth/signin"}
                className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold"
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md bg-black/50 border-zinc-800/50 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600/20 to-orange-600/20 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
            <h2 className="text-2xl font-medieval text-white mb-3">
              Quest Data Unavailable
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              We encountered an issue loading your profile. The realm's data crystals seem to be flickering.
            </p>
            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white font-semibold"
              >
                Retry Quest Loading
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};