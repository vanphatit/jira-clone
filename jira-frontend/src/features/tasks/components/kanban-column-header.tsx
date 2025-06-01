import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../types";

import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon
} from "lucide-react"
import { Button } from "@/components/ui/button";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
  setOpen?: (open: boolean) => void;
  setInitialStatus?: (status: TaskStatus) => void;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
    [TaskStatus.BACKLOG]: <CircleIcon className="size-[18px] text-pink-400" />,
    [TaskStatus.TODO]: <CircleDotIcon className="size-[18px] text-red-200" />,
    [TaskStatus.IN_PROGRESS]: <CircleDotDashedIcon className="size-[18px] text-yellow-500" />,
    [TaskStatus.IN_REVIEWED]: <CircleDashedIcon className="size-[18px] text-blue-500" />,
    [TaskStatus.DONE]: <CircleCheckIcon className="size-[18px] text-emerald-500" />,
    [TaskStatus.OVERDUE]: <CircleDashedIcon className="size-[18px] text-red-500" />,
    [TaskStatus.ARCHIVED]: <CircleIcon className="size-[18px] text-gray-500" />,
}

export const KanbanColumnHeader = ({
    board,
    taskCount,
    setOpen,
    setInitialStatus
}: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];
    return (
      <div className="px-2 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          {icon}
          <h2>{snakeCaseToTitleCase(board)}</h2>
          <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
            {taskCount}
          </div>
        </div>
        <Button
          onClick={() => {
            setOpen?.(true); 
            setInitialStatus?.(board)}}
          variant="ghost"
          size="icon"
          className="size-5"
        >
          <PlusIcon className="size-4 text-neutral-500" />
        </Button>
      </div>
    );
};