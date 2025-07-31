import React from "react";
import { cn } from "@/lib/utils";

interface CornerBordersProps {
  isCompleted: boolean;
  colorStyles: any;
}

const CornerBorders = ({ 
  isCompleted, 
  colorStyles 
}: CornerBordersProps) => {
  const borderColor = isCompleted ? "border-green-500/50" : colorStyles.cornerBorder;
  
  return (
    <>
      <div className={cn("absolute top-0 left-0 w-3 h-3 border-t border-l", borderColor)} />
      <div className={cn("absolute top-0 right-0 w-3 h-3 border-t border-r", borderColor)} />
      <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b border-l", borderColor)} />
      <div className={cn("absolute bottom-0 right-0 w-3 h-3 border-b border-r", borderColor)} />
    </>
  );
};

export default CornerBorders;