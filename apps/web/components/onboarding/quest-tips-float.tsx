"use client";

import { Sparkles } from "lucide-react";

export function QuestTipsFloat() {
  return (
    <div className="fixed top-24 right-6 z-40 w-64 pointer-events-none">
      <div className="bg-amber-500/5 backdrop-blur-sm border border-amber-500/20 rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <h4 className="font-medium text-amber-300 text-sm">
            Quest Tips
          </h4>
        </div>
        <ul className="text-xs text-amber-200/80 space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5 text-xs">•</span>
            <span>Make it specific and achievable</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5 text-xs">•</span>
            <span>Set a realistic deadline</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5 text-xs">•</span>
            <span>Choose appropriate difficulty</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5 text-xs">•</span>
            <span>Think about why it matters</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-400 mt-0.5 text-xs">•</span>
            <span>You can add daily tasks later</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
