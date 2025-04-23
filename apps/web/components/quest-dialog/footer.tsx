"use client";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { LucideIcon } from "lucide-react";
import { getQuestColorStyles } from "./types";

interface QuestDialogFooterProps {
  themeColor: "blue" | "orange";
  actionButtonLabel: string;
  isDisabled: boolean;
  isPending: boolean;
  icon: LucideIcon;
  onAction: () => void;
}

export function QuestDialogFooter({
  themeColor,
  actionButtonLabel,
  isDisabled,
  isPending,
  icon: Icon,
  onAction,
}: QuestDialogFooterProps) {
  const colorStyles = getQuestColorStyles(themeColor);

  return (
    <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800/50 flex-none px-6 pb-6 relative">
      <DialogClose asChild>
        <Button
          variant="outline"
          className="bg-zinc-800/30 hover:bg-zinc-700/50 border-zinc-700/50 text-zinc-300"
        >
          Cancel
        </Button>
      </DialogClose>
      <Button
        onClick={onAction}
        className={`bg-gradient-to-r ${colorStyles.buttonGradient} border-0 text-white shadow-lg ${colorStyles.buttonShadow}`}
        disabled={isDisabled || isPending}
      >
        {isPending ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
            <span>Creating...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{actionButtonLabel}</span>
          </div>
        )}
      </Button>
    </div>
  );
}
