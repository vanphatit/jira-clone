import { Request, Response } from "express";
import { createWorkspaceSchema } from "../validators/workspace.validators";
import * as workspaceService from "../services/workspace.service";

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
