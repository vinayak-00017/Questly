import express from "express";
import { requireAuth } from "../middleware/auth";
import { TrackedQuestController } from "../controllers/tracked-quest.controller";

const router = express.Router();

// Get user's tracked quests
router.get("/", requireAuth, TrackedQuestController.getTrackedQuests);

// Add a quest to tracking
router.post("/", requireAuth, TrackedQuestController.addTrackedQuest);

// Remove a quest from tracking
router.delete("/:id", requireAuth, TrackedQuestController.removeTrackedQuest);

// Update tracked quest
router.patch("/:id", requireAuth, TrackedQuestController.updateTrackedQuest);

export default router;
