"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const [month, setMonth] = React.useState<Date>(props.month || new Date())
  
  // Generate years from current year - 10 to current year + 10
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
  
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleYearChange = (year: string) => {
    const newDate = new Date(month)
    newDate.setFullYear(parseInt(year))
    setMonth(newDate)
    props.onMonthChange?.(newDate)
  }

  const handleMonthChange = (monthIndex: string) => {
    const newDate = new Date(month)
    newDate.setMonth(parseInt(monthIndex))
    setMonth(newDate)
    props.onMonthChange?.(newDate)
  }

  React.useEffect(() => {
    if (props.month) {
      setMonth(props.month)
    }
  }, [props.month])

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      month={month}
      onMonthChange={setMonth}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "hidden", // Hide default label since we're using custom dropdowns
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-zinc-700/50 border-zinc-600 text-zinc-300 hover:bg-zinc-600/50 hover:text-white transition-all duration-200"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-zinc-400 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-purple-600/20 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100 text-white hover:bg-zinc-700/50 hover:text-white transition-all duration-200"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-purple-600 aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-purple-600 aria-selected:text-white",
        day_selected:
          "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white shadow-lg",
        day_today: "bg-zinc-700/50 text-purple-300 font-semibold",
        day_outside:
          "day-outside text-zinc-600 aria-selected:text-zinc-500",
        day_disabled: "text-zinc-600 opacity-50",
        day_range_middle:
          "aria-selected:bg-purple-600/30 aria-selected:text-white",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4", className)} {...props} />
        ),
        Caption: ({ displayMonth }) => (
          <div className="flex items-center justify-center gap-2 relative w-full">
            <Select
              value={displayMonth.getMonth().toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[110px] h-8 bg-zinc-700 border-zinc-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-600">
                {months.map((monthName, index) => (
                  <SelectItem 
                    key={index} 
                    value={index.toString()}
                    className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select
              value={displayMonth.getFullYear().toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[80px] h-8 bg-zinc-700 border-zinc-600 text-white text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-600 max-h-[200px]">
                {years.map((year) => (
                  <SelectItem 
                    key={year} 
                    value={year.toString()}
                    className="text-white hover:bg-zinc-700 focus:bg-zinc-700"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
