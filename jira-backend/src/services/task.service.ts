import { Types } from "mongoose";
import { ITask } from "../models/tasks.model";
import { findProjectById } from "../repositories/project.repository";
import * as taskRepo from "../repositories/task.repository";
import { CreateTaskDTO } from "../validators/task.validators";

export const createTask = async (payload: CreateTaskDTO) => {
  const tasks = await taskRepo.findTasksByProjectId(
    payload.projectId,
    {} // No filters needed here, we just want to get all tasks for the project
  );
  if (tasks.some((task) => task.name === payload.name)) {
    throw new Error("Task with this title already exists in the project");
  }

  //get the next position for the new task
  if (tasks.length > 0) {
    const lastTask = tasks[tasks.length - 1];
    payload.position = lastTask.position + 1; // Increment position based on the last task
  } else {
    payload.position = 0; // Start at position 0 if no tasks exist
  }

  const newTask = await taskRepo.createTask(payload);

  return newTask;
};

export const getTaskByIdService = async (taskId: string) => {
  return taskRepo.getTaskById(taskId);
};

export const getTasksByProject = async (
  projectId: string,
  filters: {
    status?: string;
    assigneeId?: string;
    search?: string;
    dueDate?: string;
    sort?: string;
    direction?: "asc" | "desc";
  }
) => {
  const tasks = await taskRepo.findTasksByProjectId(projectId, filters);
  // change the status of overdue tasks
  const now = new Date();
  tasks.forEach((task) => {
    if (task.dueDate && task.dueDate < now && task.status !== "DONE") {
      task.status = "OVERDUE";
      taskRepo.updateStatus(task._id as string, "OVERDUE");
    }
  });
  return tasks;
};

export const updateTaskService = async (
  taskId: string,
  update: Partial<ITask>
) => {
  const task = await taskRepo.findTasksByIdAndProjectId(
    taskId,
    update.projectId as string
  );

  if (!task) {
    throw new Error("Task not found in the specified project");
  }

  return taskRepo.updateTask(taskId, update);
};

export const deleteTaskService = async (taskId: string) => {
  const task = await taskRepo.getTaskById(taskId);

  const project = await findProjectById(task?.projectId as string);
  if (!project) {
    throw new Error("Project not found");
  }

  return await taskRepo.deleteTask(taskId);
};
