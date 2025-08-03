"use client";

import React from "react";
import MainQuestCard from "./main-quest/main-quest-card";
import QuestProgressRing from "./quest-progress-ring";

const AppRightSidebar = () => {
  return (
    <div className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-[320px] bg-background/80 backdrop-blur-lg border-l border-border/50 hidden md:block">
      <div className="p-4 h-full overflow-y-auto">
        <div className="space-y-4 w-full">
          <QuestProgressRing />
          <MainQuestCard />
        </div>
      </div>
    </div>
  );
};

export default AppRightSidebar;
