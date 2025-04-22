import {
  MainQuestCategory,
  MainQuestDifficulty,
  MainQuestImportance,
} from "@questly/types";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type MainSelectProps<T extends string> = {
  property: T;
  setProperty: (value: T) => void;
  fields: T[];
  label: string;
};

const MainSelect = <T extends string>({
  property,
  setProperty,
  fields,
  label,
}: MainSelectProps<T>) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-200">{label}</label>
      <Select
        value={property}
        onValueChange={(value: string) => setProperty(value as T)}
      >
        <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          {fields.map((field) => (
            <SelectItem key={field} value={field}>
              {field[0].toUpperCase() + field.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MainSelect;
