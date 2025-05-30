import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1).toUpperCase(),
  template: z.enum(["SCRUM", "KANBAN"]),
  workspaceId: z.string().min(1), // 🔥 required
});

export const updateProjectSchema = z.object({
  name: z.string().min(1),
  members: z.array(
    z.object({
      userId: z.string().min(1),
      email: z.string().email(),
      role: z.enum(["MEMBER", "ADMIN"]),
    })
  ),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;