"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { ArrowBigRightIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({ date, onSelect, className }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative z-50" ref={ref}>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          "bg-zinc-800/50 border-zinc-700 text-white",
          !date && "text-muted-foreground",
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <ArrowBigRightIcon className="mr-2 h-4 w-4" />
        {date ? `Till  ${format(date, "PPP")}` : "Select due date"}
      </Button>
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 z-50 w-auto">
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
