export type ProjectAccess = "PRIVATE";
export type ProjectType = "TEAM_MANAGED" | "WORKSPACE_MANAGED";
export type ProjectTemplate = "SCRUM" | "KANBAN";

export interface CreateProjectDTO {
  name: string;
  key: string;
  type: ProjectType;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  workspaceId: string;
  members: { userId: string; email: string }[];
  createdAt: string;
  updatedAt: string;
}