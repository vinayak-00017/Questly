"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconNews,
  IconSword,
  IconScript,
  IconSwords,
  IconFlame,
  IconCompass,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useSidebarState } from "@/contexts/sidebar-context";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function AppSidebar() {
  const { open, setOpen } = useSidebarState();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const links = [
    {
      label: "Home Base",
      href: "/",
      icon: (
        <IconScript className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
      ),
    },
    {
      label: "Main Quests",
      href: "/main-quests",
      icon: (
        <IconSwords className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
      ),
    },
    {
      label: "Daily Quests",
      href: "/daily-quests",
      icon: (
        <IconFlame className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
      ),
    },
    {
      label: "Side Quests",
      href: "/side-quests",
      icon: (
        <IconCompass className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <>
            <Logo />
          </>
          <div className="mt-6 flex flex-col gap-1">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Settings",
              href: "#",
              icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
              ),
            }}
          />
          <button
            onClick={() => {
              // Handle account button click
              router.push("/account"); // Or any other action you want
            }}
            className={cn(
              "flex w-full items-center text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none",
              open ? "px-3 py-2" : "justify-center p-2"
            )}
          >
            <img
              src="https://static.thenounproject.com/png/2059357-200.png"
              className="h-5 w-5 rounded-full object-cover flex-shrink-0"
              alt="Avatar"
            />
            {open && (
              <span className="ml-2 text-neutral-700 dark:text-neutral-200">
                Account
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none",
              open ? "px-3 py-2" : "justify-center p-2"
            )}
          >
            <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-600 dark:text-neutral-300" />
            {open && (
              <span className="ml-2 text-neutral-700 dark:text-neutral-200">
                Logout
              </span>
            )}
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}
export const Logo = () => {
  const { open } = useSidebarState();
  return (
    <a
      href="#"
      className={cn(
        "relative z-20 flex items-center py-2",
        open ? "justify-start px-2" : "justify-center px-0"
      )}
    >
      <div
        className={cn(
          "flex-shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm",
          open ? "h-6 w-6" : "h-8 w-8"
        )}
      />
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-2.5 font-semibold text-base whitespace-pre text-neutral-700 dark:text-white"
        >
          Questly
        </motion.span>
      )}
    </a>
  );
};
export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
