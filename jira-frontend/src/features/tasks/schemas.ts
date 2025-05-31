import { z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  dueDate: z.string(),
  projectId: z.string(),
  workspaceId: z.string(),
  description: z.string().optional(),
  position: z.number(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  assigneeIds: z.array(z.string()).optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
