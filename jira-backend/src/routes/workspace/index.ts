import { Router } from "express";
import {
    acceptInviteHandler,
    createWorkspaceHandler,
    getWorkspacesHandler,
    inviteMemberHandler,
    updateWorkspaceHandler,
} from "../../controllers/workspace.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", requireAuth, createWorkspaceHandler);
router.get("/", requireAuth, getWorkspacesHandler);
router.put("/:workspaceId", requireAuth, updateWorkspaceHandler);
router.post("/:workspaceId/invite", requireAuth, inviteMemberHandler);
router.post("/accept", requireAuth, acceptInviteHandler);

export default router;
