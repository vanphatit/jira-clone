import { findUserById } from "../repositories/user.repository";
import * as workspaceRepo from "../repositories/workspace.repository";
import { sendWorkspaceInviteEmail } from "../utils/sendEmail";

export const createWorkspace = async (userId: string, name: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return await workspaceRepo.createWorkspace(user, name);
};

export const getUserWorkspaces = async (userId: string) => {
  return await workspaceRepo.getWorkspacesByUserId(userId);
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  name: string
) => {
  return await workspaceRepo.updateWorkspaceById(workspaceId, userId, name);
};

export const inviteMember = async (
  workspaceId: string,
  inviterId: string,
  email: string,
  role: "MEMBER" | "ADMIN"
) => {
  // Save to Redis
  await workspaceRepo.saveInvite(workspaceId, email, role);

  // Generate invite link
  const inviteLink = `${process.env.CLIENT_URL}/invite/accept?workspaceId=${workspaceId}&email=${encodeURIComponent(email)}`;

  // Send email
  await sendWorkspaceInviteEmail(email, inviteLink);

  return { message: "Invitation sent successfully" };
};