import React from "react";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TIMEZONES } from "@questly/utils";

interface EditProfileTimezoneFieldProps {
  timezone: string;
  onChange: (value: string) => void;
}

export const EditProfileTimezoneField: React.FC<
  EditProfileTimezoneFieldProps
> = ({ timezone, onChange }) => (
  <div className="space-y-2">
    <Label htmlFor="timezone" className="text-zinc-300 font-medium">
      Timezone
    </Label>
    <div className="relative">
      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 z-10" />
      <Select value={timezone} onValueChange={onChange}>
        <SelectTrigger className="pl-10 bg-zinc-900/50 border-zinc-700/50 text-white focus:border-purple-500/50 focus:ring-purple-500/20">
          <SelectValue placeholder="Select your timezone" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-900 border-zinc-700">
          {TIMEZONES.map((tz) => (
            <SelectItem
              key={tz.value}
              value={tz.value}
              className="text-white hover:bg-zinc-800 focus:bg-zinc-800"
            >
              {tz.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    <p className="text-xs text-zinc-500">
      This affects your quest daily generation and xp calculation
    </p>
  </div>
);
