import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  key: z
    .string()
    .min(1, "Project key is required")
    .toUpperCase(),
  template: z.enum(["SCRUM", "KANBAN"]),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
