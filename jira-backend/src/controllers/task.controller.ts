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

export const getTaskHandler = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  const task = await taskService.getTaskByIdService(taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
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

export const updateTaskHandler = async (req: Request, res: Response) => {
  const { taskId } = req.params;
  const updateData = req.body; // Expect { status, position, ... }

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  const updatedTask = await taskService.updateTaskService(taskId, updateData);

  if (!updatedTask) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(updatedTask);
};


export const deleteTaskHandler = async (req: Request, res: Response) => {
  const { taskId } = req.params;

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  await taskService.deleteTaskService(taskId);

  res.status(200).json({ message: "Task deleted successfully" });
};