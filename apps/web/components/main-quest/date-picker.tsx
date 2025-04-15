"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          "bg-zinc-800/50 border-zinc-700 text-white",
          !date && "text-muted-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4" />
        {date ? format(date, "PPP") : "Select due date"}
      </Button>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50">
          <div className="rounded-md border border-zinc-700 bg-zinc-800 shadow-lg">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                onSelect(date);
                setIsOpen(false);
              }}
              initialFocus
              className="rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}
