export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEWED = "IN_REVIEWED",
  DONE = "DONE",
  OVERDUE = "OVERDUE",
  ARCHIVED = "ARCHIVED",
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  dueDate: string;
  status: TaskStatus;
  position: number;
  projectId: string;
  workspaceId: string;
  ownerId: string;
  assigneeIds: string[]; // Array of user IDs
  createdAt: string;
  updatedAt: string;
}
