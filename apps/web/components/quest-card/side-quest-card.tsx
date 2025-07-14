"use client";

import React from "react";
import { Compass, Map } from "lucide-react";

import { questApi } from "@/services/quest-api";
import { AddSideQuestDialog } from "../quest-dialog/add-side-quest-dialog";
import QuestCard from "./quest-card";

const SideQuestCard = () => {
  return (
    <QuestCard
      title="Side Quests"
      description="Custom schedule quests to enhance your journey "
      Icon={Compass}
      EmptyIcon={Map}
      type="side"
      themeColor="blue"
      fetchFn={() =>
        questApi.fetchSideQuests?.() || Promise.resolve({ sideQuests: [] })
      }
      queryKey={["sideQuests"]}
      dataSelector={(data) => data.sideQuests || []}
      emptyStateTitle="Uncharted Territory"
      emptyStateDescription="Embark on side quests to discover new rewards"
      createButtonLabel="Explore New Quest"
      defaultXpReward={75}
    />
  );
};

export default SideQuestCard;
