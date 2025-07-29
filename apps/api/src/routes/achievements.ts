import express from "express";
import { achievementService } from "../services/achievement.service";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";

const router = express.Router();

// Get all achievements for the current user
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const achievements = await achievementService.getUserAchievements(userId);
    
    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("Error fetching achievements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch achievements",
    });
  }
});

// Get achievements by category
router.get("/category/:category", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const { category } = req.params;
    
    if (!category || category.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Category parameter is required",
      });
    }
    
    const achievements = await achievementService.getAchievementsByCategory(userId, category);
    
    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("Error fetching achievements by category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch achievements by category",
    });
  }
});

// Get recent achievements
router.get("/recent", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const limitParam = req.query.limit as string;
    const limit = limitParam ? parseInt(limitParam) : 5;
    
    if (isNaN(limit) || limit < 1) {
      return res.status(400).json({
        success: false,
        error: "Limit must be a positive number",
      });
    }
    
    const achievements = await achievementService.getRecentAchievements(userId, limit);
    
    res.json({
      success: true,
      data: achievements,
    });
  } catch (error) {
    console.error("Error fetching recent achievements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch recent achievements",
    });
  }
});

// Get achievement statistics
router.get("/stats", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const stats = await achievementService.getAchievementStats(userId);
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching achievement stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch achievement stats",
    });
  }
});

// Get user progress
router.get("/progress", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const progress = await achievementService.getUserProgress(userId);
    
    res.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch user progress",
    });
  }
});

// Check and unlock new achievements
router.post("/check", requireAuth, async (req, res) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const newAchievements = await achievementService.checkAndUnlockAchievements(userId);
    
    res.json({
      success: true,
      data: {
        newAchievements,
        count: newAchievements.length,
      },
    });
  } catch (error) {
    console.error("Error checking achievements:", error);
    res.status(500).json({
      success: false,
      error: "Failed to check achievements",
    });
  }
});

export default router;