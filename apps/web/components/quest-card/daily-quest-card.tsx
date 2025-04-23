"use client";

import React from "react";
import { Flame, Shield } from "lucide-react";
import QuestCard from "./quest-card";
import { questApi } from "@/services/quest-api";
import { AddDailyQuestDialog } from "../quest-dialog/add-daily-quest-dialog";

const DailyQuestCard = () => {
  return (
    <QuestCard
      title="Daily Quests"
      description="Complete these quests every day to stay aligned to your main quest"
      type="daily"
      Icon={Flame}
      EmptyIcon={Flame}
      themeColor="orange"
      fetchFn={questApi.fetchDailyQuest}
      queryKey={["dailyQuests"]}
      dataSelector={(data) => data.dailyQuests || []}
      AddQuestDialog={AddDailyQuestDialog}
      questTypeLabel="DAILY QUEST"
      emptyStateTitle="No Daily Quests Yet"
      emptyStateDescription="Add your first daily quest to begin your journey"
      addButtonLabel="Add Quest"
      createButtonLabel="Create Quest"
      defaultXpReward={50}
    />
  );
};

export default DailyQuestCard;
