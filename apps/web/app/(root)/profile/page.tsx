"use client";

import React from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import {
  ProfileHeader,
  ProfileStats,
  ProfileAchievements,
  ProfileTimeline,
  ProfileDetails,
  ProfileBackground,
  ProfileLoading,
  ProfileError,
} from "@/components/profile";

const ProfilePage = () => {
  const { data: session, isPending } = useSession();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    select: (data) => {
      return {
        userStats: data.userStats,
      };
    },
    enabled: !!session,
  });

  const { userStats } = data || { userStats: { levelStats: {}, todaysXp: 0 } };

  // Loading state
  if (isPending || isLoading) {
    return <ProfileLoading />;
  }

  // Unauthorized state
  if (!session) {
    return <ProfileError type="unauthorized" />;
  }

  // Error state
  if (error) {
    return <ProfileError type="error" onRetry={() => refetch()} />;
  }

  return (
    <div className="min-h-screen relative">
      <ProfileBackground />
      
      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <ProfileHeader
            session={session}
            userStats={userStats}
            onProfileUpdate={() => refetch()}
          />

          {/* Stats Grid */}
          <ProfileStats userStats={userStats} />

          {/* Achievements and Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <ProfileAchievements userStats={userStats} />
            <ProfileTimeline session={session} userStats={userStats} />
          </div>

          {/* Profile Details */}
          <ProfileDetails session={session} userStats={userStats} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;