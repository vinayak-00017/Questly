"use client";

import React, { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  icon: ReactNode;
  label: string;
  showPassword?: boolean;
  setShowPassword?: (show: boolean) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  required = false,
  icon,
  label,
  showPassword,
  setShowPassword,
}) => {
  const isPasswordField =
    type === "password" || (type === "text" && setShowPassword);

  return (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium gap-2 text-zinc-100/90">
        {icon}
        <span>{label}</span>
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <Input
          type={type}
          value={value}
          onChange={onChange}
          className="bg-black/40 border-zinc-800 pl-10 pr-10 text-white focus-visible:ring-purple-500/30 focus-visible:border-purple-600/50"
          placeholder={placeholder}
          required={required}
        />

        {isPasswordField && setShowPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-purple-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
