import React from "react";
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
import { QuestTemplate } from "@questly/types";

interface QuestTemplateDeleteDialogProps {
  questTemplate: QuestTemplate;
  showDeleteDialog: boolean;
  setShowDeleteDialog: (show: boolean) => void;
  onDelete: (id: string) => void;
}

export const QuestTemplateDeleteDialog: React.FC<QuestTemplateDeleteDialogProps> = ({
  questTemplate,
  showDeleteDialog,
  setShowDeleteDialog,
  onDelete,
}) => {
  return (
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
  );
};