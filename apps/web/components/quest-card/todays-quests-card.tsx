import React, { memo } from "react";
import { Target, ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import QuestCard from "./quest-card";
import { userApi } from "@/services/user-api";
import { QuestTypeChooserDialog } from "./quest-type-chooser-dialog";
import { AddDailyQuestDialog } from "../quest-dialog/add-daily-quest-dialog";
import { AddSideQuestDialog } from "../quest-dialog/add-side-quest-dialog";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { toLocalDbDate, getLocalDateMidnight } from "@questly/utils";

const formatYYYYMMDD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const parseYMD = (s: string) => new Date(`${s}T00:00:00`);

const TodaysQuestsCard = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedQuestType, setSelectedQuestType] = React.useState<
    "daily" | "side" | null
  >(null);
  const [isTypeChooserOpen, setIsTypeChooserOpen] = React.useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  const { data: userStatsData } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => data.userStats,
  });
  const userTimezone = userStatsData?.timezone || "UTC";

  const todayStr = React.useMemo(() => {
    const todayLocalMidnight = getLocalDateMidnight(new Date(), userTimezone);
    return toLocalDbDate(todayLocalMidnight, userTimezone);
  }, [userTimezone]);

  const [selectedDate, setSelectedDate] = React.useState<string>(todayStr);

  React.useEffect(() => {
    setSelectedDate(todayStr);
  }, [todayStr]);

  const userCreatedAt = userStatsData?.createdAt
    ? new Date(userStatsData.createdAt)
    : null;
  const userCreatedDateStr = React.useMemo(() => {
    if (!userCreatedAt) return null;
    const localMidnight = getLocalDateMidnight(userCreatedAt, userTimezone);
    return toLocalDbDate(localMidnight, userTimezone);
  }, [userCreatedAt, userTimezone]);
  const atEarliest = React.useMemo(() => {
    return userCreatedDateStr ? selectedDate <= userCreatedDateStr : false;
  }, [selectedDate, userCreatedDateStr]);

  const isToday = selectedDate === todayStr;

  const yesterdayStr = React.useMemo(() => {
    const d = parseYMD(todayStr);
    d.setDate(d.getDate() - 1);
    return formatYYYYMMDD(d);
  }, [todayStr]);

  const cardTitle = React.useMemo(() => {
    if (selectedDate === todayStr) return "Today's Quests";
    if (selectedDate === yesterdayStr) return "Yesterday's Quests";
    try {
      const human = new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
        undefined,
        {
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: userTimezone,
        }
      );
      return `${human}'s Quests`;
    } catch {
      return "Quests";
    }
  }, [selectedDate, todayStr, yesterdayStr, userTimezone]);

  const goToPrevDay = () => {
    if (userCreatedDateStr && selectedDate <= userCreatedDateStr) return;
    const d = parseYMD(selectedDate);
    d.setDate(d.getDate() - 1);
    const prev = formatYYYYMMDD(d);
    setSelectedDate(
      userCreatedDateStr && prev < userCreatedDateStr
        ? userCreatedDateStr
        : prev
    );
  };

  const goToNextDay = () => {
    if (isToday) return;
    const d = parseYMD(selectedDate);
    d.setDate(d.getDate() + 1);
    const next = formatYYYYMMDD(d);
    if (next > todayStr) return;
    setSelectedDate(next);
  };

  const handleAddQuest = () => setIsTypeChooserOpen(true);

  const handleQuestTypeSelect = (questType: "daily" | "side") => {
    setIsTypeChooserOpen(false);
    setSelectedQuestType(questType);
    setIsDialogOpen(true);
  };

  const CurrentAddDialog =
    selectedQuestType === "daily" ? AddDailyQuestDialog : AddSideQuestDialog;

  const readableDate = React.useMemo(() => {
    try {
      return new Date(`${selectedDate}T00:00:00`).toLocaleDateString(
        undefined,
        {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
          timeZone: userTimezone,
        }
      );
    } catch {
      return selectedDate;
    }
  }, [selectedDate, userTimezone]);

  const [calendarMonth, setCalendarMonth] = React.useState<Date>(() =>
    parseYMD(selectedDate)
  );
  React.useEffect(() => {
    setCalendarMonth(parseYMD(selectedDate));
  }, [selectedDate]);

  return (
    <>
      <div className="relative todays-quests">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900/10 to-transparent rounded-lg" />
        <div
          className="absolute inset-0 rounded-lg"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.05) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 px-4 pt-4 pb-1 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPrevDay}
            disabled={atEarliest}
            className="gap-1 text-xs disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground hover:bg-zinc-800/40 px-2 py-1 rounded-md transition-colors"
                aria-label="Open date picker"
              >
                <CalendarDays className="h-4 w-4" />
                <span>{readableDate}</span>
                {isToday && (
                  <span className="text-xs text-green-400 border border-green-400/30 rounded px-1 py-0.5">
                    Today
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-auto p-0 bg-zinc-900 border-zinc-700"
            >
              <Calendar
                mode="single"
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                selected={parseYMD(selectedDate)}
                onSelect={(d) => {
                  if (!d) return;
                  const picked = formatYYYYMMDD(d);
                  if (
                    (userCreatedDateStr && picked < userCreatedDateStr) ||
                    picked > todayStr
                  )
                    return;
                  setSelectedDate(picked);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) => {
                  const ymd = formatYYYYMMDD(date);
                  if (userCreatedDateStr && ymd < userCreatedDateStr)
                    return true;
                  if (ymd > todayStr) return true;
                  return false;
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextDay}
            disabled={isToday}
            className="gap-1 text-xs disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <QuestCard
          title={cardTitle}
          description="All your daily and side quests in one place"
          Icon={Target}
          EmptyIcon={Target}
          type="today"
          themeColor="purple"
          fetchFn={() => userApi.getQuestDetails(selectedDate)}
          queryKey={["todaysQuests", selectedDate]}
          dataSelector={(data) =>
            (data?.quests || []).map((q: any) => ({
              instanceId: q.id,
              templateId: q.templateId,
              title: q.title,
              description: q.description,
              date: data?.date || selectedDate,
              completed: q.completed,
              basePoints: q.points,
              type: q.type,
              xpReward: q.xpReward ?? 0,
            }))
          }
          emptyStateTitle="No Quests For This Day"
          emptyStateDescription="Add daily or side quests to see them here"
          onAddQuest={handleAddQuest}
        />
      </div>

      <QuestTypeChooserDialog
        open={isTypeChooserOpen}
        onOpenChange={setIsTypeChooserOpen}
        onChoose={handleQuestTypeSelect}
      />
      {isDialogOpen && selectedQuestType && (
        <CurrentAddDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSuccess={() => {
            setSelectedQuestType(null);
          }}
        />
      )}

      <style jsx global>{`
        .todays-quests .priority-dot {
          animation: tq-blink 1.6s ease-in-out infinite;
          border-radius: 9999px;
        }
        @keyframes tq-blink {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.65;
          }
        }
      `}</style>
    </>
  );
};

export default memo(TodaysQuestsCard);
