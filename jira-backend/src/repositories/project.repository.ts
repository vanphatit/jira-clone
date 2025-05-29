import { Project } from "../models/project";

export const findProjectsByWorkspaceId = async (
  workspaceId: string,
  userId: string
) => {
  return Project.find({
    workspaceId,
    members: userId, // Only return projects where user is a member
  }).sort({ modifiedAt: -1 });
};
