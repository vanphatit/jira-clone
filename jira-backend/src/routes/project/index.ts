import express from "express";
import { createProjectHandler, getProjectsByWorkspaceHandler } from "../../controllers/project.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createProjectHandler);
router.get(
  "/workspace/:workspaceId",
  requireAuth,
  getProjectsByWorkspaceHandler
);

export default router;
