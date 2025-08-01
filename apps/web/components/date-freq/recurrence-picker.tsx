"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarIcon,
  ClockIcon,
  RepeatIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { format, addMonths, subMonths } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [calendarMonth, setCalendarMonth] = useState<Date>(date || new Date());

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

  // Update calendar month when date changes
  useEffect(() => {
    if (date) {
      setCalendarMonth(date);
    }
  }, [date]);

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

  // Month navigation handlers
  const goToPreviousMonth = () => {
    setCalendarMonth((prev) => subMonths(prev, 1));
  };

  const goToNextMonth = () => {
    setCalendarMonth((prev) => addMonths(prev, 1));
  };

  return (
    <TooltipProvider delayDuration={200}>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[320px] justify-start text-left font-normal group relative overflow-hidden",
                  "bg-gradient-to-r from-zinc-900/90 to-zinc-800/90 border-zinc-600/80 text-white",
                  "hover:from-zinc-800/90 hover:to-zinc-700/90 hover:border-purple-500/50",
                  "transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/10",
                  "backdrop-blur-sm border-2",
                  recurrenceRule &&
                    "border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-zinc-900/90",
                  className
                )}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/0 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex items-center w-full overflow-hidden relative z-10">
                  <div className="flex items-center mr-3">
                    {recurrenceRule ? (
                      <div className="relative">
                        <RepeatIcon className="h-4 w-4 text-purple-400 animate-pulse" />
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full animate-ping opacity-75" />
                      </div>
                    ) : (
                      <ClockIcon className="h-4 w-4 text-zinc-400 group-hover:text-purple-400 transition-colors duration-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col">
                      <span
                        className={cn(
                          "text-sm font-medium truncate",
                          recurrenceRule ? "text-white" : "text-zinc-300"
                        )}
                      >
                        {recurrenceRule
                          ? getHumanReadableRRule(recurrenceRule, true)
                          : "One-time task"}
                      </span>
                      {date && (
                        <span className="text-xs text-zinc-400 truncate">
                          {recurrenceRule ? "Until" : "Due"}{" "}
                          {format(date, "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status indicator */}
                  <div className="ml-2 flex-shrink-0">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200",
                        recurrenceRule
                          ? "bg-purple-500 shadow-lg shadow-purple-500/50"
                          : "bg-zinc-500 group-hover:bg-purple-400"
                      )}
                    />
                  </div>
                </div>
              </Button>
            </TooltipTrigger>
          </DialogTrigger>

          <TooltipContent
            side="left"
            className="bg-zinc-900/95 border-zinc-600 text-white shadow-xl rounded-lg backdrop-blur-sm"
          >
            {recurrenceRule
              ? getHumanReadableRRule(recurrenceRule, true) +
                (date ? ` till ${format(date, "MMM d, yyyy")}` : "")
              : "One-time task"}
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[580px] p-0 bg-gradient-to-b from-zinc-900/98 to-zinc-800/98 border-zinc-600/50 text-white shadow-2xl backdrop-blur-md border-2">
          <div className="relative overflow-hidden">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5 animate-pulse" />

            {/* Custom Header */}
            <DialogHeader className="relative z-10 bg-gradient-to-r from-zinc-800/90 via-zinc-700/90 to-zinc-800/90 p-5 border-b border-zinc-600/30">
              <div className="flex items-center justify-between">
                <DialogTitle className="flex items-center space-x-3 text-lg font-semibold text-zinc-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  <span>Schedule Settings</span>
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-zinc-700/50 rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>

            <ScrollArea className="max-h-[75vh] relative z-10">
              <Tabs defaultValue="frequency" className="w-full">
                {/* Tab Navigation */}
                <div className="p-5 pb-0">
                  <TabsList className="grid w-full grid-cols-2 bg-zinc-700/50 backdrop-blur-sm border border-zinc-600/30 rounded-lg p-1 h-12">
                    <TabsTrigger
                      value="frequency"
                      className={cn(
                        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700",
                        "data-[state=active]:text-white data-[state=active]:shadow-lg",
                        "rounded-md transition-all duration-300 text-sm font-medium py-2.5",
                        "hover:bg-zinc-600/50"
                      )}
                    >
                      <RepeatIcon className="w-4 h-4 mr-2" />
                      Frequency
                    </TabsTrigger>
                    <TabsTrigger
                      value="date"
                      className={cn(
                        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-700",
                        "data-[state=active]:text-white data-[state=active]:shadow-lg",
                        "rounded-md transition-all duration-300 text-sm font-medium py-2.5",
                        "hover:bg-zinc-600/50"
                      )}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Due Date
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="frequency" className="m-0 mt-4">
                  <FrequencyTab
                    frequency={frequency}
                    setFrequency={setFrequency}
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                    selectedDatesOfMonth={selectedDatesOfMonth}
                    setSelectedDatesOfMonth={setSelectedDatesOfMonth}
                    recurrenceRule={recurrenceRule}
                    date={date}
                  />
                </TabsContent>

                <TabsContent value="date" className="p-0 m-0">
                  <div className="p-4">
                    {/* Calendar with side chevrons */}
                    <div className="flex items-center justify-center space-x-4">
                      {/* Left Chevron */}
                      <Button
                        variant="ghost"
                        size="lg"
                        className={cn(
                          "h-12 w-12 p-0 rounded-xl transition-all duration-200",
                          "bg-zinc-800/50 hover:bg-zinc-700/70 border-2 border-zinc-600/30",
                          "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10",
                          "backdrop-blur-sm group"
                        )}
                        onClick={goToPreviousMonth}
                      >
                        <ChevronLeft className="h-6 w-6 text-zinc-400 group-hover:text-purple-300 transition-colors duration-200" />
                      </Button>

                      {/* Calendar Container */}
                      <div className="flex flex-col items-center space-y-2">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={onDateSelect}
                          month={calendarMonth}
                          onMonthChange={setCalendarMonth}
                          initialFocus
                          className="rounded-xl bg-zinc-800/50 border border-zinc-600/30 backdrop-blur-sm shadow-lg"
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                        />
                      </div>

                      {/* Right Chevron */}
                      <Button
                        variant="ghost"
                        size="lg"
                        className={cn(
                          "h-12 w-12 p-0 rounded-xl transition-all duration-200",
                          "bg-zinc-800/50 hover:bg-zinc-700/70 border-2 border-zinc-600/30",
                          "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10",
                          "backdrop-blur-sm group"
                        )}
                        onClick={goToNextMonth}
                      >
                        <ChevronRight className="h-6 w-6 text-zinc-400 group-hover:text-purple-300 transition-colors duration-200" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </ScrollArea>

            {/* Footer */}
            <div className="relative z-10 p-5 bg-gradient-to-r from-zinc-800/90 to-zinc-700/90 border-t border-zinc-600/30">
              <div className="flex justify-end">
                <Button
                  className={cn(
                    "bg-gradient-to-r from-purple-600 to-purple-700",
                    "hover:from-purple-700 hover:to-purple-800",
                    "shadow-lg hover:shadow-xl transition-all duration-300",
                    "rounded-lg font-medium px-8 py-2.5 h-10",
                    "border border-purple-500/30 hover:border-purple-400/50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
