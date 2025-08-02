"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { mainQuestApi } from "@/services/main-quest-api";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useAchievements } from "@/contexts/achievement-context";
import { toast } from "sonner";
import { Sword, Sparkles, CheckCircle, HelpCircle } from "lucide-react";
import {
  MainQuestImportance,
  MainQuestCategory,
  MainQuestDifficulty,
} from "@questly/types";

export function AddMainQuestOnboarding() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<MainQuestImportance>(
    MainQuestImportance.Common
  );
  const [category, setCategory] = useState<MainQuestCategory>(
    MainQuestCategory.Challenge
  );
  const [difficulty, setDifficulty] = useState<MainQuestDifficulty>(
    MainQuestDifficulty.Novice
  );
  const [dueDate, setDueDate] = useState<Date>();

  const { markFirstQuestCreated, hasCreatedFirstQuest } = useOnboarding();
  const { checkForNewAchievements } = useAchievements();
  const queryClient = useQueryClient();

  const createQuestMutation = useMutation({
    mutationFn: mainQuestApi.addMainQuest,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["mainQuests"],
      });
      queryClient.invalidateQueries({
        queryKey: ["activeMainQuests"],
      });

      // Check for new achievements when main quest is created
      try {
        await checkForNewAchievements();
      } catch (error) {
        console.error("Error checking for achievements:", error);
      }

      markFirstQuestCreated();
      toast.success("🎉 Your first quest is ready!", {
        description: "You're officially on your adventure path!",
      });
    },
    onError: (error: any) => {
      toast.error("Failed to create quest", {
        description: error.message || "Please try again",
      });
    },
  });

  const handleCreateQuest = () => {
    if (!title.trim()) {
      toast.error("Quest title is required!");
      return;
    }

    if (!dueDate) {
      toast.error("Due date is required!");
      return;
    }

    const questData = {
      title: title.trim(),
      description: description.trim(),
      importance,
      category,
      difficulty,
      dueDate: dueDate.toISOString(),
      completed: false,
      quests: [], // No attached quests for onboarding
    };

    createQuestMutation.mutate(questData);
  };

  if (hasCreatedFirstQuest) {
    return (
      <div className="text-center space-y-4">
        <div className="relative mx-auto w-16 h-16 mb-4">
          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-2 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-white" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white">
          Quest Created Successfully! 🎉
        </h3>
        <p className="text-zinc-400">
          Excellent work, adventurer! Your first main quest is now active. You
          can continue to add more quests or complete the onboarding.
        </p>
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mt-4">
          <p className="text-sm text-green-300">
            <strong>Pro tip:</strong> You can add daily and side quests to break
            down your main quest into smaller, manageable tasks!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-zinc-400">
          Main quests are your big goals. Think of something meaningful you want
          to achieve!
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="title" className="text-white text-sm">
            Quest Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Learn a new programming language"
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 h-9"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="description" className="text-white text-sm">
            Quest Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your quest objectives..."
            className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400 min-h-[60px] text-sm"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-white text-xs">Importance</Label>
            <Select
              value={importance}
              onValueChange={(value) =>
                setImportance(value as MainQuestImportance)
              }
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MainQuestImportance.Common}>
                  ⚪ Common
                </SelectItem>
                <SelectItem value={MainQuestImportance.Rare}>
                  🔵 Rare
                </SelectItem>
                <SelectItem value={MainQuestImportance.Heroic}>
                  🟣 Heroic
                </SelectItem>
                <SelectItem value={MainQuestImportance.Legendary}>
                  🟡 Legendary
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-white text-xs">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(value) =>
                setDifficulty(value as MainQuestDifficulty)
              }
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MainQuestDifficulty.Novice}>
                  🌟 Novice
                </SelectItem>
                <SelectItem value={MainQuestDifficulty.Adventurer}>
                  ⭐ Adventurer
                </SelectItem>
                <SelectItem value={MainQuestDifficulty.Veteran}>
                  🌠 Veteran
                </SelectItem>
                <SelectItem value={MainQuestDifficulty.Master}>
                  💫 Master
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-white text-xs">Category</Label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as MainQuestCategory)}
            >
              <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MainQuestCategory.Challenge}>
                  🏆 Challenge
                </SelectItem>
                <SelectItem value={MainQuestCategory.Creation}>
                  🎨 Creation
                </SelectItem>
                <SelectItem value={MainQuestCategory.Exploration}>
                  🗺️ Exploration
                </SelectItem>
                <SelectItem value={MainQuestCategory.Knowledge}>
                  📚 Knowledge
                </SelectItem>
                <SelectItem value={MainQuestCategory.Social}>
                  👥 Social
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="dueDate" className="text-white text-sm">
            Due Date *
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
            onChange={(e) =>
              setDueDate(e.target.value ? new Date(e.target.value) : undefined)
            }
            className="bg-slate-800/50 border-slate-600 text-white h-9"
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Quest Tips
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-amber-300">
                <Sparkles className="h-5 w-5" />
                Quest Creation Tips
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <ul className="text-sm text-amber-200/90 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Make it specific and achievable</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Set a realistic deadline that motivates you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>
                      Choose difficulty that challenges but doesn't overwhelm
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>
                      You can always add daily tasks later to break it down
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>Think about why this quest matters to you</span>
                  </li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Button
        onClick={handleCreateQuest}
        disabled={!title.trim() || !dueDate || createQuestMutation.isPending}
        className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-semibold h-10"
      >
        {createQuestMutation.isPending ? (
          <>
            <Sword className="h-4 w-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Sword className="h-4 w-4 mr-2" />
            Create My First Quest
          </>
        )}
      </Button>
    </div>
  );
}
