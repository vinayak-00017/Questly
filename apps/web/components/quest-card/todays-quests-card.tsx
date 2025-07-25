import React from "react";
import { Calendar } from "lucide-react";
import QuestCard from "./quest-card";
import { questApi } from "@/services/quest-api";
import { QuestTypeChooserDialog } from "./quest-type-chooser-dialog";
import { AddDailyQuestDialog } from "../quest-dialog/add-daily-quest-dialog";
import { AddSideQuestDialog } from "../quest-dialog/add-side-quest-dialog";
import { QuestInstance } from "@questly/types";
import { useQueries, useQuery } from "@tanstack/react-query";

const TodaysQuestsCard = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedQuestType, setSelectedQuestType] = React.useState<
    "daily" | "side" | null
  >(null);
  const [isTypeChooserOpen, setIsTypeChooserOpen] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["todaysQuests"],
    queryFn: questApi.fetchTodaysQuests,
  });

  // Extract data and loading states
  const dailyQuests = data?.dailyQuests || [];
  const sideQuests = data?.sideQuests || [];

  const combinedQuests = React.useMemo(() => {
    // Add a property to track the original quest type for proper styling
    return [...dailyQuests, ...sideQuests];
  }, [dailyQuests, sideQuests]);

  const handleAddQuest = () => {
    setIsTypeChooserOpen(true);
  };

  const handleQuestTypeSelect = (questType: "daily" | "side") => {
    setIsTypeChooserOpen(false);
    setSelectedQuestType(questType);
    setIsDialogOpen(true);
  };

  // Choose the appropriate dialog based on quest type
  const CurrentAddDialog =
    selectedQuestType === "daily" ? AddDailyQuestDialog : AddSideQuestDialog;

  return (
    <>
      <QuestCard
        title="Today's Quests"
        description="All your daily and side quests in one place"
        Icon={Calendar}
        EmptyIcon={Calendar}
        type="today"
        themeColor="purple"
        fetchFn={questApi.fetchTodaysQuests}
        queryKey={["todaysQuests"]}
        dataSelector={(data) => [...(data?.dailyQuests || []), ...(data?.sideQuests || [])]}
        emptyStateTitle="No Quests For Today"
        emptyStateDescription="Add daily or side quests to see them here"
        onAddQuest={handleAddQuest}
      />

      <QuestTypeChooserDialog
        open={isTypeChooserOpen}
        onOpenChange={setIsTypeChooserOpen}
        onChoose={handleQuestTypeSelect}
      />

      {isDialogOpen && selectedQuestType && (
        <CurrentAddDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            setSelectedQuestType(null);
          }}
        />
      )}
    </>
  );
};

export default TodaysQuestsCard;
