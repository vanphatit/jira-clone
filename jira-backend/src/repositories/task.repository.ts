import { ITask, Task } from "../models/tasks";
import { CreateTaskDTO } from "../validators/task.validators";

export const createTask = async (data: CreateTaskDTO) => {
  return await Task.create(data);
};

export const findTasksByProjectId = async (
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
  const query: any = { projectId };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.assigneeId) {
    query.assigneeIds = { $in: [filters.assigneeId] };
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: "i" }; // case-insensitive search
  }

  if (filters.dueDate) {
    query.dueDate = new Date(filters.dueDate);
  }

  const sortField = filters.sort || "position";
  const sortDirection = filters.direction === "desc" ? -1 : 1;

  return await Task.find(query).sort({ [sortField]: sortDirection });
};

export const updateStatus = async (taskId: string, status: string) => {
  return await Task.findByIdAndUpdate(taskId, { status }, { new: true });
};

export const updateTask = async (taskId: string, update: Partial<ITask>) => {
  return Task.findByIdAndUpdate(taskId, update, { new: true });
};


export const deleteTask = async (taskId: string) => {
  return Task.findByIdAndDelete(taskId);
};