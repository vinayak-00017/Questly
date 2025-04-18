"use client";

import { AppSidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";

import React, { useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "fixed inset-0 flex bg-white dark:bg-neutral-900",
        "transition-all duration-300 ease-in-out",
        open ? "md:pl-[240px]" : "md:pl-[70px]"
      )}
      style={{
        transitionProperty: "padding-left",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <AppSidebar open={open} setOpen={setOpen} />
      <main className="flex-1 overflow-auto w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
