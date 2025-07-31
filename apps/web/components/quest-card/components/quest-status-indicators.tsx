import React from "react";
import { CheckCircle } from "lucide-react";

export const StatusBadge = () => (
  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium border shadow-glow z-10 bg-gradient-to-r from-green-600/50 to-emerald-500/50 text-white border-green-400/50 flex items-center gap-1 animate-pulse-subtle">
    <CheckCircle className="h-3 w-3" />
    <span>Completed</span>
  </div>
);

export const CompletionIndicator = () => (
  <div className="absolute top-0 right-0 w-full h-1.5 bg-green-500/50 completion-indicator">
    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-green-400/80 to-emerald-500/80 shimmer" />
  </div>
);

export const SuccessOverlay = ({ show }: { show: boolean }) => 
  show ? (
    <div className="absolute inset-0 bg-green-500/10 z-10 rounded-lg success-pulse pointer-events-none" />
  ) : null;