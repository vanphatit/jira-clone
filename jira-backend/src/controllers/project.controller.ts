import { Request, Response } from "express";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validators";
import * as projectService from "../services/project.service";
import { findUserById } from "../repositories/user.repository";

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

export const updateProjectHandler = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const projectId = req.params.projectId;

  const result = updateProjectSchema.safeParse(req.body);

  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: result.error.format() });
  }

  // 🔐 Permission Check
  const project = await projectService.getProjectById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const isOwner = project.owner._id.toString() === userId;
  const isAdmin = project.members.some(
    (member) => member.userId === userId && member.role === "ADMIN"
  );

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Only owner or admin can update project" });
  }

  // 🚫 Prevent owner from removing themselves
  const incomingEmails = result.data.members;
  console.log("Incoming emails:", incomingEmails);
  const ownerInList = project.members.find(
    (m) => m.userId === project.owner._id.toString() && incomingEmails.includes(m.email)
  );

  if (!ownerInList) {
    return res
      .status(400)
      .json({ message: "Owner must remain in the project" });
  }

  const updated = await projectService.updateProject(projectId, result.data);
  res.status(200).json(updated);
};

export const deleteProjectHandler = async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const projectId = req.params.projectId;

  const project = await projectService.getProjectById(projectId);
  if (!project || project.deleted) {
    return res.status(404).json({ message: "Project not found" });
  }

  const isOwner = project.owner.toString() === userId;
  const isAdmin = project.members.some(
    (member) => member.userId === userId && member.role === "ADMIN"
  );

  if (!isOwner && !isAdmin) {
    return res
      .status(403)
      .json({ message: "Forbidden: Only owner/admin can delete project" });
  }

  await projectService.deleteProject(projectId);
  res.status(204).send(); // No content
};
