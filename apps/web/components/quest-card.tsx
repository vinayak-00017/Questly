"use client";

import React from "react";
import { Card, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QuestInstance } from "@questly/types";
import { LucideIcon, Plus, Sparkles, Check } from "lucide-react";

export interface QuestCardProps {
  title: string;
  description: string;
  type: "daily" | "side";
  Icon: LucideIcon;
  EmptyIcon: LucideIcon;
  themeColor: "blue" | "orange";
  fetchFn: () => Promise<any>;
  queryKey: string[];
  dataSelector: (data: any) => QuestInstance[];
  AddQuestDialog: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
  }>;
  questTypeLabel: string;
  emptyStateTitle: string;
  emptyStateDescription: string;
  addButtonLabel: string;
  createButtonLabel: string;
}

const QuestCard: React.FC<QuestCardProps> = ({
  title,
  description,
  type,
  Icon,
  EmptyIcon,
  themeColor,
  fetchFn,
  queryKey,
  dataSelector,
  AddQuestDialog,
  questTypeLabel,
  emptyStateTitle,
  emptyStateDescription,
  addButtonLabel,
  createButtonLabel,
}) => {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const { data: quests = [], isLoading } = useQuery({
    queryKey,
    queryFn: fetchFn,
    select: dataSelector,
  });

  // Color-specific styles based on theme
  const colorStyles = {
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
      emptyBtnGradient: "from-blue-700/50 to-purple-700/50 hover:from-blue-600/50 hover:to-purple-600/50 border-blue-800/50",
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
      emptyBtnGradient: "from-orange-700/50 to-red-700/50 hover:from-orange-600/50 hover:to-red-600/50 border-orange-800/50",
    },
  }[themeColor];

  return (
    <Card className="w-full overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-0 shadow-lg relative">
      {/* Enhanced background with animated effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorStyles.gradient} pointer-events-none`}></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${colorStyles.particleColor} float-animation`}
            style={{
              width: `${Math.random() * 10 + 3}px`,
              height: `${Math.random() * 10 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative">
        <div className="flex w-full px-6 pt-6 pb-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${colorStyles.iconBg} pulse-glow`}>
              <Icon className={`h-5 w-5 ${colorStyles.iconColor}`} />
            </div>
            <div>
              <CardTitle className="text-lg font-medieval text-white/90">
                {title}
              </CardTitle>
              <CardDescription className="text-zinc-400 text-xs mt-0.5">
                {description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`bg-black/30 ${colorStyles.buttonBorder} hover:bg-black/50 text-white gap-1.5 text-sm ${colorStyles.hoverBorder} transition-all duration-300`}
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            <span>{addButtonLabel}</span>
          </Button>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {quests.length > 0 ? (
            quests.map((quest: QuestInstance) => (
              <Card
                key={quest.instanceId}
                className={`bg-gradient-to-br from-black/40 to-black/60 border-zinc-800/50 ${colorStyles.cardHoverBorder} transition-all duration-300 cursor-pointer group relative overflow-hidden`}
              >
                {/* Quest card decorative corner elements */}
                <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${colorStyles.cornerBorder}`}></div>
                <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${colorStyles.cornerBorder}`}></div>
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${colorStyles.cornerBorder}`}></div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${colorStyles.cornerBorder}`}></div>

                <CardContent className="p-4 flex items-center justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-3.5 w-3.5 ${colorStyles.iconColor}`} />
                      <span className={`${colorStyles.typeLabel} text-xs font-medieval tracking-wide`}>
                        {questTypeLabel}
                      </span>
                    </div>
                    <h3 className="text-white/90 font-medium text-sm">
                      {quest.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className={`${colorStyles.xpColor} text-xs font-medium flex items-center`}>
                        <Sparkles className="h-3 w-3 mr-1" />+
                        {quest.xpReward || (type === 'daily' ? 50 : 75)} XP
                      </div>
                    </div>
                  </div>
                  <div className={`h-8 w-8 rounded-full bg-black/30 flex items-center justify-center ${colorStyles.iconHover} transition-colors ring-1 ring-white/5`}>
                    <Check className={`h-4 w-4 text-zinc-400 ${colorStyles.iconHoverText}`} />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 p-8 text-center bg-black/20 rounded-lg border border-zinc-800/40">
              <EmptyIcon className={`h-12 w-12 ${colorStyles.iconColor}/30 mx-auto mb-3`} />
              <h3 className="text-white/90 font-medieval text-lg mb-1">
                {emptyStateTitle}
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                {emptyStateDescription}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className={`bg-gradient-to-r ${colorStyles.emptyBtnGradient} text-white`}
              >
                <Plus className="h-4 w-4 mr-1" />
                {createButtonLabel}
              </Button>
            </div>
          )}
        </div>
      </div>
      <AddQuestDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </Card>
  );
};

export default QuestCard;