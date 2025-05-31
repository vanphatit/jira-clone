import * as taskRepo from "../repositories/task.repository";
import { CreateTaskDTO } from "../validators/task.validators";

export const createTask = async (payload: CreateTaskDTO) => {
  
  const existingTask = await taskRepo.findTasksByProjectId(payload.projectId);
  if (existingTask.some(task => task.name === payload.name)) {
    throw new Error("Task with this title already exists in the project");
  }

  //get the next position for the new task
  const tasks = await taskRepo.findTasksByProjectId(payload.projectId);
  if (tasks.length > 0) {
    const lastTask = tasks[tasks.length - 1];
    payload.position = lastTask.position + 1; // Increment position based on the last task
  } else {
    payload.position = 0; // Start at position 0 if no tasks exist
  }

  return await taskRepo.createTask(payload);
};

export const getTasksByProject = async (projectId: string) => {
  return await taskRepo.findTasksByProjectId(projectId);
};
