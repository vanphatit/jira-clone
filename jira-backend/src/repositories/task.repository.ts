import { Task } from "../models/tasks";
import { CreateTaskDTO } from "../validators/task.validators";

export const createTask = async (data: CreateTaskDTO) => {
  return await Task.create(data);
};

export const findTasksByProjectId = async (projectId: string) => {
  return await Task.find({ projectId }).sort({ position: 1 });
};
