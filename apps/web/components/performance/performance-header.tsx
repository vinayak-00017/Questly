"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PeriodOption, PeriodType } from "./types";

interface PerformanceHeaderProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
  periodOptions: PeriodOption[];
}

export const PerformanceHeader = ({
  selectedPeriod,
  onPeriodChange,
  periodOptions,
}: PerformanceHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
        <p className="text-zinc-400 text-sm">
          Track your quest completion rates over time
        </p>
      </div>

      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-40 bg-zinc-800 border-zinc-700">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span>{option.label}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
