import * as taskRepo from "../repositories/task.repository";
import { CreateTaskDTO } from "../validators/task.validators";

export const createTask = async (payload: CreateTaskDTO) => {
  return await taskRepo.createTask(payload);
};

export const getTasksByProject = async (projectId: string) => {
  return await taskRepo.findTasksByProjectId(projectId);
};
