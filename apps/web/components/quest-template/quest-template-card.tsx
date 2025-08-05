"use client";

import React, { useState } from "react";
import { QuestTemplate } from "@questly/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuestTemplateBadges } from "./quest-template-badges";
import { QuestTemplateActions } from "./quest-template-actions";
import { QuestTemplateDetails } from "./quest-template-details";
import { QuestTemplateDeleteDialog } from "./quest-template-delete-dialog";
import {
  getCardGradient,
  getBorderColor,
  isQuestTemplateExpired,
} from "./quest-template-helpers";

interface QuestTemplateCardProps {
  questTemplate: QuestTemplate;
  onEdit: (questTemplate: QuestTemplate) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  index: number;
}

const QuestTemplateCard: React.FC<QuestTemplateCardProps> = ({
  questTemplate,
  onEdit,
  onDelete,
  onToggleStatus,
  index,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const isExpired = isQuestTemplateExpired(questTemplate);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card
          className={cn(
            "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 backdrop-blur-sm hover:-translate-y-1",
            getCardGradient(questTemplate.type, questTemplate.isActive),
            getBorderColor(questTemplate.type, questTemplate.isActive),
            !questTemplate.isActive && "opacity-70",
            isExpired && "opacity-60 grayscale-[0.3]"
          )}
        >
          {/* Accent line based on quest type */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-1",
              isExpired
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : questTemplate.type === "daily"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500"
                  : questTemplate.type === "side"
                    ? "bg-gradient-to-r from-sky-500 to-indigo-500"
                    : "bg-gradient-to-r from-slate-500 to-slate-600"
            )}
          />

          {/* Status indicator */}
          <div
            className={cn(
              "absolute top-1 right-2 w-2 h-2 rounded-full",
              questTemplate.isActive
                ? "bg-emerald-500 animate-pulse"
                : "bg-red-500"
            )}
          />
          <div className="px-4 py-3 flex items-center justify-between bg-slate-900/20">
            <QuestTemplateBadges questTemplate={questTemplate} />
            <QuestTemplateActions
              questTemplate={questTemplate}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleStatus={onToggleStatus}
              setShowDeleteDialog={setShowDeleteDialog}
            />
          </div>

          <CardHeader className="pb-4">
            <div className="flex items-start">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-100 transition-colors break-words leading-tight">
                  {questTemplate.title}
                </h3>
                {questTemplate.description && (
                  <p className="text-sm text-slate-400 mt-3 line-clamp-3 group-hover:text-slate-300 transition-colors leading-relaxed">
                    {questTemplate.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0 pb-5">
            <QuestTemplateDetails questTemplate={questTemplate} />
          </CardContent>
        </Card>
      </motion.div>

      <QuestTemplateDeleteDialog
        questTemplate={questTemplate}
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        onDelete={onDelete}
      />
    </>
  );
};

export default QuestTemplateCard;
