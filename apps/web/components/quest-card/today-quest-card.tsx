import React from "react";
import QuestCard from "./quest-card";
import { questApi } from "@/services/quest-api";
import { Compass, Map } from "lucide-react";
import { AddSideQuestDialog } from "../quest-dialog/add-side-quest-dialog";

const TodayQuestCard = () => {
  return (
    <QuestCard
      title="Today's Quests"
      description=""
      type="side"
      Icon={Compass}
      EmptyIcon={Map}
      themeColor="orange"
      fetchFn={() =>
        questApi.fetchSideQuests?.() || Promise.resolve({ sideQuests: [] })
      }
      queryKey={[""]}
      dataSelector={(data) => data.sideQuests || []}
      AddQuestDialog={AddSideQuestDialog}
      questTypeLabel="Today's Quests"
      emptyStateTitle="Uncharted Territory"
      emptyStateDescription="Quests you have to complete today."
      addButtonLabel="Add Quest"
      createButtonLabel="Explore New Quest"
      defaultXpReward={75}
    />
  );
};

export default TodayQuestCard;
