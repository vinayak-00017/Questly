import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown } from "lucide-react";

interface EditProfileNameFieldProps {
  name: string;
  onChange: (value: string) => void;
}

export const EditProfileNameField: React.FC<EditProfileNameFieldProps> = ({
  name,
  onChange,
}) => (
  <div className="space-y-2">
    <Label htmlFor="name" className="text-zinc-300 font-medium">
      Adventurer Name
    </Label>
    <div className="relative">
      <Crown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
      <Input
        id="name"
        value={name}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 bg-zinc-900/50 border-zinc-700/50 text-white placeholder-zinc-500 focus:border-purple-500/50 focus:ring-purple-500/20"
        placeholder="Enter your adventurer name"
      />
    </div>
    <p className="text-xs text-zinc-500">
      Choose a name that represents your adventuring spirit
    </p>
  </div>
);
