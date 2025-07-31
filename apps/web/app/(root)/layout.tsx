"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { cn } from "@/lib/utils";
import { useSidebarState } from "@/contexts/sidebar-context";
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import AppTopbar from "@/components/app-topbar";
import AppRightSidebar from "@/components/app-right-sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { open } = useSidebarState();

  return (
    <div className="fixed inset-0 flex flex-col bg-white dark:bg-neutral-900">
      <AppTopbar />
      <AppSidebar />
      <div
        className={cn(
          "flex-1 overflow-auto w-full h-full pt-16",
          "transition-all duration-300 ease-in-out",
          open ? "md:pl-[240px]" : "md:pl-[70px]",
          "md:pr-[280px]"
        )}
        style={{
          transitionProperty: "padding-left",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <main className="w-full h-full">{children}</main>
      </div>
      <AppRightSidebar />
      <Toaster />
    </div>
  );
};

export default Layout;
