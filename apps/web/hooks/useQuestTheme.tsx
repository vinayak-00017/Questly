export function useQuestTheme(themeColor: "blue" | "orange") {
  // Color-specific styles based on theme
  const baseStyles = {
    blue: {
      gradient: "from-blue-600/10 via-transparent to-purple-700/10",
      particleColor: "bg-blue-500/20",
      iconBg: "ring-blue-500/30",
      iconColor: "text-blue-500",
      hoverBorder: "hover:border-blue-500/50",
      cardHoverBorder: "hover:border-blue-500/30",
      cornerBorder: "border-blue-500/30",
      typeLabel: "text-blue-500/80",
      xpColor: "text-blue-400",
      iconHover: "group-hover:bg-blue-500/20 group-hover:ring-blue-500/50",
      iconHoverText: "group-hover:text-blue-400",
      buttonBorder: "border-blue-800/30",
      emptyBtnGradient:
        "from-blue-700/50 to-purple-700/50 hover:from-blue-600/50 hover:to-purple-600/50 border-blue-800/50",
      expandedBg: "bg-blue-900/10",
      taskItemBorder: "border-blue-700/30",
      taskItemBg: "bg-blue-900/20",
      inputBorder: "border-blue-700/50 focus:border-blue-500",
      addButtonBg: "bg-blue-700 hover:bg-blue-600",
      completeButtonBg: "bg-green-700 hover:bg-green-600",
    },
    orange: {
      gradient: "from-red-600/10 via-transparent to-orange-700/10",
      particleColor: "bg-orange-500/20",
      iconBg: "ring-orange-500/30",
      iconColor: "text-orange-500",
      hoverBorder: "hover:border-orange-500/50",
      cardHoverBorder: "hover:border-orange-500/30",
      cornerBorder: "border-orange-500/30",
      typeLabel: "text-orange-500/80",
      xpColor: "text-orange-400",
      iconHover: "group-hover:bg-orange-500/20 group-hover:ring-orange-500/50",
      iconHoverText: "group-hover:text-orange-400",
      buttonBorder: "border-orange-800/30",
      emptyBtnGradient:
        "from-orange-700/50 to-red-700/50 hover:from-orange-600/50 hover:to-red-600/50 border-orange-800/50",
      expandedBg: "bg-orange-900/10",
      taskItemBorder: "border-orange-700/30",
      taskItemBg: "bg-orange-900/20",
      inputBorder: "border-orange-700/50 focus:border-orange-500",
      addButtonBg: "bg-orange-700 hover:bg-orange-600",
      completeButtonBg: "bg-green-700 hover:bg-green-600",
    },
  };
  return baseStyles[themeColor];
}
