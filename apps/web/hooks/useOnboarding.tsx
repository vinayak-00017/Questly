"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/services/user-api";
import { toast } from "sonner";

interface OnboardingContextType {
  needsOnboarding: boolean;
  currentStep: number;
  isOnboardingComplete: boolean;
  hasCreatedFirstQuest: boolean;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  updateOnboardingStep: (step: number) => void;
  completeOnboarding: () => void;
  markFirstQuestCreated: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | null>(null);

interface OnboardingProviderProps {
  children: ReactNode;
}

export function OnboardingProvider({ children }: OnboardingProviderProps) {
  const { data: session } = useSession();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const queryClient = useQueryClient();

  const { data: userStats } = useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getUserStats,
    enabled: !!session?.user,
    select: (data) => data.userStats,
  });

  const needsOnboarding = Boolean(
    session?.user &&
      !userStats?.hasCompletedOnboarding &&
      userStats?.onboardingStep !== undefined
  );

  const updateOnboardingMutation = useMutation({
    mutationFn: async (data: {
      step?: number;
      completed?: boolean;
      hasCreatedFirstQuest?: boolean;
    }) => {
      return userApi.updateOnboarding(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
    },
    onError: () => {
      toast.error("Failed to update onboarding progress");
    },
  });

  // Check if user needs onboarding when they first load the app
  useEffect(() => {
    if (needsOnboarding && !showOnboarding) {
      // Small delay to ensure the page is loaded
      const timer = setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [needsOnboarding, showOnboarding]);

  const updateOnboardingStep = (step: number) => {
    updateOnboardingMutation.mutate({ step });
  };

  const completeOnboarding = () => {
    updateOnboardingMutation.mutate({ completed: true });
    setShowOnboarding(false);
    toast.success("🎉 Welcome aboard, adventurer!", {
      description: "Your quest management journey begins now!",
    });
  };

  const markFirstQuestCreated = () => {
    updateOnboardingMutation.mutate({ hasCreatedFirstQuest: true });
  };

  const contextValue: OnboardingContextType = {
    needsOnboarding,
    currentStep: userStats?.onboardingStep || 0,
    isOnboardingComplete: userStats?.hasCompletedOnboarding || false,
    hasCreatedFirstQuest: userStats?.hasCreatedFirstQuest || false,
    showOnboarding,
    setShowOnboarding,
    updateOnboardingStep,
    completeOnboarding,
    markFirstQuestCreated,
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error("useOnboarding must be used within OnboardingProvider");
  }
  return context;
}
