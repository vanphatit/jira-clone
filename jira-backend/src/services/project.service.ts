import { Project } from "../models/project";
import * as projectRepo from "../repositories/project.repository";

export const createProject = async (
  userId: string,
  input: {
    name: string;
    key: string;
    template: "SCRUM" | "KANBAN";
    workspaceId: string;
  }
) => {
  const { name, key, template, workspaceId } = input;

  const project = await Project.create({
    name,
    key,
    template,
    workspaceId,
    owner: userId,
    members: [userId],
  });

  return project;
};

export const getProjectsByWorkspace = async (
  workspaceId: string,
  userId: string
) => {
  return projectRepo.findProjectsByWorkspaceId(workspaceId, userId);
};