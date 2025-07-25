import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { QuestInstance } from "@questly/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { questApi } from "@/services/quest-api";
import { toast } from "sonner";
import { Edit3, Scroll, Target, AlertCircle, Info } from "lucide-react";
import { UnsavedChangesAlert } from "../quest-dialog/unsaved-changes-alert";
import {
  numberToQuestTag,
  questTagToNumber,
} from "@questly/utils/src/points-conversion";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface EditQuestInstanceDialogProps {
  questInstance: QuestInstance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  queryKey: string[];
}

// Get color styles based on quest type
const getEditQuestColorStyles = (questType: string) => {
  if (questType === "daily") {
    return {
      headerBorder: "border-orange-800/30",
      cornerBorder: "border-orange-500/30",
      iconBg: "ring-orange-500/30",
      iconColor: "text-orange-500",
      labelColor: "text-orange-400",
      focusBorder: "focus:border-orange-500",
      hoverBorder: "hover:border-orange-500/30",
      infoGradient: "from-orange-500/5 to-red-500/5",
      infoBorder: "border-orange-900/20",
      infoIconColor: "text-orange-500/70",
      infoTextColor: "text-orange-400",
      buttonGradient:
        "from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500",
      buttonShadow: "shadow-orange-900/20",
      particles: "bg-orange-500/10",
    };
  } else {
    return {
      headerBorder: "border-blue-800/30",
      cornerBorder: "border-blue-500/30",
      iconBg: "ring-blue-500/30",
      iconColor: "text-blue-500",
      labelColor: "text-blue-400",
      focusBorder: "focus:border-blue-500",
      hoverBorder: "hover:border-blue-500/30",
      infoGradient: "from-blue-500/5 to-purple-500/5",
      infoBorder: "border-blue-900/20",
      infoIconColor: "text-blue-500/70",
      infoTextColor: "text-blue-400",
      buttonGradient:
        "from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500",
      buttonShadow: "shadow-blue-900/20",
      particles: "bg-blue-500/10",
    };
  }
};

// Decorations component
const EditQuestDecorations = ({ questType }: { questType: string }) => {
  const colorStyles = getEditQuestColorStyles(questType);
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

  useEffect(() => {
    const newParticles = Array(15)
      .fill(null)
      .map(() => ({
        width: `${Math.random() * 8 + 2}px`,
        height: `${Math.random() * 8 + 2}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 2}s`,
      }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Corner decorations */}
      <div
        className={`absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 ${colorStyles.cornerBorder} rounded-tl-lg`}
      ></div>
      <div
        className={`absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 ${colorStyles.cornerBorder} rounded-tr-lg`}
      ></div>
      <div
        className={`absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 ${colorStyles.cornerBorder} rounded-bl-lg`}
      ></div>
      <div
        className={`absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 ${colorStyles.cornerBorder} rounded-br-lg`}
      ></div>

      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={`absolute rounded-full ${colorStyles.particles} float-animation`}
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

      <style jsx>{`
        .float-animation {
          animation: float linear infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

const EditQuestInstanceDialog: React.FC<EditQuestInstanceDialogProps> = ({
  questInstance,
  open,
  onOpenChange,
  queryKey,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePoints, setBasePoints] = useState(0);
  const [priority, setPriority] = useState<string>("standard");
  const [errors, setErrors] = useState<{ priority?: string }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const queryClient = useQueryClient();

  // Initialize form when quest instance changes
  useEffect(() => {
    if (questInstance) {
      setTitle(questInstance.title);
      setDescription(questInstance.description || "");
      setBasePoints(questInstance.basePoints);
      setPriority(numberToQuestTag(questInstance.basePoints));
    }
  }, [questInstance]);

  // Check if form has changes
  const hasChanges =
    questInstance &&
    (title !== questInstance.title ||
      description !== (questInstance.description || "") ||
      basePoints !== questInstance.basePoints ||
      numberToQuestTag(basePoints) !== priority);

  // Handle close with confirmation if needed
  const handleCloseWithConfirmation = (newOpenState: boolean) => {
    if (!newOpenState && hasChanges) {
      setShowConfirmDialog(true);
      return false;
    }
    return true;
  };

  // Handle actual close after confirmation
  const confirmClose = () => {
    setShowConfirmDialog(false);
    setTimeout(() => {
      onOpenChange(false);
    }, 10);
  };

  const updateQuestInstanceMutation = useMutation({
    mutationFn: async (updateData: {
      instanceId: string;
      title: string;
      description?: string;
      basePoints: number;
    }) => {
      return questApi.updateQuestInstance(updateData);
    },
    onSuccess: () => {
      toast.success("Quest instance updated successfully!");
      queryClient.invalidateQueries({ queryKey });
      if (
        Array.isArray(queryKey) &&
        queryKey.length === 1 &&
        queryKey[0] !== "todaysQuests"
      ) {
        queryClient.invalidateQueries({ queryKey: ["todaysQuests"] });
      }
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update quest instance");
    },
  });

  const handleSubmit = () => {
    if (!questInstance) return;
    if (!priority) {
      setErrors({ priority: "Please select a priority." });
      return;
    }
    setErrors({});
    updateQuestInstanceMutation.mutate({
      instanceId: questInstance.instanceId,
      title: title.trim(),
      description: description.trim() || undefined,
      basePoints: questTagToNumber(priority),
    });
  };

  if (!questInstance) return null;

  const colorStyles = getEditQuestColorStyles(questInstance.type);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(newOpenState) => {
          if (handleCloseWithConfirmation(newOpenState)) {
            onOpenChange(newOpenState);
          }
        }}
      >
        <DialogContent
          className={`sm:max-w-[500px] w-full bg-gradient-to-br from-zinc-900 via-zinc-950 to-black ${colorStyles.headerBorder} max-h-[85vh] overflow-hidden shadow-xl flex flex-col mt-6 sm:mt-0`}
        >
          {/* Visual decorations */}
          <EditQuestDecorations questType={questInstance.type} />

          {/* Dialog header */}
          <DialogHeader className="flex-none px-6 pt-6 pb-2 relative">
            <div className="flex items-center gap-3 mb-1">
              <div
                className={`bg-black/40 w-8 h-8 rounded-full flex items-center justify-center shadow-md ring-1 ${colorStyles.iconBg}`}
              >
                <Edit3 className={`h-4 w-4 ${colorStyles.iconColor}`} />
              </div>
              <DialogTitle className="text-xl font-medieval text-white/90">
                Edit {questInstance.type === "daily" ? "Daily" : "Side"} Quest
                Instance
              </DialogTitle>
            </div>
            <p className="text-zinc-400 text-xs mt-1">
              Modify this specific quest occurrence for today
            </p>
          </DialogHeader>

          {/* Form fields */}
          <div className="space-y-6 py-4 px-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 relative">
            {/* Important notice */}
            <div
              className={`bg-gradient-to-r ${colorStyles.infoGradient} p-3 rounded-lg border ${colorStyles.infoBorder} flex gap-3 items-center`}
            >
              <Info
                className={`h-5 w-5 ${colorStyles.infoIconColor} flex-shrink-0`}
              />
              <div className="text-xs text-zinc-400">
                <span className={colorStyles.infoTextColor}>Note:</span> Changes
                will only affect this particular day's instance. To change
                future occurrences, edit the quest template in Quest Manager.
              </div>
            </div>

            <div className="space-y-2">
              <label
                className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
              >
                <Scroll className="h-3.5 w-3.5" />
                Quest Title
              </label>
              <Input
                placeholder="Enter quest title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`bg-black/50 border-zinc-700 ${colorStyles.focusBorder} text-white placeholder:text-zinc-500`}
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2 w-[48%]">
              <label
                className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
              >
                <Target className="h-3.5 w-3.5" />
                Importance
              </label>
              <Select
                value={priority}
                onValueChange={(value: string) => {
                  setPriority(value);
                  setBasePoints(questTagToNumber(value));
                  setErrors({});
                }}
              >
                <SelectTrigger
                  className={`bg-black/50 border-zinc-700 text-white hover:bg-black/70 ${colorStyles.hoverBorder} ${errors.priority ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select importance" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem
                    value="optional"
                    className={`focus:${colorStyles.labelColor}`}
                  >
                    Optional
                  </SelectItem>
                  <SelectItem
                    value="minor"
                    className={`focus:${colorStyles.labelColor}`}
                  >
                    Minor Quest
                  </SelectItem>
                  <SelectItem
                    value="standard"
                    className={`focus:${colorStyles.labelColor}`}
                  >
                    Standard
                  </SelectItem>
                  <SelectItem
                    value="important"
                    className={`focus:${colorStyles.labelColor}`}
                  >
                    Important
                  </SelectItem>
                  <SelectItem
                    value="critical"
                    className={`focus:${colorStyles.labelColor}`}
                  >
                    Critical
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.priority && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.priority}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
              >
                <Scroll className="h-3.5 w-3.5" />
                Description (Optional)
              </label>
              <Textarea
                placeholder="Enter quest description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`bg-black/50 border-zinc-700 ${colorStyles.focusBorder} text-white min-h-[100px] placeholder:text-zinc-500`}
                maxLength={500}
              />
            </div>
          </div>

          {/* Footer with actions */}
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-zinc-800/50 flex-none px-6 pb-6 relative">
            <Button
              variant="outline"
              onClick={() => {
                if (handleCloseWithConfirmation(false)) {
                  onOpenChange(false);
                }
              }}
              className="bg-zinc-800/30 hover:bg-zinc-700/50 border-zinc-700/50 text-zinc-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className={`bg-gradient-to-r ${colorStyles.buttonGradient} border-0 text-white shadow-lg ${colorStyles.buttonShadow}`}
              disabled={
                !title.trim() ||
                !hasChanges ||
                updateQuestInstanceMutation.isPending
              }
            >
              {updateQuestInstanceMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span>Save Changes</span>
                </div>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unsaved changes alert */}
      <UnsavedChangesAlert
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={confirmClose}
      />
    </>
  );
};

export default EditQuestInstanceDialog;
