import express from "express";
import { requireAuth } from "../middleware/auth";
import { QuestInstanceController } from "../controllers/quest-instance.controller";

const router = express.Router();

// Quest Instance Routes
router.get("/dailyQuestInstance", requireAuth, QuestInstanceController.getDailyQuestInstances);
router.get("/sideQuestInstance", requireAuth, QuestInstanceController.getSideQuestInstances);
router.get("/todaysQuests", requireAuth, QuestInstanceController.getTodaysQuests);
router.get("/activity", requireAuth, QuestInstanceController.getQuestActivity);

router.patch("/completeQuest", requireAuth, QuestInstanceController.completeQuest);
router.patch("/questInstance/:instanceId", requireAuth, QuestInstanceController.updateQuestInstance);
router.delete("/questInstance/:instanceId", requireAuth, QuestInstanceController.deleteQuestInstance);

export default router;