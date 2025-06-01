import { z } from "zod";
import { TaskStatus } from "@/features/tasks/types";

export const createTaskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  dueDate: z.string(),
  projectId: z.string(),
  workspaceId: z.string(),
  ownerId: z.string(),
  description: z.string().optional(),
  position: z.number(),
  status: z.enum([
    TaskStatus.BACKLOG,
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.IN_REVIEWED,
    TaskStatus.DONE,
    TaskStatus.OVERDUE,
    TaskStatus.ARCHIVED,
  ]).default(TaskStatus.BACKLOG),
  assigneeIds: z.array(z.string()).optional(),
});

export type CreateTaskSchema = z.infer<typeof createTaskSchema>;
