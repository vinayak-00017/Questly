"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
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
import {
  X,
  Plus,
  Compass,
  Scroll,
  Sparkles,
  CalendarDays,
  Target,
  LinkIcon,
  Map,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuestTemplateSchema,
  MainQuestId,
  QuestPriority,
} from "@questly/types";
import { toast } from "sonner";
import { mainQuestApi } from "@/services/main-quest-api";
import { DatePicker } from "./main-quest/date-picker";
import { questApi } from "@/services/quest-api";
import { RecurrencePicker } from "./main-quest/recurrence-picker";

interface AddQuestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddSideQuestDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddQuestDialogProps) {
  const { Important, Minor, Critical, Standard, Optional } = QuestPriority;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<QuestPriority>(Standard);
  const [dueDate, setDueDate] = useState<Date>();
  const [parentQuestId, setParentQuestId] = useState<string | undefined>();
  const [recurrence, setRecurrence] = useState<string | undefined>();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const closeDialogRef = useRef(false);
  const queryClient = useQueryClient();

  // Check if form has changes
  const hasChanges =
    !!title ||
    !!description ||
    priority !== Standard ||
    !!dueDate ||
    !!parentQuestId ||
    !!recurrence;

  // Handle close with confirmation if needed
  const handleCloseWithConfirmation = (newOpenState: boolean) => {
    if (!newOpenState && hasChanges) {
      // User is trying to close and has unsaved changes
      setShowConfirmDialog(true);
      // Prevent default close behavior
      return false;
    }
    // Allow dialog to close
    return true;
  };

  // Handle actual close after confirmation
  const confirmClose = () => {
    // First hide the confirmation dialog
    setShowConfirmDialog(false);

    // Use a small setTimeout to ensure state updates are processed in separate render cycles
    setTimeout(() => {
      // Reset form state immediately (don't wait for the useEffect)
      setTitle("");
      setDescription("");
      setPriority(Standard);
      setDueDate(undefined);
      setParentQuestId(undefined);
      setRecurrence(undefined);

      // Then close the main dialog after state is reset
      onOpenChange(false);
    }, 10);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      // We use a timeout to ensure the reset happens after the dialog closing animation
      const timeout = setTimeout(() => {
        setTitle("");
        setDescription("");
        setPriority(Standard);
        setDueDate(undefined);
        setParentQuestId(undefined);
        setRecurrence(undefined);
        closeDialogRef.current = false;
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [open, Standard]);

  const addSideQuestMutation = useMutation({
    mutationFn: questApi.addQuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sideQuests"] });
      toast.success("Side quest added!");
      onSuccess?.();
      onOpenChange(false);
      // No need to reset form here as it's handled by the effect above
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create quest");
    },
  });

  const { data: mainQuestsIds = [], isLoading } = useQuery({
    queryKey: ["mainQuestsId"],
    queryFn: mainQuestApi.fetchMainQuestsId,
    select: (data) => data.mainQuestsIds || [],
  });

  const handleCreateSideQuest = () => {
    try {
      const input = {
        title,
        description,
        basePoints: priority,
        dueDate: dueDate ? dueDate.toISOString() : undefined,
        parentQuestId,
        type: "side",
        recurrenceRule: recurrence,
      };

      try {
        const validatedInput = createQuestTemplateSchema.parse(input);
        addSideQuestMutation.mutate(validatedInput);
      } catch (validationError) {
        console.error("Validation error:", validationError); // Log the validation error
        throw validationError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpenState) => {
        if (handleCloseWithConfirmation(newOpenState)) {
          onOpenChange(newOpenState);
        }
      }}
    >
      <DialogContent className="sm:max-w-[500px] w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-blue-800/30 max-h-[85vh] overflow-hidden shadow-xl flex flex-col mt-6 sm:mt-0">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-500/30 rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-500/30 rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-500/30 rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-500/30 rounded-br-lg"></div>

        {/* Floating particles background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-blue-500/10 float-animation"
              style={{
                width: `${Math.random() * 8 + 2}px`,
                height: `${Math.random() * 8 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <DialogHeader className="flex-none px-6 pt-6 pb-2 relative">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-black/40 w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-1 ring-blue-500/30">
              <Compass className="h-4 w-4 text-blue-500" />
            </div>
            <DialogTitle className="text-xl font-medieval text-white/90">
              Add Side Quest
            </DialogTitle>
          </div>
          <p className="text-zinc-400 text-xs mt-1">
            Discover new adventures to enhance your journey
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4 px-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 relative">
          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <Scroll className="h-3.5 w-3.5" />
              Quest Title
            </label>
            <Input
              placeholder="Enter quest title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/50 border-zinc-700 focus:border-blue-500 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5" />
              Schedule
            </label>
            <RecurrencePicker
              date={dueDate}
              onDateSelect={setDueDate}
              recurrenceRule={recurrence}
              onRecurrenceSelect={setRecurrence}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <Target className="h-3.5 w-3.5" />
                Importance
              </label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as QuestPriority)}
              >
                <SelectTrigger className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 hover:border-blue-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem
                    value={Optional}
                    className="focus:bg-blue-900/20 focus:text-blue-400"
                  >
                    Optional
                  </SelectItem>
                  <SelectItem
                    value={Minor}
                    className="focus:bg-blue-900/20 focus:text-blue-400"
                  >
                    Minor Quest
                  </SelectItem>
                  <SelectItem
                    value={Standard}
                    className="focus:bg-blue-900/20 focus:text-blue-400"
                  >
                    Standard
                  </SelectItem>
                  <SelectItem
                    value={Important}
                    className="focus:bg-blue-900/20 focus:text-blue-400"
                  >
                    Important
                  </SelectItem>
                  <SelectItem
                    value={Critical}
                    className="focus:bg-blue-900/20 focus:text-blue-400"
                  >
                    Critical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
                <LinkIcon className="h-3.5 w-3.5" />
                Link to Main Quest
              </label>
              <Select
                value={parentQuestId || "undefined"}
                onValueChange={(value) => {
                  setParentQuestId(value === "undefined" ? undefined : value);
                }}
              >
                <SelectTrigger className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 hover:border-blue-500/30">
                  <SelectValue placeholder="Select a parent quest" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem
                    value={"undefined"}
                    className="focus:bg-blue-900/20 focus:text-blue-400"
                  >
                    None
                  </SelectItem>
                  {mainQuestsIds.map((quest: MainQuestId) => (
                    <SelectItem
                      key={quest.id}
                      value={quest.id}
                      className="focus:bg-blue-900/20 focus:text-blue-400"
                    >
                      {quest.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <Scroll className="h-3.5 w-3.5" />
              Description
            </label>
            <Textarea
              placeholder="Enter quest description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-black/50 border-zinc-700 focus:border-blue-500 text-white min-h-[100px] placeholder:text-zinc-500"
            />
          </div>

          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-3 rounded-lg border border-blue-900/20 flex gap-3 items-center">
            <Map className="h-5 w-5 text-blue-500/70 flex-shrink-0" />
            <div className="text-xs text-zinc-400">
              <span className="text-blue-400">Side quests</span> offer
              alternative paths of exploration and can earn you valuable
              experience along your journey.
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800/50 flex-none px-6 pb-6 relative">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="bg-zinc-800/30 hover:bg-zinc-700/50 border-zinc-700/50 text-zinc-300"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleCreateSideQuest}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 text-white shadow-lg shadow-blue-900/20"
            disabled={!title.trim() || addSideQuestMutation.isPending}
          >
            {addSideQuestMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                <span>Creating...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Compass className="h-4 w-4" />
                <span>Embark on Quest</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close the
              dialog?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmClose}>
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
