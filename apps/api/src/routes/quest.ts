import express from "express";

import taskInstanceRouter from "./task-instance";
import taskTemplateRouter from "./task-template";
import questTemplateRoutes from "./quest-templates";
import questInstanceRoutes from "./quest-instances";

const router = express.Router();

// Mount sub-routers
router.use("/", questTemplateRoutes);
router.use("/", questInstanceRoutes);

// Task-related routes (keeping existing structure)
router.use(
  "/quest-instance/:questInstanceId/task-instance",
  taskInstanceRouter
);
router.use(
  "/quest-template/:questTemplateId/task-template",
  taskTemplateRouter
);

export default router;
