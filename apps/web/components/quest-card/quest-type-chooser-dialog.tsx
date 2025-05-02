import React from "react";
import { Button } from "../ui/button";
import { Compass, Flame } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface QuestTypeChooserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChoose: (type: "daily" | "side") => void;
}

export const QuestTypeChooserDialog: React.FC<QuestTypeChooserDialogProps> = ({
  open,
  onOpenChange,
  onChoose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-b from-zinc-900 to-black border-zinc-800 p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-3">
          <DialogTitle className="text-xl font-medieval text-white/90">
            Choose Quest Type
          </DialogTitle>
          <DialogDescription className="text-zinc-400 text-sm">
            Select the type of quest you want to add
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 p-6">
          <Button
            variant="outline"
            onClick={() => onChoose("daily")}
            className="flex flex-col items-center justify-center p-6 h-auto border-amber-800/30 hover:border-amber-500/50 bg-gradient-to-br from-amber-900/20 to-orange-900/20 hover:from-amber-800/30 hover:to-orange-800/30"
          >
            <div className="bg-black/40 w-12 h-12 rounded-full flex items-center justify-center mb-3 ring-amber-500/30">
              <Flame className="h-6 w-6 text-amber-500" />
            </div>
            <span className="text-white font-medieval text-lg">
              Daily Quest
            </span>
            <span className="text-zinc-400 text-xs mt-1">
              Repeats every day
            </span>
          </Button>
          <Button
            variant="outline"
            onClick={() => onChoose("side")}
            className="flex flex-col items-center justify-center p-6 h-auto border-sky-800/30 hover:border-sky-500/50 bg-gradient-to-br from-sky-900/20 to-indigo-900/20 hover:from-sky-800/30 hover:to-indigo-800/30"
          >
            <div className="bg-black/40 w-12 h-12 rounded-full flex items-center justify-center mb-3 ring-sky-500/30">
              <Compass className="h-6 w-6 text-sky-500" />
            </div>
            <span className="text-white font-medieval text-lg">Side Quest</span>
            <span className="text-zinc-400 text-xs mt-1">
              Custom Schedule activities
            </span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
