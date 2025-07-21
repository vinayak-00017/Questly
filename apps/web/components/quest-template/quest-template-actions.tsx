import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Edit,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { QuestTemplate } from "@questly/types";

interface QuestTemplateActionsProps {
  questTemplate: QuestTemplate;
  onEdit: (questTemplate: QuestTemplate) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, isActive: boolean) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

export const QuestTemplateActions: React.FC<QuestTemplateActionsProps> = ({
  questTemplate,
  onEdit,
  onToggleStatus,
  setShowDeleteDialog,
}) => {
  return (
    <div className="flex-shrink-0 ml-2">
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
  );
};