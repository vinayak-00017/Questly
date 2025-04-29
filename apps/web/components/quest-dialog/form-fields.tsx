"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scroll, Target, LinkIcon, AlertCircle, Clock } from "lucide-react";
import { QuestPriority, MainQuestId } from "@questly/types";
import { QuestFormFieldsProps, getQuestColorStyles } from "./types";

export function QuestFormFields({
  formData,
  onUpdateForm,
  themeColor,
  renderDateField,
  mainQuestsIds,
  InfoIcon,
  infoTitle,
  infoText,
  errors = {},
}: QuestFormFieldsProps) {
  const { Critical, Important, Standard, Minor, Optional } = QuestPriority;
  const colorStyles = getQuestColorStyles(themeColor);

  return (
    <div className="space-y-6 py-4 px-6 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800 relative">
      <div className="space-y-2">
        <label
          className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
        >
          <Scroll className="h-3.5 w-3.5" />
          Quest Title
        </label>
        <Input
          placeholder="Enter quest title..."
          value={formData.title}
          onChange={(e) => onUpdateForm("title", e.target.value)}
          className={`bg-black/50 border-zinc-700 ${colorStyles.focusBorder} text-white placeholder:text-zinc-500 ${
            errors.title ? "border-red-500" : ""
          }`}
        />
        {errors.title && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.title}
          </p>
        )}
      </div>

      <div className="space-y-2">
        {renderDateField({
          onChange: (value) => onUpdateForm("dateValue", value),
          value: formData.dateValue,
          className: `w-full bg-black/50 border-zinc-700 hover:bg-black/70 ${colorStyles.hoverBorder} ${
            errors.dateValue ? "border-red-500" : ""
          }`,
        })}
      </div>

      <div className=" flex justify-between items-center">
        <div className="space-y-2 w-[48%]">
          <label
            className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
          >
            <Target className="h-3.5 w-3.5" />
            Importance
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value) =>
              onUpdateForm("priority", value as QuestPriority)
            }
          >
            <SelectTrigger
              className={`bg-black/50 border-zinc-700 text-white hover:bg-black/70 ${colorStyles.hoverBorder} ${
                errors.priority ? "border-red-500" : ""
              }`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem
                value={Optional}
                className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
              >
                Optional
              </SelectItem>
              <SelectItem
                value={Minor}
                className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
              >
                Minor Quest
              </SelectItem>
              <SelectItem
                value={Standard}
                className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
              >
                Standard
              </SelectItem>
              <SelectItem
                value={Important}
                className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
              >
                Important
              </SelectItem>
              <SelectItem
                value={Critical}
                className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
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

        <div className="space-y-2 w-[48%]">
          <label
            className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
          >
            <LinkIcon className="h-3.5 w-3.5" />
            Link to Main Quest
          </label>
          <Select
            value={formData.parentQuestId || "undefined"}
            onValueChange={(value) => {
              onUpdateForm(
                "parentQuestId",
                value === "undefined" ? undefined : value
              );
            }}
          >
            <SelectTrigger
              className={`bg-black/50 border-zinc-700 text-white hover:bg-black/70 ${colorStyles.hoverBorder} ${
                errors.parentQuestId ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select a parent quest" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem
                value={"undefined"}
                className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
              >
                None
              </SelectItem>
              {mainQuestsIds.map((quest: MainQuestId) => (
                <SelectItem
                  key={quest.id}
                  value={quest.id}
                  className={`focus:bg-${themeColor}-900/20 focus:${colorStyles.labelColor}`}
                >
                  {quest.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.parentQuestId && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.parentQuestId}
            </p>
          )}
        </div>
        {/* <div className="space-y-2 w-[48%]">
          <label
            className={`text-sm font-medium ${colorStyles.labelColor} flex items-center gap-2`}
          >
            <Clock className="h-3.5 w-3.5" />
            Time Tracking
          </label>

          {errors.parentQuestId && (
            <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.parentQuestId}
            </p>
          )}
        </div> */}
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
          value={formData.description}
          onChange={(e) => onUpdateForm("description", e.target.value)}
          className={`bg-black/50 border-zinc-700 ${colorStyles.focusBorder} text-white min-h-[100px] placeholder:text-zinc-500 ${
            errors.description ? "border-red-500" : ""
          }`}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.description}
          </p>
        )}
      </div>

      {InfoIcon && infoTitle && infoText && (
        <div
          className={`bg-gradient-to-r ${colorStyles.infoGradient} p-3 rounded-lg border ${colorStyles.infoBorder} flex gap-3 items-center`}
        >
          <InfoIcon
            className={`h-5 w-5 ${colorStyles.infoIconColor} flex-shrink-0`}
          />
          <div className="text-xs text-zinc-400">
            <span className={colorStyles.infoTextColor}>{infoTitle}</span>{" "}
            {infoText}
          </div>
        </div>
      )}
    </div>
  );
}
