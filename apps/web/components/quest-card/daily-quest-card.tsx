"use client";

import React from "react";
import { Flame } from "lucide-react";
import QuestCard from "./quest-card";
import { questApi } from "@/services/quest-api";
import { AddDailyQuestDialog } from "../quest-dialog/add-daily-quest-dialog";

const DailyQuestCard = () => {
  return (
    <QuestCard
      title="Daily Quests"
      description="Complete these quests every day to stay aligned to your main quest"
      Icon={Flame}
      EmptyIcon={Flame}
      type="daily"
      themeColor="orange"
      fetchFn={questApi.fetchDailyQuest}
      queryKey={["dailyQuests"]}
      dataSelector={(data) => data.dailyQuests || []}
      AddQuestDialog={AddDailyQuestDialog}
      emptyStateTitle="No Daily Quests Yet"
      emptyStateDescription="Add your first daily quest to begin your journey"
      createButtonLabel="Create Quest"
      defaultXpReward={50}
    />
  );
};

export default DailyQuestCard;
