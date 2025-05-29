import { Request, Response } from "express";
import { createProjectSchema } from "../validators/project.validators";
import * as projectService from "../services/project.service";

export const createProjectHandler = async (req: Request, res: Response) => {
  const parsed = createProjectSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid input", errors: parsed.error.errors });
  }

  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const project = await projectService.createProject(userId, parsed.data);
    res.status(201).json(project);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
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
  