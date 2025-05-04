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
          "h-screen fixed left-0 top-0 px-5 py-6 hidden md:flex md:flex-col bg-white dark:bg-neutral-900 z-30 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto overflow-x-hidden",
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
          "h-14 px-5 flex flex-row md:hidden items-center justify-between bg-white dark:bg-neutral-900 w-full fixed top-0 left-0 z-20 border-b border-neutral-200 dark:border-neutral-800"
        )}
        {...props}
      >
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-700 dark:text-neutral-300 w-5 h-5"
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
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-6 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-6 top-6 z-50 text-neutral-700 dark:text-neutral-300 rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
        "flex items-center py-3 px-2 rounded-md transition-colors group/sidebar border",
        isOpen ? "justify-start gap-3" : "justify-center",
        isActive
          ? "bg-neutral-100 dark:bg-neutral-800/60 border-neutral-300/50 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200"
          : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-transparent",
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
              isActive && "text-neutral-800 dark:text-neutral-200"
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
          "text-sm group-hover/sidebar:translate-x-0.5 transition duration-150 whitespace-pre inline-block",
          isActive ? "font-medium" : "font-normal"
        )}
      >
        {link.label}
      </motion.span>

      {/* Active indicator dot in collapsed state */}
      {isActive && !isOpen && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-neutral-300 dark:bg-neutral-600 rounded-l-md"></div>
      )}
    </Link>
  );
};
