import { Request, Response } from "express";
import { createTaskSchema } from "../validators/task.validators";
import * as taskService from "../services/task.service";

export const createTaskHandler = async (req: Request, res: Response) => {
  const result = createTaskSchema.safeParse(req.body);
  console.log("Create Task Result:", result);
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
  const {
    status,
    assigneeId,
    search,
    dueDate,
    sort = "position",
    direction = "asc",
  } = req.query;

  if (!projectId)
    return res.status(400).json({ message: "Project ID is required" });

  const filters = {
    status: status as string,
    assigneeId: assigneeId as string,
    search: search as string,
    dueDate: dueDate as string,
    sort: sort as string,
    direction: direction as "asc" | "desc",
  };

  const tasks = await taskService.getTasksByProject(projectId, filters);
  res.json(tasks);
};