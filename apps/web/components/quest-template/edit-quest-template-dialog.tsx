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
    basePoints: 1,
    isActive: true,
    recurrenceRule: "",
    dueDate: "",
  });

  useEffect(() => {
    if (questTemplate) {
      setFormData({
        title: questTemplate.title || "",
        description: questTemplate.description || "",
        type: questTemplate.type || "daily",
        basePoints: questTemplate.basePoints || 1,
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
      dueDate: formData.dueDate || null,
      recurrenceRule: formData.recurrenceRule || null,
    };

    updateMutation.mutate(updateData);
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
              <Label htmlFor="basePoints" className="text-slate-200">
                Base Points
              </Label>
              <Input
                id="basePoints"
                type="number"
                min="1"
                value={formData.basePoints}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePoints: parseInt(e.target.value) || 1,
                  })
                }
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
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
