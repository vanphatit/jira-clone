import { Project } from "../models/project";
import * as projectRepo from "../repositories/project.repository";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
} from "../validators/project.validators";

export const createProject = async (
  payload: CreateProjectDTO & { ownerId: string; }
) => {
  payload
  return await projectRepo.createProject(payload);
};

export const getProjectById = async (projectId: string) => {
  return await projectRepo.findProjectById(projectId);
};

export const getProjectsByWorkspace = async (
  workspaceId: string,
  userId: string
) => {
  return projectRepo.findProjectsByWorkspaceId(workspaceId, userId);
};

export const updateProject = async (
  projectId: string,
  payload: UpdateProjectDTO
) => {
  return await projectRepo.updateProjectById(projectId, payload);
};

export const deleteProject = async (projectId: string) => {
  return await projectRepo.softDeleteProjectById(projectId);
};
