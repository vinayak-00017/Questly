import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { QuestInstance } from "@questly/types";
import { taskApi } from "@/services/task-api";

export const useQuestState = (
  quest: QuestInstance,
  globalCollapseState?: "collapsed" | "expanded" | null
) => {
  const [expandedQuestId, setExpandedQuestId] = useState<string | null>(null);
  const [isQuestCompleted, setIsQuestCompleted] = useState(quest.completed);
  const [completionAnimation, setCompletionAnimation] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const previousCompletedRef = useRef(quest.completed);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check if quest has tasks
  const { data: taskData } = useQuery({
    queryKey: ["taskInstances", quest.instanceId],
    queryFn: () => taskApi.fetchTasks({ questInstanceId: quest.instanceId }),
    enabled: !!quest.instanceId,
  });

  const hasTasks = taskData?.taskInstances?.length > 0;

  // Track completion state changes for animations
  useEffect(() => {
    const wasCompleted = previousCompletedRef.current;
    const isNowCompleted = quest.completed;
    
    // Clear any existing timeout first
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
    
    // If quest just got completed (false -> true), trigger animation
    if (!wasCompleted && isNowCompleted) {
      setCompletionAnimation(true);
      
      // Set new timeout
      animationTimeoutRef.current = setTimeout(() => {
        setCompletionAnimation(false);
        animationTimeoutRef.current = null;
      }, 2000);
    } else {
      // If quest was marked incomplete or any other state change, clear animation immediately
      setCompletionAnimation(false);
    }
    
    // Update refs and state
    previousCompletedRef.current = isNowCompleted;
    setIsQuestCompleted(isNowCompleted);
  }, [quest.completed]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Handle global collapse/expand state
  useEffect(() => {
    if (globalCollapseState === "collapsed") {
      setIsCollapsed(true);
    } else if (globalCollapseState === "expanded") {
      setIsCollapsed(false);
    }
  }, [globalCollapseState]);

  // Event handlers
  const toggleExpand = (questId: string) => {
    setExpandedQuestId(expandedQuestId === questId ? null : questId);
  };

  const handleEditClick = () => {
    setIsEditDialogOpen(true);
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return {
    // State
    expandedQuestId,
    setExpandedQuestId,
    isQuestCompleted,
    setIsQuestCompleted,
    completionAnimation,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isCollapsed,
    hasTasks,
    taskData,
    
    // Handlers
    toggleExpand,
    handleEditClick,
    toggleCollapsed,
  };
};