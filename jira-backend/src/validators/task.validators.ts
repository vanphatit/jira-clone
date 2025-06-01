import { z } from "zod";

export const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  position: z.number().default(0),
  status: z
    .enum([
      "BACKLOG",
      "TODO",
      "IN_PROGRESS",
      "IN_REVIEWED",
      "DONE",
      "OVERDUE",
      "ARCHIVED",
    ])
    .default("TODO"),
  projectId: z.string().min(1),
  workspaceId: z.string().min(1),
  ownerId: z.string().min(1),
  assigneeIds: z.array(z.string()).optional(), // ⬅️ Array
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
