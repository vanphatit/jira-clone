import { z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  position: z.number().default(0),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  projectId: z.string().min(1),
  workspaceId: z.string().min(1),
  assigneeIds: z.array(z.string()).optional(), // ⬅️ Array
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
