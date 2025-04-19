"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  // Initialize with null to avoid hydration mismatch
  const [open, setOpen] = useState<boolean | null>(null);

  // Load the initial state from localStorage when the component mounts
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    // Set the initial state to true (or whatever was saved previously)
    setOpen(savedState === "false" ? false : true);
  }, []);

  // Save the state to localStorage whenever it changes
  useEffect(() => {
    if (open !== null) {
      localStorage.setItem("sidebarOpen", String(open));
    }
  }, [open]);

  return (
    <SidebarContext.Provider
      value={{
        open: open === null ? true : open, // Default to true if not loaded yet
        setOpen: setOpen as React.Dispatch<React.SetStateAction<boolean>>,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarState = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarState must be used within a SidebarProvider");
  }
  return context;
};
