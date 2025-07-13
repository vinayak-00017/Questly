"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Crown, X, AlertCircle } from "lucide-react";
import { useAnonymousUser } from "./anonymous-login-provider";
import { AccountUpgradeDialog } from "./account-upgrade-dialog";

export function AnonymousUserBanner() {
  const { isAnonymous } = useAnonymousUser();
  const [isVisible, setIsVisible] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  if (!isAnonymous || !isVisible) {
    return null;
  }

  return (
    <>
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-amber-800">
                <span className="font-medium">You're adventuring as a guest!</span>{" "}
                Your progress might be lost if you close your browser. Create an account to save your journey forever.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setShowUpgradeDialog(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white gap-2"
            >
              <Crown className="h-4 w-4" />
              Upgrade Account
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsVisible(false)}
              className="text-amber-600 hover:bg-amber-100 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AccountUpgradeDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
      />
    </>
  );
}
