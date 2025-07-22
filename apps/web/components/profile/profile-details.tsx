"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, MapPin, Shield, Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileDetailsProps {
  session: any;
  userStats: any;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  session,
  userStats,
}) => {
  const profileFields = [
    {
      label: "Email",
      value: session.user?.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Timezone",
      value: userStats?.timezone || "UTC",
      icon: MapPin,
    },
    {
      label: "Member Since",
      value: new Date(session.user?.createdAt || Date.now()).toLocaleDateString(),
      icon: Calendar,
    },
    {
      label: "Account Status",
      value: "Active Adventurer",
      icon: Shield,
      valueColor: "text-green-400",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
    >
      <Card className="bg-black/50 border border-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-medieval text-white">
              Adventurer Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {profileFields.map((field, index) => (
              <motion.div
                key={field.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="space-y-2"
              >
                <label className="text-zinc-400 text-sm font-medium flex items-center gap-2">
                  <field.icon className="h-4 w-4" />
                  {field.label}
                </label>
                <div className="bg-zinc-900/50 px-3 py-2 rounded-md border border-zinc-800/50 hover:border-purple-500/30 transition-colors">
                  <p className={field.valueColor || "text-white"}>
                    {field.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};