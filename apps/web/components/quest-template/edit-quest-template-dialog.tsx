"use client";

import React, { useState, useEffect } from "react";
import { QuestTemplate, QuestType, QuestPriority } from "@questly/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questTemplateApi } from "@/services/quest-template-api";
import { toast } from "sonner";

interface EditQuestTemplateDialogProps {
  questTemplate: QuestTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditQuestTemplateDialog: React.FC<EditQuestTemplateDialogProps> = ({
  questTemplate,
  open,
  onOpenChange,
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "daily" as QuestType,
    importance: QuestPriority.Standard,
    isActive: true,
    recurrenceRule: "",
    dueDate: "",
  });

  // Helper function to get quest priority from basePoints
  const getQuestPriority = (basePoints: number | string): QuestPriority => {
    if (typeof basePoints === "string") {
      return basePoints as QuestPriority;
    }
    // Map number values to priority levels based on points-map.ts
    if (basePoints === 1) return QuestPriority.Optional;
    if (basePoints === 2) return QuestPriority.Minor;
    if (basePoints === 3) return QuestPriority.Standard;
    if (basePoints === 5) return QuestPriority.Important;
    if (basePoints >= 8) return QuestPriority.Critical;
    return QuestPriority.Standard; // default
  };

  // Helper function to convert importance to basePoints
  const getBasePointsFromImportance = (importance: QuestPriority): number => {
    switch (importance) {
      case QuestPriority.Optional:
        return 1;
      case QuestPriority.Minor:
        return 2;
      case QuestPriority.Standard:
        return 3;
      case QuestPriority.Important:
        return 5;
      case QuestPriority.Critical:
        return 8;
      default:
        return 3;
    }
  };

  useEffect(() => {
    if (questTemplate) {
      const currentImportance = getQuestPriority(questTemplate.basePoints);
      setFormData({
        title: questTemplate.title || "",
        description: questTemplate.description || "",
        type: questTemplate.type || "daily",
        importance: currentImportance,
        isActive: questTemplate.isActive ?? true,
        recurrenceRule: questTemplate.recurrenceRule || "",
        dueDate: questTemplate.dueDate
          ? new Date(questTemplate.dueDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [questTemplate]);

  const updateMutation = useMutation({
    mutationFn: (updateData: Partial<QuestTemplate>) =>
      questTemplateApi.updateQuestTemplate(questTemplate!.id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questTemplates"] });
      toast.success("Quest template updated successfully!");
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update quest template");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questTemplate) return;

    const updateData = {
      ...formData,
      basePoints: getBasePointsFromImportance(formData.importance),
      dueDate: formData.dueDate || null,
      recurrenceRule: formData.recurrenceRule || null,
    };

    // Remove importance from the data sent to API since it's converted to basePoints
    const { importance, ...apiData } = updateData;

    updateMutation.mutate(apiData);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!questTemplate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Quest Template</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-200">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-slate-800 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-200">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-slate-800 border-slate-600 text-white"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-slate-200">
                Type
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value: QuestType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="side">Side</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="importance" className="text-slate-200">
                Importance
              </Label>
              <Select
                value={formData.importance}
                onValueChange={(value: QuestPriority) =>
                  setFormData({ ...formData, importance: value })
                }
              >
                <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={QuestPriority.Critical}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      Critical (8 Points)
                    </div>
                  </SelectItem>
                  <SelectItem value={QuestPriority.Important}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Important (5 Points)
                    </div>
                  </SelectItem>
                  <SelectItem value={QuestPriority.Standard}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      Standard (3 Points)
                    </div>
                  </SelectItem>
                  <SelectItem value={QuestPriority.Minor}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Minor (2 Points)
                    </div>
                  </SelectItem>
                  <SelectItem value={QuestPriority.Optional}>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                      Optional (1 Points)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.type === "side" && (
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-slate-200">
                Due Date (Optional)
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, isActive: checked })
              }
            />
            <Label htmlFor="isActive" className="text-slate-200">
              Active
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditQuestTemplateDialog;
