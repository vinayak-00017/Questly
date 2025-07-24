import React from "react";
import { Calendar } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <Calendar className="h-12 w-12 text-slate-600 mx-auto mb-4" />
      <h4 className="text-white font-medium mb-2">No Quests Tracked</h4>
      <p className="text-slate-400 text-sm">
        Add quests to start tracking your completion patterns
      </p>
    </div>
  );
};