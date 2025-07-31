import React, { memo } from "react";
import { LucideIcon } from "lucide-react";
import { QuestInstance } from "@questly/types";

import CollapsedQuestView from "./views/collapsed-quest-view";
import ExpandedQuestView from "./views/expanded-quest-view";
import QuestAnimations from "./components/quest-animations";
import EditQuestInstanceDialog from "./edit-quest-instance-dialog";
import { useQuestState } from "./hooks/use-quest-state";

export type QuestCacheData = {
  dailyQuests?: QuestInstance[];
  sideQuests?: QuestInstance[];
  message: string;
};

interface QuestInstanceItemProps {
  quest: QuestInstance;
  colorStyles: any;
  questTypeLabel: string;
  Icon: LucideIcon;
  queryKey: string[];
  globalCollapseState?: "collapsed" | "expanded" | null;
}

const QuestInstanceItem = ({
  quest,
  colorStyles,
  questTypeLabel,
  Icon,
  queryKey,
  globalCollapseState,
}: QuestInstanceItemProps) => {
  const {
    expandedQuestId,
    setExpandedQuestId,
    isQuestCompleted,
    setIsQuestCompleted,
    completionAnimation,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCollapsed,
    hasTasks,
    taskData,
    toggleExpand,
    handleEditClick,
    toggleCollapsed,
  } = useQuestState(quest, globalCollapseState);

  const commonProps = {
    quest,
    colorStyles,
    Icon,
    isCompleted: isQuestCompleted,
    completionAnimation,
    hasTasks,
    taskData,
    queryKey,
    expandedQuestId,
    setExpandedQuestId,
    toggleExpand,
    handleEditClick,
    toggleCollapsed,
    setIsQuestCompleted,
  };

  return (
    <>
      {isCollapsed ? (
        <CollapsedQuestView {...commonProps} />
      ) : (
        <ExpandedQuestView {...commonProps} questTypeLabel={questTypeLabel} />
      )}

      <QuestAnimations />

      <EditQuestInstanceDialog
        questInstance={quest}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        queryKey={queryKey}
      />
    </>
  );
};

export default memo(QuestInstanceItem);