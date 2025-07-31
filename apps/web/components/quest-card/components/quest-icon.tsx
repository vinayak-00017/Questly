import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ColorStyles {
  iconBg?: string;
  iconColor?: string;
  cardHoverBorder?: string;
  typeLabel?: string;
  gradient?: string;
}

interface QuestIconProps {
  Icon: LucideIcon;
  isCompleted: boolean;
  colorStyles: ColorStyles;
  size?: "sm" | "md" | "lg";
}

const QuestIcon = ({
  Icon,
  isCompleted,
  colorStyles,
  size = "md",
}: QuestIconProps) => {
  const sizeClasses = {
    sm: { container: "h-5 w-5", icon: "h-3 w-3" },
    md: { container: "h-8 w-8", icon: "h-4 w-4" },
    lg: { container: "h-10 w-10", icon: "h-5 w-5" },
  };

  const { container, icon } = sizeClasses[size];

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center ring-1",
        container,
        isCompleted
          ? "bg-green-900/40 ring-green-500/50"
          : colorStyles.iconBg
            ? colorStyles.iconBg
            : "bg-black/40"
      )}
    >
      <Icon
        className={cn(
          icon,
          isCompleted ? "text-green-400" : colorStyles.iconColor
        )}
      />
    </div>
  );
};

export default QuestIcon;
