import { Request, Response } from "express";
import { createTaskSchema } from "../validators/task.validators";
import * as taskService from "../services/task.service";

export const createTaskHandler = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);
  if (!result.success) {
    return res
      .status(400)
      .json({ message: "Invalid task data", errors: result.error.format() });
  }

  const task = await taskService.createTask(result.data);
  res.status(201).json(task);
};

export const getTasksByProjectHandler = async (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  if (!projectId)
    return res.status(400).json({ message: "Project ID is required" });

  const tasks = await taskService.getTasksByProject(projectId);
  res.json(tasks);
};
