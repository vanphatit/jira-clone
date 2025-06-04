import mongoose from "mongoose";
import { Project } from "../models/project.model";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
} from "../validators/project.validators";
import { findUserById } from "./user.repository";
import { redis } from "../utils/redis";

export const createProjectTeam = async (
  data: CreateProjectDTO & { ownerId: string }
) => {
  const project = new Project({
    name: data.name,
    key: data.key.toUpperCase(), // Ensure key is uppercase
    template: data.template,
    workspaceId: data.workspaceId,
    owner: data.ownerId,
    members: [
      {
        userId: data.ownerId,
        email: await findUserById(data.ownerId).then(
          (user) => user?.email || ""
        ),
        status: "JOINED", // Set initial status to JOINED
        role: "ADMIN", // Set creator as ADMIN
      },
    ],
  });
  return await project.save();
};

export const createProjectWorkspace = async (data: any) => {
  console.log("Creating project with data:", data);
  const project = new Project({
    name: data.name,
    key: data.key.toUpperCase(), // Ensure key is uppercase
    template: data.template,
    workspaceId: data.workspaceId,
    owner: data.ownerId,
    members: data.members,
  });
  return await project.save();
};

export const findProjectById = async (projectId: string) => {
  return await Project.findById(projectId);
};

export const findProjectsByWorkspaceId = async (
  workspaceId: string,
  userId: string
) => {
  return Project.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId), // <-- fix here
    members: { $elemMatch: { userId } },
    deleted: false,
  }).sort({ modifiedAt: -1 });
};

export const getProjectMembers = async (projectId: string) => {
  const project = await Project.findById(projectId)
    .populate("members.userId", "name email avatar") // populate user fields if you want
    .lean();

  if (!project) {
    throw new Error("Project not found");
  }
  return project.members;
};

export const updateProjectById = async (
  projectId: string,
  userId: string,
  name: string
) => {
  return await Project.findOneAndUpdate(
    { _id: projectId, owner: userId, deleted: false }, // only owner can update
    { $set: { name } },
    { new: true }
  );
};

export const saveInvite = async (
  projectId: string,
  email: string,
  role: "MEMBER" | "ADMIN"
) => {
  const key = `invite:${projectId}:${email}`;
  const value = JSON.stringify({ projectId, email, role, status: "PENDING" });

  // Save invite with 24-hour expiration
  await redis.set(key, value, { EX: 60 * 60 * 24 });
};

export const getInvite = async (projectId: string, email: string) => {
  const key = `invite:${projectId}:${email}`;
  const data = await redis.get(key);

  if (!data) return null;
  return JSON.parse(data);
};

export const deleteInvite = async (projectId: string, email: string) => {
  const key = `invite:${projectId}:${email}`;
  await redis.del(key);
};

export const softDeleteProjectById = async (projectId: string) => {
  return Project.findByIdAndUpdate(projectId, { deleted: true }, { new: true });
};

export const removeProjectMember = async (
  projectId: string,
  userId: string
) => {
  return Project.findByIdAndUpdate(
    projectId,
    { $pull: { members: { userId } } },
    { new: true }
  );
};
