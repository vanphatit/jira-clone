import { User } from "../models/user";
import { Workspace } from "../models/workspace";
import { redis } from "../utils/redis";

export const createWorkspace = async (
  user: InstanceType<typeof User>,
  name: string
) => {
  return Workspace.create({
    name,
    owner: user._id,
    members: [
      {
        userId: user._id,
        email: user.email,
        status: "JOINED",
        role: "ADMIN",
      },
    ],
  });
};

export const getWorkspacesByUserId = async (userId: string) => {
  return Workspace.find({
    "members.userId": userId,
    deleted: false,
    "members.status": { $ne: "PENDING" }, // Exclude pending invites
  });
};

export const getWorkspaceMembers = async (workspaceId: string) => {
  const workspace = await Workspace.findById(workspaceId)
    .populate("members.userId", "name email avatar") // populate user fields if you want
    .lean();

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  return workspace.members;
};

export const updateWorkspaceById = async (
  workspaceId: string,
  userId: string,
  name: string
) => {
  return Workspace.findOneAndUpdate(
    { _id: workspaceId, owner: userId, deleted: false }, // only owner can update
    { $set: { name } },
    { new: true }
  );
};

export const saveInvite = async (
  workspaceId: string,
  email: string,
  role: "MEMBER" | "ADMIN"
) => {
  const key = `invite:${workspaceId}:${email}`;
  const value = JSON.stringify({ workspaceId, email, role, status: "PENDING" });

  // Save invite with 24-hour expiration
  await redis.set(key, value, { EX: 60 * 60 * 24 });
};

export const getInvite = async (workspaceId: string, email: string) => {
  const key = `invite:${workspaceId}:${email}`;
  const data = await redis.get(key);

  if (!data) return null;
  return JSON.parse(data);
};

export const deleteInvite = async (workspaceId: string, email: string) => {
  const key = `invite:${workspaceId}:${email}`;
  await redis.del(key);
};

export const softDeleteWorkspaceById = async (workspaceId: string) => {
  return Workspace.findByIdAndUpdate(
    workspaceId,
    { deleted: true },
    { new: true }
  );
};

export const removeWorkspaceMember = async (
  workspaceId: string,
  userId: string
) => {
  return Workspace.findByIdAndUpdate(
    workspaceId,
    { $pull: { members: { userId } } },
    { new: true }
  );
};