import express from "express";
import { requireAuth } from "../middleware/auth";
import { QuestTemplateController } from "../controllers/quest-template.controller";

const router = express.Router();

// Quest Template Routes
router.get("/questTemplates", requireAuth, QuestTemplateController.getQuestTemplates);
router.post("/questTemplate", requireAuth, QuestTemplateController.createQuestTemplate);
router.patch("/questTemplate/:id", requireAuth, QuestTemplateController.updateQuestTemplate);
router.delete("/questTemplate/:id", requireAuth, QuestTemplateController.deleteQuestTemplate);

export default router;