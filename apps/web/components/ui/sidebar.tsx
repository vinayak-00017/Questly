"use client";
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useSidebarState } from "@/contexts/sidebar-context";
import { usePathname } from "next/navigation";

export interface Links {
  label: string;
  href: string;
  icon: React.ReactElement;
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-[calc(100vh-4rem)] fixed left-0 top-16 px-5 py-6 hidden md:flex md:flex-col z-30 border-r overflow-y-auto overflow-x-hidden",
          "bg-gradient-to-b from-[#141625] to-[#0a0b15] backdrop-blur-md border-slate-700/50",
          "shadow-2xl shadow-black/20",
          className
        )}
        animate={{
          width: animate ? (open ? "240px" : "70px") : "240px",
        }}
        initial={{
          width: "70px",
        }}
        transition={{
          width: {
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          },
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-5 flex flex-row md:hidden items-center justify-between w-full fixed top-0 left-0 z-20 border-b",
          "bg-gradient-to-r from-[#141625] to-[#0a0b15] backdrop-blur-md border-slate-700/50"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-slate-300 hover:text-amber-400 w-5 h-5 transition-colors"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className={cn(
                "fixed h-full w-full inset-0 p-6 z-[100] flex flex-col justify-between",
                "bg-gradient-to-br from-[#141625] to-[#0a0b15] backdrop-blur-md",
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-slate-300 hover:text-red-400 rounded-full p-2 hover:bg-slate-800/50 transition-all duration-200"
                onClick={() => setOpen(!open)}
              >
                <IconX className="w-5 h-5" />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
}) => {
  const { open, animate } = useSidebar();
  const { open: globalOpen } = useSidebarState();
  const pathname = usePathname();

  // Check if the current path matches this link's path
  const isActive =
    pathname === link.href ||
    (link.href !== "/" && pathname.startsWith(link.href));

  // Use the global sidebar state for determining UI appearance
  const isOpen = globalOpen !== undefined ? globalOpen : open;

  return (
    <Link
      href={link.href}
      className={cn(
        "flex items-center py-3 px-3 rounded-xl transition-all duration-200 group/sidebar relative overflow-hidden",
        isOpen ? "justify-start gap-3" : "justify-center",
        isActive
          ? "bg-gradient-to-r from-amber-600/15 to-orange-600/15 border border-amber-500/20 text-amber-300/90 shadow-md ring-1 ring-amber-500/30 shadow-amber-500/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent hover:border-slate-600/20",
        // Enhanced collapsed mode styling
        !isOpen &&
          isActive &&
          "bg-gradient-to-b from-amber-600/20 to-orange-600/20 shadow-lg shadow-amber-600/20 border-amber-500/30 ring-2 ring-amber-500/40",
        !isOpen &&
          !isActive &&
          "hover:shadow-md hover:shadow-slate-900/20 hover:scale-105",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "flex items-center justify-center flex-shrink-0",
          isOpen ? "w-5 h-5" : "w-5 h-5"
        )}
      >
        {React.isValidElement(link.icon) &&
          React.cloneElement(link.icon as React.ReactElement<any>, {
            className: cn(
              (link.icon.props as any).className || "",
              isActive && "text-amber-400/90 drop-shadow-md",
              !isActive &&
                "group-hover/sidebar:scale-110 transition-transform duration-200",
              // Enhanced collapsed mode icon styling
              !isOpen && isActive && "drop-shadow-lg scale-110",
              !isOpen && !isActive && "group-hover/sidebar:scale-125"
            ),
          })}
      </div>

      <motion.span
        animate={{
          display: animate
            ? isOpen
              ? "inline-block"
              : "none"
            : "inline-block",
          opacity: animate ? (isOpen ? 1 : 0) : 1,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "text-sm group-hover/sidebar:translate-x-0.5 transition-all duration-200 whitespace-pre inline-block",
          isActive
            ? "font-semibold text-amber-200/90"
            : "font-medium text-slate-400 group-hover/sidebar:text-slate-200"
        )}
      >
        {link.label}
      </motion.span>

      {/* Enhanced glow effect for active items */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/8 to-orange-600/8 rounded-xl opacity-70 shadow-inner shadow-amber-500/10" />
      )}
    </Link>
  );
};
