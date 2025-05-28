import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1),
  key: z.string().min(1).toUpperCase(),
  template: z.enum(["SCRUM", "KANBAN"]),
  workspaceId: z.string().min(1), // 🔥 required
});