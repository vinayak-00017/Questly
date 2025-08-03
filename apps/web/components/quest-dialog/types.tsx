"use client";

import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { QuestPriority } from "@questly/types";

// Theme styles for blue, orange, and purple color schemes
export const getQuestColorStyles = (
  themeColor: "blue" | "orange" | "purple"
) => {
  const styles = {
    blue: {
      headerBorder: "border-[#00aaff]/30",
      cornerBorder: "border-[#00aaff]/30",
      iconBg: "ring-[#00aaff]/30",
      iconColor: "text-[#00aaff]",
      labelColor: "text-[#00aaff]",
      focusBorder: "focus:border-[#00aaff]",
      hoverBorder: "hover:border-[#00aaff]/30",
      infoGradient: "from-[#00aaff]/5 to-[#8c7ae6]/5",
      infoBorder: "border-[#00aaff]/20",
      infoIconColor: "text-[#00aaff]/70",
      infoTextColor: "text-[#00aaff]",
      buttonGradient:
        "from-[#00aaff] to-[#8c7ae6] hover:from-[#0099e6] hover:to-[#7c6ce0]",
      buttonShadow: "shadow-[#00aaff]/20",
      particles: "bg-[#00aaff]/10",
    },
    orange: {
      headerBorder: "border-[#f1c40f]/30",
      cornerBorder: "border-[#f1c40f]/30",
      iconBg: "ring-[#f1c40f]/30",
      iconColor: "text-[#f1c40f]",
      labelColor: "text-[#f1c40f]",
      focusBorder: "focus:border-[#f1c40f]",
      hoverBorder: "hover:border-[#f1c40f]/30",
      infoGradient: "from-[#f1c40f]/5 to-[#e74c3c]/5",
      infoBorder: "border-[#f1c40f]/20",
      infoIconColor: "text-[#f1c40f]/70",
      infoTextColor: "text-[#f1c40f]",
      buttonGradient:
        "from-[#f1c40f] to-[#e74c3c] hover:from-[#f39c12] hover:to-[#c0392b]",
      buttonShadow: "shadow-[#f1c40f]/20",
      particles: "bg-[#f1c40f]/10",
    },
    purple: {
      headerBorder: "border-[#8c7ae6]/30",
      cornerBorder: "border-[#8c7ae6]/30",
      iconBg: "ring-[#8c7ae6]/30",
      iconColor: "text-[#8c7ae6]",
      labelColor: "text-[#8c7ae6]",
      focusBorder: "focus:border-[#8c7ae6]",
      hoverBorder: "hover:border-[#8c7ae6]/30",
      infoGradient: "from-[#8c7ae6]/5 to-[#f1c40f]/5",
      infoBorder: "border-[#8c7ae6]/20",
      infoIconColor: "text-[#8c7ae6]/70",
      infoTextColor: "text-[#8c7ae6]",
      buttonGradient:
        "from-[#8c7ae6] to-[#f1c40f] hover:from-[#7c6ce0] hover:to-[#f39c12]",
      buttonShadow: "shadow-[#8c7ae6]/20",
      particles: "bg-[#8c7ae6]/10",
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
  themeColor: "blue" | "orange" | "purple";
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
  themeColor: "blue" | "orange" | "purple";
  title: string;
  description: string;
}
