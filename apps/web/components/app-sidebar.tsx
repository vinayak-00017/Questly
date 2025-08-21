"use client";
import React from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "./ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconUserBolt,
  IconScript,
  IconSwords,
  IconAdjustmentsAlt,
  IconChartBar,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { useSidebarState } from "@/contexts/sidebar-context";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        <IconScript className="h-5 w-5 shrink-0 text-amber-600/70 hover:text-amber-500/90 transition-colors" />
      ),
    },
    {
      label: "Main Quests",
      href: "/main-quests",
      icon: (
        <IconSwords className="h-5 w-5 shrink-0 text-purple-500/70 hover:text-purple-400/90 transition-colors" />
      ),
    },
    // {
    //   label: "Daily Quests",
    //   href: "#",
    //   icon: (
    //     <IconFlame className="h-5 w-5 shrink-0 text-orange-500/70 hover:text-orange-400/90 transition-colors" />
    //   ),
    // },
    // {
    //   label: "Side Quests",
    //   href: "#",
    //   icon: (
    //     <IconCompass className="h-5 w-5 shrink-0 text-cyan-500/70 hover:text-cyan-400/90 transition-colors" />
    //   ),
    // },
    {
      label: "Performance",
      href: "/performance",
      icon: (
        <IconChartBar className="h-5 w-5 shrink-0 text-green-500/70 hover:text-green-400/90 transition-colors" />
      ),
    },
    {
      label: "Quest Manager",
      href: "/quest-manager",
      icon: (
        <IconAdjustmentsAlt className="h-5 w-5 shrink-0 text-blue-500/70 hover:text-blue-400/90 transition-colors" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-emerald-500/70 hover:text-emerald-400/90 transition-colors" />
      ),
    },
  ];

  return (
    <Sidebar open={open} setOpen={setOpen} animate={true}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          <div className="flex flex-col gap-1">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          {/* Legal Links */}
          <div className="mb-2 space-y-1">
            <SidebarLink
              link={{
                label: "Privacy Policy",
                href: "/privacy-policy",
                icon: (
                  <div className="h-5 w-5 shrink-0 text-slate-400 hover:text-slate-300 flex items-center justify-center transition-colors">
                    <span className="text-xs">🔒</span>
                  </div>
                ),
              }}
            />
            <SidebarLink
              link={{
                label: "Terms of Use",
                href: "/terms-of-use",
                icon: (
                  <div className="h-5 w-5 shrink-0 text-slate-400 hover:text-slate-300 flex items-center justify-center transition-colors">
                    <span className="text-xs">📋</span>
                  </div>
                ),
              }}
            />
          </div>

          {/* <SidebarLink
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
              router.push("#"); // Or any other action you want
            }}
            className={cn(
              "flex w-full items-center text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none",
              open ? "px-3 py-2" : "justify-center p-2"
            )}
          ></button> */}
          <button
            onClick={handleLogout}
            aria-label="Logout"
            title="Logout"
            className={cn(
              "flex w-full items-center text-left rounded-lg transition-all duration-200 group",
              "hover:bg-slate-800/40",
              open ? "px-3 py-2" : "justify-center p-2"
            )}
          >
            <IconArrowLeft className="h-5 w-5 shrink-0 text-slate-400 group-hover:text-red-400 transition-colors" />
            {open && (
              <span className="ml-2 text-slate-300 group-hover:text-red-300 font-medium transition-colors">
                Logout
              </span>
            )}
          </button>

          {/* Logo moved to bottom */}
          <div className="mt-2 pt-2 border-t border-slate-700/50">
            <Logo />
          </div>
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
        "relative z-20 flex items-center py-2 group transition-all duration-200 rounded-lg hover:bg-slate-800/30",
        open ? "justify-start px-2" : "justify-center px-0"
      )}
    >
      <div className="relative">
        <Image
          className={cn(
            "transition-all duration-200 drop-shadow-md",
            open ? "h-10 w-10" : "h-8 w-8"
          )}
          width={50}
          height={50}
          src={"/q_tp.png"}
          alt="questly"
        />
        {/* Subtle glow behind logo */}
        <div className="absolute inset-0 bg-amber-500/15 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      </div>
      {open && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="ml-2.5 font-bold text-lg whitespace-pre bg-gradient-to-r from-amber-500/90 to-orange-500/90 bg-clip-text text-transparent drop-shadow-sm"
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
