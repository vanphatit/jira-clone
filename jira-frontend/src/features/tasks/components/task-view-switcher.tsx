import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, PlusIcon } from "lucide-react";
import { CreateTaskDialog } from "./create-task-dialog";
import { useTasksByProject } from "../api/use-get-tasks";
import { useAppSelector } from "@/stores/hooks";
import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import { DataFilters } from "./data-filters";
import { useTaskFilters } from "../api/use-task-filter";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { TaskTableContext } from "./task-table-context";
import { useGetMembers } from "@/features/projects/api/use-get-members";
import { DataKanban } from "./data-kanban";
import { useState } from "react";
import { TaskStatus } from "../types";

export const TaskViewSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [initialStatus, setInitialStatus] = useState<TaskStatus>(
    TaskStatus.BACKLOG
  );

  const currentProjectId = useSelector(
    (s: RootState) => s.project.currentProjectId
  )!;
  const currentWorkspaceId = useSelector(
    (s: RootState) => s.workspace.currentWorkspaceId
  )!;

  const { data: members = [] } = useGetMembers(currentProjectId || "");

  const [{ status, assigneeId, search, dueDate, sort, direction }] =
    useTaskFilters();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useTasksByProject({
    workspaceId: currentWorkspaceId,
    projectId: currentProjectId,
    status,
    assigneeId,
    search,
    dueDate,
    sort,
    direction,
  });

  if (!currentProjectId) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">Please select a project to view tasks.</p>
      </div>
    );
  }

  return (
    <Tabs className="flex-1 w-full border rounded-lg" defaultValue="kanban">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="h-8 w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <CreateTaskDialog
            open={open}
            setOpen={setOpen}
            initialStatus={initialStatus}
          />
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters />
        <DottedSeparator className="my-4" />
        {isLoading ? (
          <div className="w-full border rounded-log h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              {tasks.length === 0 ? (
                <div className="text-center text-gray-500">
                  No tasks found for this project.
                </div>
              ) : (
                <TaskTableContext.Provider value={{ members }}>
                  <DataTable columns={columns} data={tasks} />
                </TaskTableContext.Provider>
              )}
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <TaskTableContext.Provider value={{ members }}>
                <DataKanban
                  data={tasks}
                  setOpen={setOpen}
                  setInitialStatus={setInitialStatus}
                />
              </TaskTableContext.Provider>
            </TabsContent>
            <TabsContent value="calendar" className="mt-0">
              Data calendar
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
