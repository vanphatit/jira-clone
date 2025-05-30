export interface Task {
  _id: string;
  name: string;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
  description?: string;
  dueDate: string;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
  position: number;
}
