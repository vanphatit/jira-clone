import Image from "next/image";
import { useTaskTable } from "./task-table-context"; // Context that provides members!
import { TaskActions } from "./take-actions";
import { MoreHorizontal } from "lucide-react";
import { TaskStatus } from "../types";

interface KanbanCardProps {
  task: Task;
}

export const KanbanCard = ({ task }: KanbanCardProps) => {
  const { members } = useTaskTable(); // Get members from context

  const dueDateStr = task.dueDate;
  const dueDate = dueDateStr ? new Date(dueDateStr) : null;
  const now = new Date();

  let dueColor = "bg-gray-200 text-gray-700";
  let dueText = "No due date";

  if (dueDate) {
    const diffDays = Math.ceil(
      (dueDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays < 0) {
      dueColor = "bg-red-100 text-red-600";
      dueText = "Overdue";
    } else if (diffDays <= 3) {
      dueColor = "bg-yellow-100 text-yellow-600";
      dueText = `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;
    } else {
      dueColor = "bg-green-100 text-green-600";
      dueText = `${diffDays} day${diffDays !== 1 ? "s" : ""} left`;
    }
  }

  // Map assigneeIds to members info
  const assignees = task.assigneeIds
    .map((id) => members.find((m) => m.userId._id === id))
    .filter(Boolean);

  return (
    <div className="bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3">
      {/* Task Title */}
      <div className="flex items-start justify-between gap-x-2">
        <p className="text-sm line-clamp-2">{task.name}</p>
        <TaskActions id={task._id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition"/>
        </TaskActions>
      </div>

      <div className="flex items-center justify-between mt-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${dueColor}`}>
            {![TaskStatus.ARCHIVED, TaskStatus.DONE, TaskStatus.BACKLOG].includes(task.status) && dueText !== "No due date"
              ? dueText
              : "No due date"}
          </span>

        {/* Assignees */}
        {assignees.length > 0 && (
          <div className="flex -space-x-2">
            {assignees.slice(0, 3).map((assignee: any) => (
              <Image
                width={28}
                height={28}
                key={assignee.userId._id}
                src={assignee.userId.avatar}
                alt={assignee.userId.name}
                title={assignee.userId.name}
                className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-sm"
              />
            ))}
            {assignees.length > 3 && (
              <div className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700 shadow-sm">
                +{assignees.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
