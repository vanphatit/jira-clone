import express from "express";
import { 
  acceptInviteHandler,
  createProjectHandler, 
  deleteProjectHandler, 
  getProjectMembersHandler, 
  getProjectsByWorkspaceHandler, 
  inviteMemberHandler, 
  removeMemberHandler, 
  updateProjectHandler
} from "../../controllers/project.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createProjectHandler);
router.get("/workspace/:workspaceId", requireAuth, getProjectsByWorkspaceHandler);
router.get("/:projectId/members", requireAuth, getProjectMembersHandler);
router.put("/:projectId", requireAuth, updateProjectHandler);
router.post("/:projectId/invite", requireAuth, inviteMemberHandler);
router.post("/accept", requireAuth, acceptInviteHandler);
router.delete("/:projectId", requireAuth, deleteProjectHandler);
router.delete("/:projectId/members/:userId", requireAuth, removeMemberHandler);

export default router;