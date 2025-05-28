import express from "express";
import { createWorkspaceHandler, getWorkspacesHandler } from "../../controllers/workspace.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", requireAuth, getWorkspacesHandler);
router.post("/", requireAuth, createWorkspaceHandler);

export default router;
