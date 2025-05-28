import { Project } from "../models/project";

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
  