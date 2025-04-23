"use client";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BaseQuestDialogStyleProps, getQuestColorStyles } from "./types";

export function QuestDialogHeader({
  icon: Icon,
  themeColor,
  title,
  description,
}: BaseQuestDialogStyleProps) {
  const colorStyles = getQuestColorStyles(themeColor);

  return (
    <DialogHeader className="flex-none px-6 pt-6 pb-2 relative">
      <div className="flex items-center gap-3 mb-1">
        <div
          className={`bg-black/40 w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-1 ${colorStyles.iconBg}`}
        >
          <Icon className={`h-4 w-4 ${colorStyles.iconColor}`} />
        </div>
        <DialogTitle className="text-xl font-medieval text-white/90">
          {title}
        </DialogTitle>
      </div>
      <p className="text-zinc-400 text-xs mt-1">{description}</p>
    </DialogHeader>
  );
}
