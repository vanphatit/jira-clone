import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/projects/api/use-get-members";
import { RootState } from "@/stores";
import { ListChecksIcon, RotateCwIcon, UserIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../api/use-task-filter";
import { Button } from "@/components/ui/button";

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = () => {
  const currentProjectId = useSelector(
    (s: RootState) => s.project.currentProjectId
  )!;

  const members = useGetMembers(currentProjectId || "").data || [];

  const assigneeOptions = members.map(
    (member: { name: string; _id: string }) => ({
      label: member.userId.name,
      value: member.userId._id,
    })
  );

  const taskStatusOptions = Object.values(TaskStatus).map((status) => ({
    label: status.charAt(0).toUpperCase() + status.slice(1),
    value: status,
  }));

  const [{ status, assigneeId }, setFilters] = useTaskFilters(); // ⬅️ single assigneeId

  const onStatusChange = (value: string) => {
    setFilters({ status: value === "all" ? null : (value as TaskStatus) });
  };

  const onAssigneeChange = (value: string) => {
    setFilters({ assigneeId: value === "all" ? null : value });
  };

  const onResetFilters = () => {
    setFilters({
      status: null,
      assigneeId: null,
      search: null,
      dueDate: null,
      sort: null,
      direction: null,
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Status Filter */}
      <Select value={status ?? undefined} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectSeparator />
          {taskStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Assignee Filter */}
      <Select
        value={assigneeId ?? undefined} // <-- FIX: should be assigneeId, not status
        onValueChange={onAssigneeChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="All assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {assigneeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="sm"
        onClick={onResetFilters}
        className="h-8 flex items-center gap-2"
      >
        <RotateCwIcon className="size-4" />
        Reset
      </Button>
    </div>
  );
};
