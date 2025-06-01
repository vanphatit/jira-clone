"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "../types";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { TaskDate } from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useTaskTable } from "./task-table-context"; // <-- Import Context
import Image from "next/image";

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Task Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const name = row.original.name;

      return (
        <div
          className="max-w-[280px] pl-2 truncate font-medium text-sm text-gray-900 hover:underline cursor-pointer"
          title={name}
        >
          {name}
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;
      return <TaskDate value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div className="flex items-center justify-center h-full">
          <Badge variant={status as any}>{snakeCaseToTitleCase(status)}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "assigneeIds",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Assignees
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const { members } = useTaskTable();
      const assigneeIds: string[] = row.original.assigneeIds || [];

      const assignees = assigneeIds
        .map((id) => members.find((m) => m.userId._id === id))
        .filter(Boolean);

      if (assignees.length === 0) {
        return <p className="text-gray-400 text-sm">No assignees</p>;
      }

      return (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {assignees.map((assignee: any) => (
            <div
              key={assignee.userId._id}
              className="flex items-center space-x-2"
            >
              <Image
                width={24}
                height={24}
                src={assignee.userId.avatar}
                alt={assignee.userId.name}
                className="w-6 h-6 rounded-full object-cover border"
              />
              <span className="text-sm">{assignee.userId.name}</span>
            </div>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Remaining
      </Button>
    ),
    cell: ({ row }) => {
      const dueDateStr = row.original.dueDate;
      if (!dueDateStr)
        return <span className="text-gray-400">No due date</span>;

      const dueDate = new Date(dueDateStr);
      const today = new Date();

      // Calculate difference in days
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));

      if (diffDays < 0) {
        return <span className="flex text-red-500 font-medium items-center justify-center">Overdue</span>;
      }

      return (
        <span className="flex text-gray-800 text-sm font-medium items-center justify-center">
          {diffDays} day{diffDays !== 1 ? "s" : ""}
        </span>
      );
    },
  },
];
