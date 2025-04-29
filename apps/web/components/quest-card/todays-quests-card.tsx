import React from "react";
import { Calendar } from "lucide-react";
import QuestCard from "./quest-card";
import { questApi } from "@/services/quest-api";
import { AddSideQuestDialog } from "../quest-dialog/add-side-quest-dialog";
import { QuestInstance } from "@questly/types";

const TodaysQuestsCard = () => {
  // Custom fetch function that combines daily and side quests
  const fetchTodaysQuests = async () => {
    // Fetch both types of quests in parallel
    const [dailyResult, sideResult] = await Promise.all([
      questApi.fetchDailyQuest().catch(() => ({ dailyQuests: [] })),
      questApi.fetchSideQuests().catch(() => ({ sideQuests: [] })),
    ]);

    // Simply combine the quests from both sources without modifying their structure
    return {
      sideQuests: [
        ...(dailyResult.dailyQuests || []),
        ...(sideResult.sideQuests || []),
      ],
    };
  };

  return (
    <QuestCard
      title="Today's Quests"
      description="All your daily and side quests in one place"
      type="side"
      Icon={Calendar}
      EmptyIcon={Calendar}
      themeColor="blue"
      fetchFn={fetchTodaysQuests}
      queryKey={["todaysQuests"]}
      dataSelector={(data) => data.sideQuests || []}
      AddQuestDialog={AddSideQuestDialog}
      questTypeLabel="QUEST"
      emptyStateTitle="No Quests For Today"
      emptyStateDescription="Add daily or side quests to see them here"
      addButtonLabel="Add Quest"
      createButtonLabel="Create Quest"
    />
  );
};

export default TodaysQuestsCard;
