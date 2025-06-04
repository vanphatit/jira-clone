import { Request, Response } from "express";
import {
  createWorkspaceSchema,
  inviteMemberSchema,
  updateWorkspaceSchema,
} from "../validators/workspace.validators";

import * as workspaceRepo from "../repositories/workspace.repository";
import * as workspaceService from "../services/workspace.service";
import { Workspace } from "../models/workspace.model";

export const createWorkspaceHandler = async (req: Request, res: Response) => {
  const parsed = createWorkspaceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
  }

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const workspace = await workspaceService.createWorkspace(
      userId,
      parsed.data.name
    );
    return res.status(201).json(workspace);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const getWorkspacesHandler = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const workspaces = await workspaceService.getUserWorkspaces(userId);
    res.json(workspaces);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkspaceMembersHandler = async (
  req: Request,
  res: Response
) => {
  const workspaceId = req.params.workspaceId;

  try {
    const members = await workspaceService.getWorkspaceMembers(workspaceId);
    return res.json(members);
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
};

export const updateWorkspaceHandler = async (req: Request, res: Response) => {
  const parsed = updateWorkspaceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
  }

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const workspaceId = req.params.workspaceId;
  if (!workspaceId)
    return res.status(400).json({ message: "Workspace ID is required" });

  try {
    const updatedWorkspace = await workspaceService.updateWorkspace(
      workspaceId,
      userId,
      parsed.data.name
    );
    if (!updatedWorkspace) {
      return res
        .status(404)
        .json({ message: "Workspace not found or unauthorized" });
    }
    return res.status(200).json(updatedWorkspace);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const inviteMemberHandler = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const workspaceId = req.params.workspaceId;
  if (!workspaceId)
    return res.status(400).json({ message: "Workspace ID is required" });

  const parsed = inviteMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
  }

  try {
    const workspace = await workspaceService.inviteMember(
      workspaceId,
      userId,
      parsed.data.email,
      parsed.data.role
    );
    return res.status(200).json(workspace);
  } catch (err: any) {
    return res.status(400).json({ message: err.message }); // 400 for invalid invite
  }
};

export const acceptInviteHandler = async (req: Request, res: Response) => {
  const { workspaceId, email } = req.query;

  if (!workspaceId || !email) {
    return res.status(400).json({ message: "Missing workspaceId or email" });
  }

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const invite = await workspaceRepo.getInvite(
    workspaceId as string,
    email as string
  );
  if (!invite) {
    return res.status(400).json({ message: "Invite not found or expired" });
  }

  // Update workspace members
  const workspace = await Workspace.findOne({ _id: workspaceId });
  if (!workspace) {
    return res.status(404).json({ message: "Workspace not found" });
  }

  // Check if already a member
  const alreadyMember = workspace.members.some((m) => m.email === email);
  if (!alreadyMember) {
    workspace.members.push({
      userId,
      email,
      role: invite.role,
      status: "JOINED",
    });
    await workspace.save();
  }

  // Delete invite
  await workspaceRepo.deleteInvite(workspaceId as string, email as string);

  return res.status(200).json({ message: "Successfully joined workspace" });
};

export const deleteWorkspaceHandler = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId;
  const userId = req.user?.userId;

  if (!workspaceId)
    return res.status(400).json({ message: "Workspace ID required" });
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    await workspaceService.deleteWorkspace(workspaceId, userId);
    return res.status(204).send(); // No content
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const removeMemberHandler = async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId;
  const userIdToRemove = req.params.userId;
  const currentUserId = req.user?.userId;

  if (!workspaceId || !userIdToRemove) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    await workspaceService.removeMember(
      workspaceId,
      userIdToRemove,
      currentUserId
    );
    return res.status(200).json({ message: "Member removed successfully" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
