import React from "react";
import { motion } from "framer-motion";
import { QuestTemplate } from "@questly/types";
import QuestTemplateCard from "@/components/quest-template/quest-template-card";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { FilterState } from "@/hooks/useFilteredTemplates";

interface QuestTemplateGridProps {
  templates: QuestTemplate[];
  isLoading: boolean;
  filters: FilterState;
  onEdit: (template: QuestTemplate) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
}

export const QuestTemplateGrid: React.FC<QuestTemplateGridProps> = ({
  templates,
  isLoading,
  filters,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className="h-64 bg-slate-800/50 border border-slate-700/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (templates.length > 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {templates.map((template, index) => (
          <QuestTemplateCard
            key={template.id}
            questTemplate={template}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleStatus={onToggleStatus}
            index={index}
          />
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="text-center py-12"
    >
      <Settings className="h-16 w-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">
        No quest templates found
      </h3>
      <p className="text-slate-400 mb-6">
        {filters.searchTerm ||
        filters.filterType !== "all" ||
        filters.filterQuestType !== "all"
          ? "Try adjusting your filters"
          : "Create your first quest template to get started"}
      </p>
      <Button
        onClick={() => {
          /* TODO: Add new template dialog */
        }}
        className="bg-stone-700 hover:bg-stone-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create Template
      </Button>
    </motion.div>
  );
};
