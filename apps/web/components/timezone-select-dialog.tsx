"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";
import { userApi } from "@/services/user-api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TIMEZONES } from "@questly/utils";

interface TimezoneSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
}

export function TimezoneSelectDialog({
  open,
  onOpenChange,
  onComplete,
}: TimezoneSelectDialogProps) {
  const [timezone, setTimezone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Try to detect user's timezone on component mount
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detected || "UTC");
    } catch (e) {
      setTimezone("UTC");
    }
  }, []);

  const updateTimezoneMutation = useMutation({
    mutationFn: userApi.updateTimezone,
    onSuccess: () => {
      toast.success(`Timezone updated successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update timezone");
    },
  });

  const handleSave = async () => {
    try {
      setIsLoading(true);

      updateTimezoneMutation.mutate({
        timezone: timezone || "UTC",
      });

      onComplete();
    } catch (error) {
      console.error("Failed to update timezone:", error);
    } finally {
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-500" />
            Set Your Adventure Time
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-zinc-500 mb-4">
            Choose your local timezone so your daily quests align with your
            adventure schedule.
          </p>

          <div className="space-y-2">
            <Label htmlFor="timezone">Your Timezone</Label>
            <Select value={timezone} onValueChange={setTimezone}>
              <SelectTrigger>
                <SelectValue placeholder="Select your timezone" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-80">
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      <span className="flex items-center">
                        <span className="font-medium">{tz.abbr}</span>
                        <span className="mx-2">-</span>
                        <span>{tz.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-700 to-purple-600 hover:from-purple-600 hover:to-purple-500"
          >
            {isLoading ? "Saving..." : "Set Timezone"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
