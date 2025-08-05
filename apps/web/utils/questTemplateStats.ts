import { QuestTemplate } from "@questly/types";
import { isQuestTemplateExpired } from "@/components/quest-template/quest-template-helpers";

export interface QuestTemplateStats {
  totalTemplates: number;
  activeTemplates: number;
  expiredTemplates: number;
  dailyTemplates: number;
  sideTemplates: number;
}

export const calculateQuestTemplateStats = (
  templatesData: QuestTemplate[] | undefined
): QuestTemplateStats => {
  const totalTemplates = templatesData?.length || 0;

  // Active templates exclude expired ones
  const activeTemplates =
    templatesData?.filter((t) => t.isActive && !isQuestTemplateExpired(t))
      .length || 0;

  // Count expired templates
  const expiredTemplates =
    templatesData?.filter((t) => isQuestTemplateExpired(t)).length || 0;

  const dailyTemplates =
    templatesData?.filter((t) => t.type === "daily").length || 0;
  const sideTemplates =
    templatesData?.filter((t) => t.type === "side").length || 0;

  return {
    totalTemplates,
    activeTemplates,
    expiredTemplates,
    dailyTemplates,
    sideTemplates,
  };
};
