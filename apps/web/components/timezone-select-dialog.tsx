"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Search, Globe, MapPin, Sparkles } from "lucide-react";
import { userApi } from "@/services/user-api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TIMEZONES } from "@questly/utils";
import { motion } from "framer-motion";

interface TimezoneSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
  canClose?: boolean; // New prop to control if dialog can be closed
}

export function TimezoneSelectDialog({
  open,
  onOpenChange,
  onComplete,
  canClose = true, // Default to true for backward compatibility
}: TimezoneSelectDialogProps) {
  const [timezone, setTimezone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Try to detect user's timezone on component mount
  useEffect(() => {
    try {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setTimezone(detected || "UTC");
    } catch (e) {
      setTimezone("UTC");
    }
  }, []);

  // Filter timezones based on search query
  const filteredTimezones = useMemo(() => {
    if (!searchQuery.trim()) return TIMEZONES;

    const query = searchQuery.toLowerCase();
    return TIMEZONES.filter(
      (tz) =>
        tz.label.toLowerCase().includes(query) ||
        tz.abbr.toLowerCase().includes(query) ||
        tz.value.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const updateTimezoneMutation = useMutation({
    mutationFn: userApi.updateTimezone,
    onSuccess: () => {
      toast.success("Your adventure time has been set! ⚡", {
        description: "Daily quests will now align with your schedule",
      });
    },
    onError: (error) => {
      toast.error("Failed to set your adventure time", {
        description: error.message || "Please try again, brave adventurer",
      });
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

  const selectedTimezone = TIMEZONES.find((tz) => tz.value === timezone);

  return (
    <Dialog
      open={open}
      onOpenChange={canClose ? onOpenChange : () => {}} // Only allow closing if canClose is true
    >
      <DialogPortal>
        <DialogOverlay className="z-[60] bg-black/80" />
        <DialogContent
          className="sm:max-w-lg bg-gradient-to-br from-slate-800/95 via-slate-900/95 to-slate-800/95 border-amber-500/20 backdrop-blur-sm z-[60] [&>button]:hidden"
          onEscapeKeyDown={canClose ? undefined : (e) => e.preventDefault()} // Prevent escape key if canClose is false
          onPointerDownOutside={
            canClose ? undefined : (e) => e.preventDefault()
          } // Prevent clicking outside if canClose is false
        >
          <DialogHeader className="pb-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Clock className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white font-medieval">
                  {canClose
                    ? "Set Your Adventure Time"
                    : "🚀 Welcome, Adventurer! Set Your Adventure Time"}
                </DialogTitle>
                <p className="text-sm text-slate-400 mt-1">
                  {canClose
                    ? "Choose your realm's timezone for perfect quest alignment"
                    : "Before beginning your epic journey, let's align your quests with your realm's timezone"}
                </p>
              </div>
            </motion.div>
          </DialogHeader>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="py-4 space-y-6"
          >
            {/* Current timezone display */}
            {selectedTimezone && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-sky-400" />
                  <div>
                    <p className="text-white font-medium">Current Selection</p>
                    <p className="text-sm text-slate-400">
                      <span className="text-amber-400 font-medium">
                        {selectedTimezone.abbr}
                      </span>
                      {" - "}
                      {selectedTimezone.label}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Timezone selector with integrated search */}
            <div className="space-y-2">
              <Label
                htmlFor="timezone"
                className="text-slate-300 flex items-center gap-2"
              >
                <Globe className="h-4 w-4 text-sky-400" />
                Your Adventure Realm
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white hover:border-amber-500/50 transition-colors">
                  <SelectValue placeholder="Select your timezone realm..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 z-[70]">
                  {/* Integrated search bar */}
                  <div className="p-3 border-b border-slate-700">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search realms..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          // Prevent Select component from handling any keyboard events
                          e.stopPropagation();
                        }}
                        onFocus={(e) => {
                          // Prevent focus from shifting away
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          // Prevent click events from bubbling to Select
                          e.stopPropagation();
                        }}
                        autoFocus={false}
                        className="pl-10 h-9 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500 focus:ring-amber-500/20"
                      />
                    </div>
                  </div>

                  <ScrollArea className="h-72">
                    {filteredTimezones.length > 0 ? (
                      filteredTimezones.map((tz) => (
                        <SelectItem
                          key={tz.value}
                          value={tz.value}
                          className="text-slate-300 hover:bg-slate-700 focus:bg-slate-700 cursor-pointer px-3 py-2"
                        >
                          <div className="flex items-center w-full">
                            <span className="font-medium text-amber-400 min-w-[60px]">
                              {tz.abbr}
                            </span>
                            <span className="mx-2 text-slate-500">-</span>
                            <span className="text-slate-200">{tz.label}</span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-400">
                        <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No realms found</p>
                        <p className="text-xs mt-1 text-slate-500">
                          Try searching for a city or country
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/* Helper text */}
            <div className="bg-gradient-to-r from-amber-500/10 to-sky-500/10 rounded-lg p-4 border border-amber-500/20">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-slate-300 font-medium mb-1">
                    Why set your adventure time?
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Your daily quests will reset at midnight in your timezone,
                    ensuring your adventure schedule aligns perfectly with your
                    real-world rhythm.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <DialogFooter className="pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className={`flex gap-3 ${canClose ? "w-full sm:w-auto" : "w-full justify-center"}`}
            >
              {canClose && (
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                  Cancel Quest
                </Button>
              )}
              <Button
                type="submit"
                onClick={handleSave}
                disabled={isLoading || !timezone}
                className={`bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-medium shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${!canClose ? "w-full" : ""}`}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    Setting Time...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    {canClose ? "Set Adventure Time" : "Begin My Adventure"}
                  </div>
                )}
              </Button>
            </motion.div>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
