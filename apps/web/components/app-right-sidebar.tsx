"use client";

import React from "react";
import MainQuestCard from "./main-quest/main-quest-card";
import QuestProgressRing from "./quest-progress-ring";

const AppRightSidebar = () => {
  return (
    <div className="fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] w-[280px] bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 hidden md:block">
      <div className="p-3 h-full overflow-y-auto">
        <div className="space-y-3">
          <QuestProgressRing />
          <MainQuestCard />
        </div>
      </div>
    </div>
  );
};

export default AppRightSidebar;
