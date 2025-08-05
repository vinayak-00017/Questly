import { QuestTemplate } from "@questly/types";
import { getQuestPriority, getPriorityOrder } from "@/utils/questPriority";
import { isQuestTemplateExpired } from "@/components/quest-template/quest-template-helpers";
import { useMemo } from "react";

export interface FilterState {
  searchTerm: string;
  filterType: "all" | "active" | "inactive" | "expired";
  filterQuestType: "all" | "daily" | "side";
  filterImportance:
    | "all"
    | "critical"
    | "important"
    | "standard"
    | "minor"
    | "optional";
}

export const useFilteredTemplates = (
  templatesData: QuestTemplate[] | undefined,
  filters: FilterState
) => {
  return useMemo(() => {
    return (templatesData || [])
      .filter((template) => {
        const matchesSearch = template.title
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());
        const matchesStatus =
          filters.filterType === "all" ||
          (filters.filterType === "active" && template.isActive) ||
          (filters.filterType === "inactive" && !template.isActive) ||
          (filters.filterType === "expired" &&
            isQuestTemplateExpired(template));
        const matchesQuestType =
          filters.filterQuestType === "all" ||
          template.type === filters.filterQuestType;

        const templatePriority = getQuestPriority(template.basePoints);
        const matchesImportance =
          filters.filterImportance === "all" ||
          templatePriority === filters.filterImportance;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesQuestType &&
          matchesImportance
        );
      })
      .sort((a, b) => {
        // First, sort expired templates to the bottom
        const aExpired = isQuestTemplateExpired(a);
        const bExpired = isQuestTemplateExpired(b);

        if (aExpired && !bExpired) return 1;
        if (!aExpired && bExpired) return -1;

        // If both are expired or both are not expired, sort by priority
        const priorityA = getPriorityOrder(getQuestPriority(a.basePoints));
        const priorityB = getPriorityOrder(getQuestPriority(b.basePoints));
        // Sort by priority (highest first), then by title
        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }
        return a.title.localeCompare(b.title);
      });
  }, [
    templatesData,
    filters.searchTerm,
    filters.filterType,
    filters.filterQuestType,
    filters.filterImportance,
  ]);
};
