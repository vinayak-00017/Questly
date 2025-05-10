"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import {
  MainQuestImportance,
  CreateQuestTemplate,
  QuestType,
  QuestPriority,
  MainQuestDifficulty,
  MainQuestCategory,
} from "@questly/types";
import { createMainQuestSchema } from "@questly/types";
import { toast } from "sonner";
import { mainQuestApi } from "@/services/main-quest-api";
import { Scroll, Sparkles } from "lucide-react";
import { QuestFormFields } from "./quest-form-fields";
import { DailyQuestForm } from "./daily-quest-form";
import { DailyQuestItem } from "./daily-quest-item";

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddQuestDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddQuestDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [importance, setImportance] = useState<MainQuestImportance>(
    MainQuestImportance.Common
  );
  const [difficulty, setDifficulty] = useState<MainQuestDifficulty>(
    MainQuestDifficulty.Adventurer
  );
  const [category, setCategory] = useState<MainQuestCategory>(
    MainQuestCategory.Challenge
  );
  const [dueDate, setDueDate] = useState<Date>();
  const [dailyQuests, setDailyQuests] = useState<CreateQuestTemplate[]>([]);
  const [particles, setParticles] = useState<
    Array<{
      width: string;
      height: string;
      left: string;
      top: string;
      animationDuration: string;
      animationDelay: string;
    }>
  >([]);

  // Generate particles on the client side only
  useEffect(() => {
    const newParticles = Array(15)
      .fill(null)
      .map(() => ({
        width: `${Math.random() * 5 + 2}px`,
        height: `${Math.random() * 5 + 2}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
      }));
    setParticles(newParticles);
  }, []);

  const handleAddDailyQuest = (quest: CreateQuestTemplate) => {
    setDailyQuests([...dailyQuests, quest]);
  };

  const handleRemoveTask = (index: number) => {
    setDailyQuests(dailyQuests.filter((_, i) => i !== index));
  };

  const addMainQuestMutation = useMutation({
    mutationFn: mainQuestApi.addMainQuest,
    onSuccess: () => {
      toast.success("Main quest created successfully!");
      onSuccess?.();
      onOpenChange(false);
      // Reset form
      setTitle("");
      setDescription("");
      setImportance(MainQuestImportance.Common);
      setDueDate(undefined);
      setDailyQuests([]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create quest");
    },
  });

  const handleCreateMainQuest = () => {
    try {
      const input = {
        title,
        description,
        importance,
        category,
        difficulty,
        dueDate: dueDate instanceof Date ? dueDate.toISOString() : undefined,
        quests: dailyQuests,
      };

      try {
        console.log(input);
        const validatedInput = createMainQuestSchema.parse(input);
        addMainQuestMutation.mutate(validatedInput);
      } catch (validationError) {
        console.error("Validation error:", validationError);
        throw validationError;
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-purple-800/30 max-h-[75vh] overflow-hidden shadow-xl flex flex-col p-0">
        {/* Background visual effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-purple-500/10 float-animation"
              style={{
                width: particle.width,
                height: particle.height,
                left: particle.left,
                top: particle.top,
                animationDuration: particle.animationDuration,
                animationDelay: particle.animationDelay,
              }}
            ></div>
          ))}
        </div>

        {/* Decorative corner elements */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-500/30 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-purple-500/30 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-purple-500/30 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-500/30 rounded-br-lg"></div>

        {/* Enhanced Dialog Header */}
        <DialogHeader className="flex-none px-6 pt-6 pb-2 relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-black/40 w-10 h-10 rounded-full flex items-center justify-center shadow-md ring-1 ring-purple-500/30 pulse-glow">
              <Scroll className="h-5 w-5 text-purple-500" />
            </div>
            <DialogTitle className="text-xl font-medieval text-white/90">
              Embark on a New Quest
            </DialogTitle>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Chronicle your journey and conquer new challenges in the realm
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4 px-6 mt-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 relative z-10">
          {/* Main Quest Form Fields */}
          <QuestFormFields
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            importance={importance}
            setImportance={setImportance}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            category={category}
            setCategory={setCategory}
            dueDate={dueDate}
            setDueDate={setDueDate}
          />

          <div className="space-y-4 pt-4 border-t border-zinc-800/50">
            <div className="bg-gradient-to-r from-purple-500/5 to-amber-500/5 p-3 rounded-lg border border-purple-900/20 flex gap-3 items-center mb-3">
              <Sparkles className="h-5 w-5 text-purple-500/70 flex-shrink-0" />
              <div className="text-xs text-zinc-400">
                <span className="text-purple-400">Daily Quests:</span> Add
                associated daily quests to help you progress on this main quest.
                These will appear in your daily tasks.
              </div>
            </div>

            {/* Daily Quest Form */}
            <DailyQuestForm
              onAddQuest={handleAddDailyQuest}
              dueDate={dueDate}
            />

            <div className="space-y-2">
              {dailyQuests.map((task, index) => (
                <DailyQuestItem
                  key={index}
                  task={task}
                  index={index}
                  onRemove={handleRemoveTask}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative mt-4 pt-4 border-t border-zinc-800/50 flex-none px-6 pb-6">
          <div className="flex justify-end gap-3 relative z-10">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="bg-zinc-800/50 hover:bg-zinc-700/70 border-zinc-700/50 text-zinc-300 shadow-lg transition-all"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleCreateMainQuest}
              className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 border-0 text-white shadow-lg shadow-purple-900/20 transition-all"
              disabled={!title.trim() || addMainQuestMutation.isPending}
            >
              {addMainQuestMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>Creating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Begin Quest</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
