import mongoose from "mongoose";
import { Project } from "../models/project";
import {
  CreateProjectDTO,
  UpdateProjectDTO,
} from "../validators/project.validators";
import { findUserById } from "./user.repository";

export const createProject = async (
  data: CreateProjectDTO & { ownerId: string; }
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
        email: await findUserById(data.ownerId).then(user => user?.email || ""),
        role: "ADMIN", // Set creator as ADMIN
      },
    ],
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

export const updateProjectById = async (
  projectId: string,
  data: UpdateProjectDTO
) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  const newMembers = project.members.map((existingMember) => {
    const newEmail = data.members.find(
      (email) => email === existingMember.email
    );
    if (newEmail) {
      return existingMember; // Keep existing member with userId, role
    }
    // Or optionally throw if email not found
  });

  return await Project.findByIdAndUpdate(
    projectId,
    {
      $set: {
        name: data.name,
        members: newMembers,
      },
    },
    { new: true }
  );
};

export const softDeleteProjectById = async (projectId: string) => {
  return Project.findByIdAndUpdate(projectId, { deleted: true }, { new: true });
};
