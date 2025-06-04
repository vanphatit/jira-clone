import mongoose, { Types } from "mongoose";
import { ITask, Task } from "../models/tasks.model";
import { CreateTaskDTO } from "../validators/task.validators";
import * as projectRepo from "./project.repository";
import { Project } from "../models/project.model";

export const createTask = async (data: CreateTaskDTO) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const project = await Project.findById(data.projectId).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    const task = await Task.create([{ ...data }], {
      session,
    }); // task is an array because create() with array returns array

    const newTask = task[0];

    project.tasks.push(newTask._id as Types.ObjectId);
    await project.save({ session });

    await session.commitTransaction();
    session.endSession();

    return newTask;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to create task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

export const getTaskById = async (taskId: string) => {
  return Task.findById(taskId);
};

export const findTasksByIdAndProjectId = async (
  taskId: string,
  projectId: string
) => {
  return Task.findOne({ _id: taskId, projectId });
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const task = await Task.findById(taskId).session(session);
    if (!task) {
      throw new Error("Task not found");
    }

    const project = await Project.findById(task.projectId).session(session);
    if (!project) {
      throw new Error("Project not found");
    }

    await Task.deleteOne({ _id: taskId }, { session });
    project.tasks = project.tasks.filter(
      (t) => t.toString() !== taskId
    );
    await project.save({ session });
    await session.commitTransaction();
    session.endSession();
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to delete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
