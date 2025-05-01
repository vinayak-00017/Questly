export function useQuestTheme(themeColor: "blue" | "orange" | "purple") {
  // Color-specific styles based on theme
  const baseStyles = {
    blue: {
      // Sky blue theme for Side Quests (from Option 1)
      gradient: "from-sky-600/10 via-transparent to-indigo-700/10",
      particleColor: "bg-sky-500/20",
      iconBg: "ring-sky-500/30",
      iconColor: "text-sky-500",
      hoverBorder: "hover:border-sky-500/50",
      cardHoverBorder: "hover:border-sky-500/30",
      cornerBorder: "border-sky-500/30",
      typeLabel: "text-sky-500/80",
      xpColor: "text-sky-400",
      iconHover: "group-hover:bg-sky-500/20 group-hover:ring-sky-500/50",
      iconHoverText: "group-hover:text-sky-400",
      buttonBorder: "border-sky-800/30",
      emptyBtnGradient:
        "from-sky-700/50 to-indigo-700/50 hover:from-sky-600/50 hover:to-indigo-600/50 border-sky-800/50",
      expandedBg: "bg-sky-900/10",
      taskItemBorder: "border-sky-700/30",
      taskItemBg: "bg-sky-900/20",
      inputBorder: "border-sky-700/50 focus:border-sky-500",
      addButtonBg: "bg-sky-700 hover:bg-sky-600",
      completeButtonBg: "bg-green-700 hover:bg-green-600",
    },
    orange: {
      // Amber theme for Daily Quests (from Option 1)
      gradient: "from-amber-600/10 via-transparent to-orange-700/10",
      particleColor: "bg-amber-500/20",
      iconBg: "ring-amber-500/30",
      iconColor: "text-amber-500",
      hoverBorder: "hover:border-amber-500/50",
      cardHoverBorder: "hover:border-amber-500/30",
      cornerBorder: "border-amber-500/30",
      typeLabel: "text-amber-500/80",
      xpColor: "text-amber-400",
      iconHover: "group-hover:bg-amber-500/20 group-hover:ring-amber-500/50",
      iconHoverText: "group-hover:text-amber-400",
      buttonBorder: "border-amber-800/30",
      emptyBtnGradient:
        "from-amber-700/50 to-orange-700/50 hover:from-amber-600/50 hover:to-orange-600/50 border-amber-800/50",
      expandedBg: "bg-amber-900/10",
      taskItemBorder: "border-amber-700/30",
      taskItemBg: "bg-amber-900/20",
      inputBorder: "border-amber-700/50 focus:border-amber-500",
      addButtonBg: "bg-amber-700 hover:bg-amber-600",
      completeButtonBg: "bg-green-700 hover:bg-green-600",
    },
    purple: {
      // Neutral slate gray theme for Today's Quests
      gradient: "from-slate-600/10 via-transparent to-slate-700/10",
      particleColor: "bg-slate-500/20",
      iconBg: "ring-slate-500/30",
      iconColor: "text-slate-400",
      hoverBorder: "hover:border-slate-500/50",
      cardHoverBorder: "hover:border-slate-500/30",
      cornerBorder: "border-slate-500/30",
      typeLabel: "text-slate-400/80",
      xpColor: "text-slate-400",
      iconHover: "group-hover:bg-slate-500/20 group-hover:ring-slate-500/50",
      iconHoverText: "group-hover:text-slate-400",
      buttonBorder: "border-slate-700/30",
      emptyBtnGradient:
        "from-slate-700/50 to-slate-600/50 hover:from-slate-600/50 hover:to-slate-500/50 border-slate-700/50",
      expandedBg: "bg-slate-800/10",
      taskItemBorder: "border-slate-700/30",
      taskItemBg: "bg-slate-800/20",
      inputBorder: "border-slate-700/50 focus:border-slate-500",
      addButtonBg: "bg-slate-700 hover:bg-slate-600",
      completeButtonBg: "bg-green-700 hover:bg-green-600",
    },
  };
  return baseStyles[themeColor];
}
