import { Workspace } from "../models/workspace";
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

export const getWorkspaceMembers = async (workspaceId: string) => {
  return await workspaceRepo.getWorkspaceMembers(workspaceId);
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
  // Validate workspace exists and user is a member
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    "members.userId": inviterId,
    deleted: false,
  });
  if (!workspace) {
    throw new Error("Workspace not found or you are not a member");
  }

  // Check if email is already a member
  const alreadyMember = workspace.members.some((m) => m.email === email);
  if (alreadyMember) {
    throw new Error("User is already a member of this workspace");
  }

  // Save to Redis
  await workspaceRepo.saveInvite(workspaceId, email, role);

  // Generate invite link
  const inviteLink = `${process.env.CLIENT_URL}/workspace/invite/accept?workspaceId=${workspaceId}&email=${encodeURIComponent(email)}`;

  // Send email
  await sendWorkspaceInviteEmail(email, inviteLink);

  return { message: "Invitation sent successfully" };
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  const workspace = await Workspace.findOne({
    _id: workspaceId,
    deleted: false,
  });

  if (!workspace) throw new Error("Workspace not found or already deleted");

  if (workspace.owner.toString() !== userId) {
    throw new Error("Only owner can delete the workspace");
  }

  return workspaceRepo.softDeleteWorkspaceById(workspaceId);
};

export const removeMember = async (
  workspaceId: string,
  userId: string,
  currentUserId: string
) => {
  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) throw new Error("Workspace not found");

  // Check if current user is ADMIN
  const currentUserMember = workspace.members.find(
    (m) => m.userId.toString() === currentUserId
  );
  if (!currentUserMember || currentUserMember.role !== "ADMIN") {
    throw new Error("Only Admins can remove members");
  }

  // Admins can't remove themselves
  if (userId === currentUserId) {
    throw new Error("You cannot remove yourself");
  }

  return await workspaceRepo.removeWorkspaceMember(workspaceId, userId);
};