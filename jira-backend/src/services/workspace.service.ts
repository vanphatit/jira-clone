import { Workspace } from "../models/workspace";

export const createWorkspace = async (userId: string, name: string) => {
  const workspace = await Workspace.create({
    name,
    owner: userId,
    members: [userId],
  });

  return workspace;
};

export const getUserWorkspaces = async (userId: string) => {
  return Workspace.find({ owner: userId });
};