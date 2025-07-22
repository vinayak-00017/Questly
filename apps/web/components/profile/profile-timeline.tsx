"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Scroll, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileTimelineProps {
  session: any;
  userStats: any;
}

export const ProfileTimeline: React.FC<ProfileTimelineProps> = ({
  session,
  userStats,
}) => {
  const timelineEvents = [
    {
      event: "Embarked on your quest journey",
      time: "Today",
      icon: Scroll,
    },
    {
      event: "Configured timezone settings",
      time: "Today",
      icon: MapPin,
    },
    {
      event: "Created account",
      time: new Date(
        session.user?.createdAt || Date.now()
      ).toLocaleDateString(),
      icon: User,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Card className="bg-black/50 border border-zinc-800/50 h-full">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-medieval text-white">
              Adventure Timeline
            </h2>
          </div>

          <div className="space-y-4">
            {timelineEvents.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-center gap-4 relative"
              >
                {/* Timeline line */}
                {index < timelineEvents.length - 1 && (
                  <div className="absolute left-4 top-8 w-px h-8 bg-gradient-to-b from-purple-500/50 to-transparent"></div>
                )}
                
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600/50 to-blue-600/50 flex items-center justify-center border border-purple-500/30 relative z-10">
                  <item.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{item.event}</p>
                  <p className="text-zinc-500 text-xs">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};