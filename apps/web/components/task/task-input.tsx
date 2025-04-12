import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Clock, Decrease, Increase } from "@/utils/Icons";

interface TaskInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isPending: boolean;
  points: number;
  onPointsChange: (points: number) => void;
  isTimeTracked?: boolean;
  onTimeTrackChange?: (isTracked: boolean) => void;
  plannedDuration?: number;
  onDurationChange?: (duration: number) => void;
}

const TaskInput = ({
  value,
  onChange,
  onSubmit,
  isPending,
  points,
  onPointsChange,
  isTimeTracked = false,
  onTimeTrackChange = () => {},
  plannedDuration = 30,
  onDurationChange = () => {},
}: TaskInputProps) => {
  const [customValue, setCustomValue] = useState(points.toString());
  const [durationValue, setDurationValue] = useState(
    plannedDuration.toString()
  );

  const handleCustomValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);

    // Parse as integer and update if valid
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onPointsChange(Math.min(10, num));
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDurationValue(value);

    // Parse as integer and update if valid
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onDurationChange(num);
    }
  };

  return (
    <div className="flex gap-2 w-full max-w-md flex-col">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={onChange}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Add a new task..."
          disabled={isPending}
        />
        <Button onClick={onSubmit} disabled={isPending || !value.trim()}>
          {isPending ? "Adding..." : "Add Task"}
        </Button>
      </div>
      <div className="flex gap-2.5 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex gap-2 items-center">
              <label className="text-sm font-medium">Priority:</label>
              <Button variant="outline" size="sm" className="h-8">
                {points} points
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-4">
            <Tabs defaultValue="preset">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preset">Preset Values</TabsTrigger>
                <TabsTrigger value="custom">Custom Value</TabsTrigger>
              </TabsList>

              <TabsContent value="preset" className="space-y-4">
                <div className="flex flex-col gap-2">
                  {[
                    { value: "5", label: "Top Priority (5)" },
                    { value: "3", label: "High Priority (3)" },
                    { value: "2", label: "Medium Priority (2)" },
                    { value: "1", label: "Low Priority (1)" },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        points === parseInt(option.value)
                          ? "default"
                          : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => onPointsChange(parseInt(option.value, 10))}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="custom">
                <div className="space-y-2">
                  <Label htmlFor="custom-points">Custom Points Value</Label>
                  <div className="flex items-center rounded-md border border-input overflow-hidden">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-none border-r border-input px-2 flex-shrink-0"
                      onClick={() => {
                        const newValue = Math.max(
                          1,
                          parseInt(customValue, 10) - 1
                        );
                        setCustomValue(newValue.toString());
                        onPointsChange(newValue);
                      }}
                      disabled={
                        parseInt(customValue, 10) <= 1 ||
                        parseInt(customValue, 10) > 10
                      }
                    >
                      <span className="sr-only">Decrease</span>
                      <Decrease />
                    </Button>
                    <Input
                      id="custom-points"
                      type="text"
                      inputMode="numeric" // Ensures numeric keyboard on mobile
                      pattern="[0-9]*" // Validates only digits
                      min="1"
                      max="10"
                      value={customValue}
                      onChange={handleCustomValueChange}
                      className="border-0 rounded-none text-center focus-visible:ring-0"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-none border-l border-input px-2 flex-shrink-0"
                      onClick={() => {
                        const newValue = parseInt(customValue, 10) + 1;
                        setCustomValue(newValue.toString());
                        onPointsChange(newValue);
                      }}
                      disabled={
                        parseInt(customValue, 10) < 1 ||
                        parseInt(customValue, 10) >= 10
                      }
                    >
                      <span className="sr-only">Increase</span>
                      <Increase />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter a value between 1 and 10
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </PopoverContent>
        </Popover>

        <div className="flex items-center space-x-2 ml-auto">
          <Switch
            id="time"
            checked={isTimeTracked}
            onCheckedChange={onTimeTrackChange}
          />
          {isTimeTracked && (
            <div className="flex items-center gap-2 mt-2 w-full">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="duration" className="text-sm whitespace-nowrap">
                Duration:
              </Label>
              <div className="flex items-center rounded-md border border-input overflow-hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-none border-r border-input px-2 flex-shrink-0"
                  onClick={() => {
                    const newValue = Math.max(
                      5,
                      parseInt(durationValue, 10) - 5
                    );
                    setDurationValue(newValue.toString());
                    onDurationChange(newValue);
                  }}
                  disabled={parseInt(durationValue, 10) <= 5}
                >
                  <span className="sr-only">Decrease</span>
                  <Decrease />
                </Button>
                <Input
                  id="duration"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={durationValue}
                  onChange={handleDurationChange}
                  className="border-0 rounded-none text-center w-16 focus-visible:ring-0"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-none border-l border-input px-2 flex-shrink-0"
                  onClick={() => {
                    const newValue = parseInt(durationValue, 10) + 5;
                    setDurationValue(newValue.toString());
                    onDurationChange(newValue);
                  }}
                >
                  <span className="sr-only">Increase</span>
                  <Increase />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">minutes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskInput;
