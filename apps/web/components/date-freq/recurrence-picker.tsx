"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RefreshCwIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import FrequencyTab from "./frequency-tab";

// Types
export type FrequencyType = "once" | "daily" | "weekly" | "monthly";

interface RecurrencePickerProps {
  date?: Date;
  onDateSelect: (date: Date | undefined) => void;
  recurrenceRule?: string;
  onRecurrenceSelect: (rule: string | undefined) => void;
  className?: string;
}

export function RecurrencePicker({
  date,
  onDateSelect,
  recurrenceRule,
  onRecurrenceSelect,
  className,
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

  return (
    <TooltipProvider delayDuration={200}>
      <Popover
        open={isOpen}
        onOpenChange={(value) => {
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
                  "bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700/50",
                  "transition-colors duration-200",
                  className
                )}
              >
                <div className="flex items-center w-full overflow-hidden">
                  {recurrenceRule ? (
                    <RefreshCwIcon className="mr-2 h-4 w-4 flex-shrink-0 text-purple-400" />
                  ) : (
                    <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0 text-purple-400" />
                  )}
                  <span className="flex-1 truncate">
                    {recurrenceRule
                      ? getHumanReadableRRule(recurrenceRule, true) +
                        (date ? ` till ${format(date, "MMM d, yyyy")}` : "")
                      : `Once ${
                          +date! ? `on ${format(date!, "MMM d, yyyy")}` : ""
                        }`}
                  </span>
                </div>
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>

          <TooltipContent
            side="left"
            className="bg-zinc-800 border-zinc-700 text-white"
          >
            {recurrenceRule
              ? getHumanReadableRRule(recurrenceRule, true) +
                (date ? ` till ${format(date, "MMM d, yyyy")}` : "")
              : "Once"}
          </TooltipContent>
        </Tooltip>

        <PopoverContent
          className="w-auto p-0 bg-zinc-800 border-zinc-700 text-white shadow-xl rounded-lg"
          align="start"
          onInteractOutside={() => setIsOpen(false)}
          onEscapeKeyDown={() => setIsOpen(false)}
        >
          <Tabs defaultValue="frequency" className="w-[340px]">
            <div className="flex items-center justify-between bg-zinc-700 rounded-t-lg">
              <TabsList className="bg-zinc-700 flex-1 rounded-none">
                <TabsTrigger
                  value="frequency"
                  className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white"
                >
                  Frequency
                </TabsTrigger>
                <TabsTrigger
                  value="date"
                  className="data-[state=active]:bg-zinc-600 data-[state=active]:text-white"
                >
                  Due Date
                </TabsTrigger>
              </TabsList>
              <Button
                size="sm"
                className="mr-2 bg-purple-600 hover:bg-purple-700"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>

            <TabsContent value="frequency">
              <FrequencyTab
                frequency={frequency}
                setFrequency={setFrequency}
                selectedDays={selectedDays}
                setSelectedDays={setSelectedDays}
                selectedDatesOfMonth={selectedDatesOfMonth}
                setSelectedDatesOfMonth={setSelectedDatesOfMonth}
                recurrenceRule={recurrenceRule}
              />
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
