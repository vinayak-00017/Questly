"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { QuestPriority } from "@questly/types";

// Theme styles for both blue and orange color schemes
export const getQuestColorStyles = (themeColor: "blue" | "orange") => {
  const styles = {
    blue: {
      headerBorder: "border-blue-800/30",
      cornerBorder: "border-blue-500/30",
      iconBg: "ring-blue-500/30",
      iconColor: "text-blue-500",
      labelColor: "text-blue-400",
      focusBorder: "focus:border-blue-500",
      hoverBorder: "hover:border-blue-500/30",
      infoGradient: "from-blue-500/5 to-purple-500/5",
      infoBorder: "border-blue-900/20",
      infoIconColor: "text-blue-500/70",
      infoTextColor: "text-blue-400",
      buttonGradient:
        "from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500",
      buttonShadow: "shadow-blue-900/20",
      particles: "bg-blue-500/10",
    },
    orange: {
      headerBorder: "border-orange-800/30",
      cornerBorder: "border-orange-500/30",
      iconBg: "ring-orange-500/30",
      iconColor: "text-orange-500",
      labelColor: "text-orange-400",
      focusBorder: "focus:border-orange-500",
      hoverBorder: "hover:border-orange-500/30",
      infoGradient: "from-orange-500/5 to-red-500/5",
      infoBorder: "border-orange-900/20",
      infoIconColor: "text-orange-500/70",
      infoTextColor: "text-orange-400",
      buttonGradient:
        "from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500",
      buttonShadow: "shadow-orange-900/20",
      particles: "bg-orange-500/10",
    },
  };

  return styles[themeColor];
};

export interface QuestFormData {
  title: string;
  description: string;
  priority: QuestPriority;
  dateValue: any;
  parentQuestId?: string;
}

export interface QuestFormFieldsProps {
  formData: QuestFormData;
  onUpdateForm: (field: keyof QuestFormData, value: any) => void;
  themeColor: "blue" | "orange";
  renderDateField: (props: {
    className?: string;
    onChange: (value: any) => void;
    value: any;
  }) => ReactNode;
  mainQuestsIds: any[];
  InfoIcon?: LucideIcon;
  infoTitle?: string;
  infoText?: string;
  errors?: Record<string, string>;
}

// Keeping this type for backward compatibility, but recommending usage of QuestFormFieldsProps instead
export interface QuestFormProps extends QuestFormFieldsProps {
  onSubmit: () => void;
  onCancel: () => void;
  questType: string;
  buttonColor: string;
  buttonHoverColor: string;
  submitButtonText: string;
}

export interface BaseQuestDialogStyleProps {
  icon: LucideIcon;
  themeColor: "blue" | "orange";
  title: string;
  description: string;
}
