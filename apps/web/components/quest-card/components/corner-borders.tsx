import React from "react";
import { cn } from "@/lib/utils";

interface CornerBordersProps {
  isCompleted: boolean;
  colorStyles: any;
}

const CornerBorders = ({ isCompleted, colorStyles }: CornerBordersProps) => {
  const borderColor = isCompleted
    ? "border-[#2ecc71]/50"
    : colorStyles.cornerBorder;

  return (
    <>
      <div
        className={cn(
          "absolute top-0 left-0 w-3 h-3 border-t border-l rounded-tl-lg",
          borderColor
        )}
      />
      <div
        className={cn(
          "absolute top-0 right-0 w-3 h-3 border-t border-r rounded-tr-lg",
          borderColor
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 left-0 w-3 h-3 border-b border-l rounded-bl-lg",
          borderColor
        )}
      />
      <div
        className={cn(
          "absolute bottom-0 right-0 w-3 h-3 border-b border-r rounded-br-lg",
          borderColor
        )}
      />
    </>
  );
};

export default CornerBorders;
