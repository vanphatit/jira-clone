import express from "express";
import { createProjectHandler, deleteProjectHandler, getProjectsByWorkspaceHandler, updateProjectHandler } from "../../controllers/project.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createProjectHandler);
router.get(
  "/workspace/:workspaceId",
  requireAuth,
  getProjectsByWorkspaceHandler
);
router.put("/:projectId", requireAuth, updateProjectHandler);
router.delete("/:projectId", requireAuth, deleteProjectHandler);

export default router;