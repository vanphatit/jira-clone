import { Project } from "../models/project.model";
import * as projectRepo from "../repositories/project.repository";
import { sendProjectInviteEmail } from "../utils/sendEmail";
import { CreateProjectDTO } from "../validators/project.validators";
import { getWorkspaceMembers } from "./workspace.service";

export const createProject = async (
  payload: CreateProjectDTO & { ownerId: string }
) => {
  if (payload.type === "TEAM_MANAGED") {
    return await projectRepo.createProjectTeam(payload);
  } else if (payload.type === "WORKSPACE_MANAGED") {
    const members = await getWorkspaceMembers(payload.workspaceId);

    return await projectRepo.createProjectWorkspace({
      ...payload,
      members: members, // <-- Correct: Use _id, not email
    });
  }
};

export const getProjectById = async (projectId: string) => {
  return await projectRepo.findProjectById(projectId);
};

export const getProjectsByWorkspace = async (
  workspaceId: string,
  userId: string
) => {
  return projectRepo.findProjectsByWorkspaceId(workspaceId, userId);
};

export const getProjectMembers = async (projectId: string) => {
  return await projectRepo.getProjectMembers(projectId);
};

export const updateProject = async (
  projectId: string,
  userId: string,
  name: string
) => {
  return await projectRepo.updateProjectById(projectId, userId, name);
};

export const inviteMember = async (
  projectId: string,
  inviterId: string,
  email: string,
  role: "MEMBER" | "ADMIN"
) => {
  // Validate project exists and user is a member
  const project = await Project.findOne({
    _id: projectId,
    "members.userId": inviterId,
    deleted: false,
  });
  if (!project) {
    throw new Error("Workspace not found or you are not a member");
  }

  // Check if email is already a member
  const alreadyMember = project.members.some((m) => m.email === email);
  if (alreadyMember) {
    throw new Error("User is already a member of this project");
  }

  // Save to Redis
  await projectRepo.saveInvite(projectId, email, role);

  // Generate invite link
  const inviteLink = `${process.env.CLIENT_URL}/project/invite/accept?projectId=${projectId}&email=${encodeURIComponent(email)}`;

  // Send email
  await sendProjectInviteEmail(email, inviteLink);

  return { message: "Invitation sent successfully" };
};

export const deleteProject = async (projectId: string, userId: string) => {
  const project = await Project.findOne({
    _id: projectId,
    deleted: false,
  });

  if (!project) throw new Error("Project not found or already deleted");

  if (project.owner.toString() !== userId) {
    throw new Error("Only owner can delete the project");
  }

  return projectRepo.softDeleteProjectById(projectId);
};

export const removeMember = async (
  projectId: string,
  userId: string,
  currentUserId: string
) => {
  const project = await Project.findById(projectId);

  if (!project) throw new Error("Project not found");

  // Check if current user is ADMIN
  const currentUserMember = project.members.find(
    (m) => m.userId.toString() === currentUserId
  );
  if (!currentUserMember || currentUserMember.role !== "ADMIN") {
    throw new Error("Only Admins can remove members");
  }

  // Admins can't remove themselves
  if (userId === currentUserId) {
    throw new Error("You cannot remove yourself");
  }

  return await projectRepo.removeProjectMember(projectId, userId);
};
