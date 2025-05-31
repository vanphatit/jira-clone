import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  key: z
    .string()
    .min(1, "Project key is required")
    .toUpperCase(),
  type: z.enum(["TEAM_MANAGED", "WORKSPACE_MANAGED"]),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;