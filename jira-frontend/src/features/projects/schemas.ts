import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  key: z
    .string()
    .min(1, "Project key is required")
    .toUpperCase(),
  template: z.enum(["KANBAN", "SCRUM"]),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  name: z.string().min(1),
  members: z.array(
    z.object({
      userId: z.string(),
      email: z.string().email(),
      role: z.enum(["MEMBER", "ADMIN"]),
    })
  ),
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;