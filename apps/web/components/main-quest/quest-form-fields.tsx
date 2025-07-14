import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "../date-freq/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MainQuestImportance,
  MainQuestDifficulty,
  MainQuestCategory,
} from "@questly/types";
import { Scroll, CalendarDays, Trophy, Shield, Target } from "lucide-react";

interface QuestFormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  importance: MainQuestImportance;
  setImportance: (value: MainQuestImportance) => void;
  difficulty: MainQuestDifficulty;
  setDifficulty: (value: MainQuestDifficulty) => void;
  category: MainQuestCategory;
  setCategory: (value: MainQuestCategory) => void;
  dueDate?: Date;
  setDueDate: (value?: Date) => void;
}

export function QuestFormFields({
  title,
  setTitle,
  description,
  setDescription,
  importance,
  setImportance,
  difficulty,
  setDifficulty,
  category,
  setCategory,
  dueDate,
  setDueDate,
}: QuestFormFieldsProps) {
  const { Legendary, Heroic, Rare, Common } = MainQuestImportance;
  const { Novice, Adventurer, Veteran, Master } = MainQuestDifficulty;
  const { Challenge, Combat, Knowledge, Creation, Exploration, Social } =
    MainQuestCategory;

  return (
    <>
      <div className="space-y-2">
        <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Scroll className="h-3.5 w-3.5" />
          Quest Title
        </label>
        <Input
          placeholder="Enter quest title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 focus:border-purple-500"
        />
      </div>

      <div className="flex justify-between gap-4">
        <div className="space-y-2 w-[48%]">
          <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5" />
            Due Date
          </label>
          <DatePicker
            date={dueDate}
            onSelect={setDueDate}
            className="bg-black/50 border-zinc-700"
          />
        </div>
        <div className="space-y-2 w-[48%]">
          <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
            <Trophy className="h-3.5 w-3.5" />
            Importance
          </label>
          <Select
            value={importance}
            onValueChange={(value) =>
              setImportance(value as MainQuestImportance)
            }
          >
            <SelectTrigger className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem
                value={Common}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Common
              </SelectItem>
              <SelectItem
                value={Rare}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Rare
              </SelectItem>
              <SelectItem
                value={Heroic}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Heroic
              </SelectItem>
              <SelectItem
                value={Legendary}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Legendary
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="space-y-2 w-[48%]">
          <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
            <Shield className="h-3.5 w-3.5" />
            Difficulty
          </label>
          <Select
            value={difficulty}
            onValueChange={(value) =>
              setDifficulty(value as MainQuestDifficulty)
            }
          >
            <SelectTrigger className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem
                value={Novice}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Novice
              </SelectItem>
              <SelectItem
                value={Adventurer}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Adventurer
              </SelectItem>
              <SelectItem
                value={Veteran}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Veteran
              </SelectItem>
              <SelectItem
                value={Master}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Master
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 w-[48%]">
          <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
            <Target className="h-3.5 w-3.5" />
            Category
          </label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as MainQuestCategory)}
          >
            <SelectTrigger className="bg-black/50 border-zinc-700 text-white hover:bg-black/70 focus:border-purple-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem
                value={Challenge}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Challenge
              </SelectItem>
              <SelectItem
                value={Combat}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Combat
              </SelectItem>
              <SelectItem
                value={Creation}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Creation
              </SelectItem>
              <SelectItem
                value={Exploration}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Exploration
              </SelectItem>
              <SelectItem
                value={Knowledge}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Knowledge
              </SelectItem>
              <SelectItem
                value={Social}
                className="focus:bg-purple-900/20 focus:text-purple-400"
              >
                Social
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-purple-400 flex items-center gap-2">
          <Scroll className="h-3.5 w-3.5" />
          Quest Description
        </label>
        <Textarea
          placeholder="Enter quest description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-black/50 border-zinc-700 focus:border-purple-500 text-white min-h-[100px] hover:bg-black/70"
        />
      </div>
    </>
  );
}
