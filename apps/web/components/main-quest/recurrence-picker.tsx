"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  createDailyRRule,
  createWeeklyRRule,
  createWeekdayRRule,
  createWeekendRRule,
  createMonthlyRRule,
  getHumanReadableRRule,
} from "@/lib/rrule-utils";

interface RecurrencePickerProps {
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  recurrenceRule?: string;
  onRecurrenceSelect: (rule: string | undefined) => void;
}

type FrequencyType = "once" | "daily" | "weekly" | "monthly";

export function RecurrencePicker({
  date,
  onDateSelect,
  recurrenceRule,
  onRecurrenceSelect,
}: RecurrencePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyType>("once");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [selectedDatesOfMonth, setSelectedDatesOfMonth] = useState<number[]>(
    []
  );
  const buttonRef = useRef<HTMLButtonElement>(null);

  // When recurrenceRule changes externally, update the local state
  useEffect(() => {
    if (!recurrenceRule) {
      setFrequency("once");
      return;
    }

    if (recurrenceRule === "FREQ=DAILY") {
      setFrequency("daily");
    } else if (recurrenceRule.startsWith("FREQ=WEEKLY")) {
      setFrequency("weekly");

      // Extract days from BYDAY=MO,TU,...
      const match = recurrenceRule.match(/BYDAY=([A-Z,]+)/);
      if (match) {
        const dayMap: Record<string, number> = {
          SU: 0,
          MO: 1,
          TU: 2,
          WE: 3,
          TH: 4,
          FR: 5,
          SA: 6,
        };
        const days = match[1].split(",").map((day) => dayMap[day]);
        setSelectedDays(days);
      }
    } else if (recurrenceRule.startsWith("FREQ=MONTHLY")) {
      setFrequency("monthly");

      // Extract dates from BYMONTHDAY=1,15,...
      const match = recurrenceRule.match(/BYMONTHDAY=([0-9,]+)/);
      if (match) {
        const days = match[1].split(",").map((day) => parseInt(day));
        setSelectedDatesOfMonth(days);
      }
    }
  }, [recurrenceRule]);

  // Update the recurrence rule when settings change
  const updateRecurrenceRule = () => {
    // Prevent unnecessary updates if they would result in the same recurrence rule
    let newRecurrenceRule: string | undefined;

    if (frequency === "once") {
      newRecurrenceRule = undefined;
    } else if (frequency === "daily") {
      newRecurrenceRule = createDailyRRule();
    } else if (frequency === "weekly") {
      if (
        selectedDays.length === 5 &&
        selectedDays.includes(1) &&
        selectedDays.includes(2) &&
        selectedDays.includes(3) &&
        selectedDays.includes(4) &&
        selectedDays.includes(5)
      ) {
        newRecurrenceRule = createWeekdayRRule();
      } else if (
        selectedDays.length === 2 &&
        selectedDays.includes(0) &&
        selectedDays.includes(6)
      ) {
        newRecurrenceRule = createWeekendRRule();
      } else {
        newRecurrenceRule = createWeeklyRRule(selectedDays);
      }
    } else if (frequency === "monthly") {
      newRecurrenceRule = createMonthlyRRule(selectedDatesOfMonth);
    }

    // Only update if the rule has actually changed
    if (newRecurrenceRule !== recurrenceRule) {
      onRecurrenceSelect(newRecurrenceRule);
    }
  };

  // Call updateRecurrenceRule whenever frequency or selected days change
  // but skip the first render
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    updateRecurrenceRule();
  }, [frequency, selectedDays, selectedDatesOfMonth]);

  // Toggle a day selection for weekly recurrence
  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  // Toggle a date selection for monthly recurrence
  const toggleDate = (date: number) => {
    setSelectedDatesOfMonth((prev) =>
      prev.includes(date)
        ? prev.filter((d) => d !== date)
        : [...prev, date].sort((a, b) => a - b)
    );
  };

  // Set common recurrence patterns
  const setWeekdaysOnly = () => {
    setSelectedDays([1, 2, 3, 4, 5]);
  };

  const setWeekendsOnly = () => {
    setSelectedDays([0, 6]);
  };

  // Create preset buttons for monthly selection
  const presetDateButtons = () => {
    const buttons = [];
    for (let i = 1; i <= 31; i++) {
      buttons.push(
        <Button
          key={i}
          type="button"
          size="sm"
          variant={selectedDatesOfMonth.includes(i) ? "default" : "outline"}
          className={cn(
            "h-8 w-8 p-0 m-1",
            selectedDatesOfMonth.includes(i) && "bg-purple-500 text-white"
          )}
          onClick={() => toggleDate(i)}
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Popover
        open={isOpen}
        onOpenChange={(value) => {
          // Only update if the value is actually changing
          if (isOpen !== value) {
            setIsOpen(value);
          }
        }}
      >
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                ref={buttonRef}
                variant="outline"
                className={cn(
                  "w-[220px] justify-start text-left font-normal",
                  "bg-zinc-800/50 border-zinc-700 text-white"
                )}
              >
                <div className="flex items-center w-full overflow-hidden">
                  {recurrenceRule ? (
                    <RefreshCwIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  ) : (
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="flex-1 truncate">
                    {recurrenceRule
                      ? getHumanReadableRRule(recurrenceRule, true) +
                        (date ? " till " + format(date, "MMM d, yyyy") : "")
                      : "Once"}
                  </span>
                </div>
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent>
            {recurrenceRule
              ? getHumanReadableRRule(recurrenceRule, true) +
                (date ? " till " + format(date, "MMM d, yyyy") : "")
              : "Once"}
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          className="w-auto p-0 bg-zinc-800 border-zinc-700 text-white"
          align="start"
          onInteractOutside={() => setIsOpen(false)}
          onEscapeKeyDown={() => setIsOpen(false)}
        >
          <Tabs defaultValue="frequency" className="w-[340px]">
            <div className="flex items-center justify-between bg-zinc-700">
              <TabsList className="bg-zinc-700 flex-1">
                <TabsTrigger value="frequency">Frequency</TabsTrigger>
                <TabsTrigger value="date">Due Date</TabsTrigger>
              </TabsList>
              <Button
                size="sm"
                className="mr-2"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>

            <TabsContent value="frequency" className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Recurrence Pattern
                </label>
                <Select
                  value={frequency}
                  onValueChange={(value) =>
                    setFrequency(value as FrequencyType)
                  }
                >
                  <SelectTrigger className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600">
                    <SelectItem value="once">Once (No recurrence)</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {frequency === "weekly" && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium">
                      Repeat on days:
                    </label>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={setWeekdaysOnly}
                      >
                        Weekdays
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-xs"
                        onClick={setWeekendsOnly}
                      >
                        Weekends
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-2">
                    {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                      <Button
                        key={index}
                        type="button"
                        size="sm"
                        variant={
                          selectedDays.includes(index) ? "default" : "outline"
                        }
                        className={cn(
                          "h-8 w-8 p-0",
                          selectedDays.includes(index) &&
                            "bg-purple-500 text-white"
                        )}
                        onClick={() => toggleDay(index)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {frequency === "monthly" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Repeat on dates:
                  </label>
                  <div className="flex flex-wrap max-w-[300px]">
                    {presetDateButtons()}
                  </div>
                </div>
              )}

              <div className="pt-2 text-sm text-zinc-400">
                {recurrenceRule ? (
                  <div className="flex items-center overflow-hidden">
                    <span className="mr-1 flex-shrink-0">Pattern:</span>
                    <span className="font-medium text-white truncate">
                      {getHumanReadableRRule(recurrenceRule)}
                    </span>
                  </div>
                ) : (
                  <div>No recurrence pattern</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="date" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onDateSelect}
                initialFocus
                className="rounded-md bg-zinc-800"
              />
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  );
}
