export function useQuestTheme(themeColor: "blue" | "orange" | "purple") {
  // Navy-amber color system with emerald and rose accents
  const baseStyles = {
    blue: {
      // Side Quests theme with muted teal accents
      gradient: "from-cyan-500/10 via-transparent to-cyan-500/5",
      particleColor: "bg-cyan-500/20",
      iconBg: "ring-cyan-500/30",
      iconColor: "text-cyan-500",
      hoverBorder: "hover:border-cyan-500/50",
      cardHoverBorder:
        "hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10",
      cornerBorder: "border-cyan-500/30",
      typeLabel: "text-muted-foreground hover:text-cyan-500 transition-colors",
      xpColor: "text-muted-foreground hover:text-cyan-500 transition-colors",
      iconHover: "group-hover:bg-cyan-500/20 group-hover:ring-cyan-500/50",
      iconHoverText: "group-hover:text-cyan-500",
      buttonBorder: "border-cyan-500/30",
      emptyBtnGradient:
        "from-cyan-500/50 to-cyan-500/30 hover:from-cyan-500/60 hover:to-cyan-500/40 border-cyan-500/50",
      expandedBg: "bg-cyan-500/10",
      taskItemBorder: "border-cyan-500/30",
      taskItemBg: "bg-cyan-500/20",
      inputBorder: "border-cyan-500/50 focus:border-cyan-500",
      addButtonBg:
        "bg-cyan-500 hover:bg-cyan-600 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25",
      completeButtonBg:
        "bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25",
    },
    orange: {
      // Primary amber theme for Daily Quests
      gradient: "from-primary/10 via-transparent to-primary/5",
      particleColor: "bg-primary/20",
      iconBg: "ring-primary/30",
      iconColor: "text-primary",
      hoverBorder: "hover:border-primary/50",
      cardHoverBorder:
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10",
      cornerBorder: "border-primary/30",
      typeLabel: "text-muted-foreground hover:text-primary transition-colors",
      xpColor: "text-muted-foreground hover:text-primary transition-colors",
      iconHover: "group-hover:bg-primary/20 group-hover:ring-primary/50",
      iconHoverText: "group-hover:text-primary",
      buttonBorder: "border-primary/30",
      emptyBtnGradient:
        "from-primary/50 to-primary/30 hover:from-primary/60 hover:to-primary/40 border-primary/50",
      expandedBg: "bg-primary/10",
      taskItemBorder: "border-primary/30",
      taskItemBg: "bg-primary/20",
      inputBorder: "border-primary/50 focus:border-primary",
      addButtonBg:
        "bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-primary/25",
      completeButtonBg:
        "bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25",
    },
    purple: {
      // Today's Quests theme with rose red accents
      gradient: "from-destructive/10 via-transparent to-destructive/5",
      particleColor: "bg-destructive/20",
      iconBg: "ring-destructive/30",
      iconColor: "text-destructive",
      hoverBorder: "hover:border-destructive/50",
      cardHoverBorder:
        "hover:border-destructive/30 hover:shadow-lg hover:shadow-destructive/10",
      cornerBorder: "border-destructive/30",
      typeLabel:
        "text-muted-foreground hover:text-destructive transition-colors",
      xpColor: "text-muted-foreground hover:text-destructive transition-colors",
      iconHover:
        "group-hover:bg-destructive/20 group-hover:ring-destructive/50",
      iconHoverText: "group-hover:text-destructive",
      buttonBorder: "border-destructive/30",
      emptyBtnGradient:
        "from-destructive/50 to-destructive/30 hover:from-destructive/60 hover:to-destructive/40 border-destructive/50",
      expandedBg: "bg-destructive/10",
      taskItemBorder: "border-destructive/30",
      taskItemBg: "bg-destructive/20",
      inputBorder: "border-destructive/50 focus:border-destructive",
      addButtonBg:
        "bg-destructive hover:bg-destructive/90 transition-all duration-200 shadow-lg hover:shadow-destructive/25",
      completeButtonBg:
        "bg-emerald-500 hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25",
    },
  };

  return baseStyles[themeColor];
}
