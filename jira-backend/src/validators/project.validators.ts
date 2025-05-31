import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1).toUpperCase(),
  type: z.enum(["TEAM_MANAGED", "WORKSPACE_MANAGED"]),
  workspaceId: z.string().min(1),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1)
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "ADMIN"]),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;