"use client";

import React, { useState } from "react";
import { QuestTemplate } from "@questly/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
  Calendar,
  Target,
  Clock,
  Sparkles,
  Crown,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "daily":
        return "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30";
      case "side":
        return "bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-400 border-sky-500/30";
      default:
        return "bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "daily":
        return <Sparkles className="h-3 w-3" />;
      case "side":
        return <Crown className="h-3 w-3" />;
      default:
        return <Target className="h-3 w-3" />;
    }
  };

  const getCardGradient = (type: string, isActive: boolean) => {
    const baseOpacity = isActive ? "80" : "40";
    switch (type) {
      case "daily":
        return `bg-gradient-to-br from-slate-800/${baseOpacity} via-amber-900/10 to-slate-900/${baseOpacity}`;
      case "side":
        return `bg-gradient-to-br from-slate-800/${baseOpacity} via-sky-900/10 to-slate-900/${baseOpacity}`;
      default:
        return `bg-gradient-to-br from-slate-800/${baseOpacity} to-slate-900/${baseOpacity}`;
    }
  };

  const getBorderColor = (type: string, isActive: boolean) => {
    if (!isActive) return "border-slate-800/50";
    switch (type) {
      case "daily":
        return "border-amber-500/20 hover:border-amber-500/40";
      case "side":
        return "border-sky-500/20 hover:border-sky-500/40";
      default:
        return "border-slate-700/50 hover:border-slate-600/50";
    }
  };

  const formatRecurrenceRule = (rule: string | null) => {
    if (!rule) return "One-time";
    if (rule.includes("DAILY")) return "Daily";
    if (rule.includes("WEEKLY")) return "Weekly";
    if (rule.includes("MONTHLY")) return "Monthly";
    return "Custom";
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return "No due date";
    return new Date(dueDate).toLocaleDateString();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Card
          className={cn(
            "group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg backdrop-blur-sm",
            getCardGradient(questTemplate.type, questTemplate.isActive),
            getBorderColor(questTemplate.type, questTemplate.isActive),
            !questTemplate.isActive && "opacity-70"
          )}
        >
          {/* Accent line based on quest type */}
          <div
            className={cn(
              "absolute top-0 left-0 w-full h-1",
              questTemplate.type === "daily"
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

          <CardHeader className="pb-3 pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-3">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      getTypeColor(questTemplate.type)
                    )}
                  >
                    <div className="flex items-center gap-1">
                      {getTypeIcon(questTemplate.type)}
                      {questTemplate.type}
                    </div>
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      questTemplate.isActive
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    )}
                  >
                    <div className="flex items-center gap-1">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          questTemplate.isActive
                            ? "bg-emerald-400"
                            : "bg-red-400"
                        )}
                      />
                      {questTemplate.isActive ? "Active" : "Inactive"}
                    </div>
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-amber-100 transition-colors">
                  {questTemplate.title}
                </h3>
                {questTemplate.description && (
                  <p className="text-sm text-slate-400 mt-2 line-clamp-2 group-hover:text-slate-300 transition-colors">
                    {questTemplate.description}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-colors"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-slate-800 border-slate-700"
                >
                  <DropdownMenuItem
                    onClick={() => onEdit(questTemplate)}
                    className="cursor-pointer text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      onToggleStatus(questTemplate.id, !questTemplate.isActive)
                    }
                    className="cursor-pointer text-slate-200 hover:bg-slate-700 focus:bg-slate-700"
                  >
                    {questTemplate.isActive ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 focus:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-0 pb-4">
            <div className="space-y-4">
              {/* Quest Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                  <div
                    className={cn(
                      "p-1 rounded",
                      questTemplate.type === "daily"
                        ? "bg-amber-500/20"
                        : questTemplate.type === "side"
                          ? "bg-sky-500/20"
                          : "bg-slate-500/20"
                    )}
                  >
                    <Zap
                      className={cn(
                        "h-3 w-3",
                        questTemplate.type === "daily"
                          ? "text-amber-400"
                          : questTemplate.type === "side"
                            ? "text-sky-400"
                            : "text-slate-400"
                      )}
                    />
                  </div>
                  <span className="text-slate-300 font-medium">
                    {questTemplate.basePoints} XP
                  </span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg">
                  <div className="p-1 bg-slate-500/20 rounded">
                    <Calendar className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-slate-300 font-medium">
                    {formatRecurrenceRule(questTemplate.recurrenceRule)}
                  </span>
                </div>
              </div>

              {questTemplate.dueDate && (
                <div className="flex items-center gap-2 text-sm p-2 bg-slate-800/50 rounded-lg">
                  <div className="p-1 bg-slate-500/20 rounded">
                    <Clock className="h-3 w-3 text-slate-400" />
                  </div>
                  <span className="text-slate-300 font-medium">
                    Due: {formatDueDate(questTemplate.dueDate)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-slate-800 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Quest Template
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to delete "{questTemplate.title}"? This
              action cannot be undone and will remove all associated quest
              instances.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(questTemplate.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default QuestTemplateCard;
