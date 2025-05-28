import { Project } from "../models/project";

export const createProject = async (
  userId: string,
  input: {
    name: string;
    key: string;
    template: "SCRUM" | "KANBAN";
  }
) => {
  const { name, key, template } = input;

  const project = await Project.create({
    name,
    key,
    template,
    owner: userId,
    members: [userId],
  });

  return project;
};
