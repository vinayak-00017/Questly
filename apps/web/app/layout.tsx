import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  EB_Garamond,
  MedievalSharp,
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/query-provider";
import PullToRefresh from "@/components/pull-to-refresh";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { AnonymousLoginProvider } from "@/components/anonymous-login-provider";
import { AchievementProvider } from "@/contexts/achievement-context";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const medievalSharp = MedievalSharp({
  variable: "--font-medieval",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: "normal",
  fallback: ["cursive"],
});

export const metadata: Metadata = {
  title: "Questly",
  description: "Gamify your goals. Turn your life into an epic quest.",
  openGraph: {
    title: "Questly – Gamify Your Life",
    description:
      "Turn your goals into quests, earn XP, and level up your real life with Questly!",
    url: "https://questly.me",
    siteName: "Questly",
    images: [
      {
        url: "https://questly.me/favicon.ico",
        width: 1200,
        height: 630,
        alt: "Questly – Gamify Your Life",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Questly – Gamify Your Life",
    description:
      "Turn your goals into quests, earn XP, and level up your real life with Questly!",
    images: ["https://questly.me/favicon.ico"],
  },
};

//component
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${ebGaramond.variable} font-garamond antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <AnonymousLoginProvider>
              <AchievementProvider>
                <SidebarProvider>
                  <PullToRefresh />
                  {children}
                  <Toaster />
                </SidebarProvider>
              </AchievementProvider>
            </AnonymousLoginProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}