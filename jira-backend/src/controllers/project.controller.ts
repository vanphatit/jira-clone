import { Request, Response } from "express";
import {
  createProjectSchema,
  inviteMemberSchema,
  updateProjectSchema,
} from "../validators/project.validators";
import * as projectService from "../services/project.service";
import { deleteInvite, getInvite } from "../repositories/project.repository";
import { Project } from "../models/project.model";

export const createProjectHandler = async (req: Request, res: Response) => {
  const result = createProjectSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: result.error.format() });
  }

  const ownerId = req.user?.userId;

  if (!ownerId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const project = await projectService.createProject({
    ...result.data,
    ownerId,
  });

  res.status(201).json(project);
};

export const getProjectsByWorkspaceHandler = async (
  req: Request,
  res: Response
) => {
  const userId = req.user?.userId;
  const workspaceId = req.params.workspaceId;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!workspaceId)
    return res.status(400).json({ message: "Missing workspaceId" });

  try {
    const projects = await projectService.getProjectsByWorkspace(
      workspaceId,
      userId
    );
    res.json(projects);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch projects" });
  }
};

export const getProjectMembersHandler = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;

  try {
    const members = await projectService.getProjectMembers(projectId);
    return res.json(members);
  } catch (err: any) {
    console.error(err);
    return res
      .status(400)
      .json({ message: err.message || "Failed to fetch members" });
  }
};

export const updateProjectHandler = async (req: Request, res: Response) => {
  const parsed = updateProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
  }

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const projectId = req.params.projectId;
  if (!projectId)
    return res.status(400).json({ message: "Project ID is required" });

  try {
    const updatedProject = await projectService.updateProject(
      projectId,
      userId,
      parsed.data.name
    );
    if (!updatedProject) {
      return res
        .status(404)
        .json({ message: "Project not found or unauthorized" });
    }
    return res.status(200).json(updatedProject);
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const inviteMemberHandler = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const projectId = req.params.workspaceId;
  if (!projectId)
    return res.status(400).json({ message: "Project ID is required" });

  const parsed = inviteMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
  }

  try {
    const project = await projectService.inviteMember(
      projectId,
      userId,
      parsed.data.email,
      parsed.data.role
    );
    return res.status(200).json(project);
  } catch (err: any) {
    return res.status(400).json({ message: err.message }); // 400 for invalid invite
  }
};

export const acceptInviteHandler = async (req: Request, res: Response) => {
  const { projectId, email } = req.query;

  if (!projectId || !email) {
    return res.status(400).json({ message: "Missing projectId or email" });
  }

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const invite = await getInvite(projectId as string, email as string);
  if (!invite) {
    return res.status(400).json({ message: "Invite not found or expired" });
  }

  // Update project members
  const project = await Project.findOne({ _id: projectId });
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  // Check if already a member
  const alreadyMember = project.members.some((m) => m.email === email);
  if (!alreadyMember) {
    project.members.push({
      userId,
      email,
      role: invite.role,
      status: "JOINED",
    });
    await project.save();
  }

  // Delete invite
  await deleteInvite(projectId as string, email as string);

  return res.status(200).json({ message: "Successfully joined project" });
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userId = req.user?.userId;

  if (!projectId)
    return res.status(400).json({ message: "Project ID required" });
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    await projectService.deleteProject(projectId, userId);
    return res.status(204).send(); // No content
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const removeMemberHandler = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const userIdToRemove = req.params.userId;
  const currentUserId = req.user?.userId;

  if (!projectId || !userIdToRemove) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    await projectService.removeMember(projectId, userIdToRemove, currentUserId);
    return res.status(200).json({ message: "Member removed successfully" });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
