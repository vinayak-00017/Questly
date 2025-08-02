"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sword,
  Target,
  MapPin,
  Calendar,
  Trophy,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Crown,
  Sparkles,
  Flame,
  Compass,
  SwordsIcon,
} from "lucide-react";
import { useOnboarding } from "@/hooks/useOnboarding";
import { useSession } from "@/lib/auth-client";
import { AddMainQuestOnboarding } from "./add-main-quest-onboarding";
import Image from "next/image";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export function OnboardingWizard() {
  const { data: session } = useSession();
  const {
    showOnboarding,
    setShowOnboarding,
    currentStep,
    updateOnboardingStep,
    completeOnboarding,
    hasCreatedFirstQuest,
  } = useOnboarding();

  const [localStep, setLocalStep] = useState(currentStep);

  // Create steps with dynamic user name
  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Welcome to Your Quest Journey",
      description: "Let's get you started on your adventure!",
      icon: Crown,
      content: (
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-purple-600/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-amber-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  width={80}
                  height={80}
                  alt={
                    session.user?.name
                      ? `${session.user.name}'s profile picture`
                      : "Profile"
                  }
                  className="rounded-full h-full w-full object-cover"
                />
              ) : (
                <Crown className="h-8 w-8 text-white" />
              )}
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Welcome, {session?.user?.name || "Noble Adventurer"}!
          </h3>
          <p className="text-zinc-400 leading-relaxed">
            Questly is your personal gamified life management system. Transform
            your goals into epic adventures, track your progress, and level up
            your productivity like never before!
          </p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Target className="h-4 w-4 text-amber-500" />
              <span>Goal Tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Trophy className="h-4 w-4 text-purple-500" />
              <span>Level Up System</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Calendar className="h-4 w-4 text-blue-500" />
              <span>Daily Quests</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-zinc-300">
              <Sparkles className="h-4 w-4 text-pink-500" />
              <span>Achievement System</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Understanding the Quest System",
      description: "Learn how to organize your adventures",
      icon: Sword,
      content: (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <Target className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Quest Types</h3>
          </div>

          <div className="space-y-4">
            <div className="border border-purple-500/20 rounded-lg p-4 bg-purple-500/5">
              <div className="flex items-center gap-3 mb-2">
                <SwordsIcon className="h-5 w-5 text-purple-500" />
                <h4 className="font-semibold text-purple-300">Main Quests</h4>
              </div>
              <p className="text-sm text-zinc-400">
                Your major goals and projects. These are the big adventures that
                define your journey.
              </p>
            </div>

            <div className="border border-amber-500/20 rounded-lg p-4 bg-amber-500/5">
              <div className="flex items-center gap-3 mb-2">
                <Flame className="h-5 w-5 text-amber-500" />
                <h4 className="font-semibold text-amber-300">Daily Quests</h4>
              </div>
              <p className="text-sm text-zinc-400">
                Recurring tasks that help you build habits and make progress on
                your main quests.
              </p>
            </div>

            <div className="border border-blue-500/20 rounded-lg p-4 bg-blue-500/5">
              <div className="flex items-center gap-3 mb-2">
                <Compass className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-blue-300">Side Quests</h4>
              </div>
              <p className="text-sm text-zinc-400">
                Custom scheduled tasks and smaller goals that support your main
                adventure.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: "Create Your First Quest",
      description: "Start your adventure with a main quest",
      icon: SwordsIcon,
      content: <AddMainQuestOnboarding />,
    },
  ];

  const currentStepData =
    steps.find((step) => step.id === localStep) || steps[0];
  const isLastStep = localStep === steps.length - 1;

  const handleNext = () => {
    if (localStep === 2 && !hasCreatedFirstQuest) {
      // User needs to create a quest before proceeding
      return;
    }

    if (isLastStep) {
      completeOnboarding();
    } else {
      const nextStep = localStep + 1;
      setLocalStep(nextStep);
      updateOnboardingStep(nextStep);
    }
  };

  const handlePrevious = () => {
    if (localStep > 0) {
      const prevStep = localStep - 1;
      setLocalStep(prevStep);
      updateOnboardingStep(prevStep);
    }
  };

  const handleSkip = () => {
    setShowOnboarding(false);
  };

  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={showOnboarding} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Onboarding Wizard - {currentStepData.title}
          </DialogTitle>
        </DialogHeader>
        <div className="relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-600/10 to-amber-500/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-600/10 to-pink-500/10 rounded-full blur-xl"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-600/50">
                  <IconComponent className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {currentStepData.title}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {currentStepData.description}
                  </p>
                </div>
              </div>

              {/* Step indicator */}
              <div className="flex items-center gap-2">
                {steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index <= localStep ? "bg-amber-500" : "bg-slate-600"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={localStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[300px] flex items-center"
              >
                {currentStepData.content}
              </motion.div>
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-slate-400 hover:text-white"
                >
                  Skip for now
                </Button>

                {localStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    className="border-slate-600 text-slate-300 hover:bg-slate-800"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={localStep === 2 && !hasCreatedFirstQuest}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white"
              >
                {isLastStep ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    {localStep === 2 && !hasCreatedFirstQuest
                      ? "Create Quest First"
                      : "Next"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
