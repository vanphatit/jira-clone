import { z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().min(1),
  workspaceId: z.string(),
  projectId: z.string(),
  assigneeId: z.string(),
  description: z.string().optional(),
  dueDate: z.string(), // ISO format
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]),
  position: z.number().int(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
