import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { questTemplateApi } from "@/services/quest-template-api";
import { TrackedQuest } from "../types";
import { isQuestTemplateExpired } from "@/components/quest-template/quest-template-helpers";

export const useQuestTemplates = (trackedQuests: TrackedQuest[]) => {
  // Fetch available quest templates
  const { data: templatesData } = useQuery({
    queryKey: ["questTemplates"],
    queryFn: questTemplateApi.fetchQuestTemplates,
    select: (data) => data.questTemplates || [],
  });

  // Get available templates that aren't already tracked
  const availableTemplates = useMemo(() => {
    const trackedTemplateIds = trackedQuests.map((q) => q.templateId);
    return (templatesData || [])
      .filter(
        (template) =>
          template.isActive &&
          !trackedTemplateIds.includes(template.id) &&
          !isQuestTemplateExpired(template)
      )
      .sort((a, b) => {
        // Sort by priority: Critical > Important > Standard > Minor > Optional
        const priorityOrder = {
          critical: 0,
          important: 1,
          standard: 2,
          minor: 3,
          optional: 4,
        };
        const aPriority =
          priorityOrder[a.basePoints as keyof typeof priorityOrder] ?? 2;
        const bPriority =
          priorityOrder[b.basePoints as keyof typeof priorityOrder] ?? 2;
        return aPriority - bPriority;
      });
  }, [templatesData, trackedQuests]);

  return {
    templatesData,
    availableTemplates,
  };
};
