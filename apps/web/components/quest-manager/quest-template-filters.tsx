import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { FilterState } from "@/hooks/useFilteredTemplates";

interface QuestTemplateFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onAddQuest: () => void;
}

export const QuestTemplateFilters: React.FC<QuestTemplateFiltersProps> = ({
  filters,
  onFiltersChange,
  onAddQuest,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
    >
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={filters.searchTerm}
            onChange={(e) => onFiltersChange({ searchTerm: e.target.value })}
            className="pl-10 bg-slate-800/50 border-slate-600 text-white"
          />
        </div>

        <Select
          value={filters.filterType}
          onValueChange={(value: any) => onFiltersChange({ filterType: value })}
        >
          <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.filterQuestType}
          onValueChange={(value: any) =>
            onFiltersChange({ filterQuestType: value })
          }
        >
          <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="side">Side</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.filterImportance}
          onValueChange={(value: any) =>
            onFiltersChange({ filterImportance: value })
          }
        >
          <SelectTrigger className="w-32 bg-slate-800/50 border-slate-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Importance</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="important">Important</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="optional">Optional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={onAddQuest} className="bg-stone-300 hover:bg-stone-500">
        <Plus className="h-4 w-4 mr-2" />
        New Template
      </Button>
    </motion.div>
  );
};
