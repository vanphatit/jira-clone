"use client"

import { Button } from "@/components/ui/button";
import { EditProjectDialog } from "@/features/projects/components/edit-project-dialog";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useAppSelector } from "@/stores/hooks";
import { Settings } from "lucide-react";
import Link from "next/link";

export default function ProjectTasksPage() {
    const { projects, currentProjectId } = useAppSelector(
        (state) => state.project
    );

    const currentProject = projects.find((p) => p._id === currentProjectId);

    if (!currentProject) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Please select a project to view tasks.</p>
            </div>
        );
    }

    return (
      <div className="flex flex-col gap-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <ProjectAvatar name={currentProject?.name} className="size-8" />
            <p className="text-lg uppercase font-semibold">
              {currentProject?.name}
            </p>
          </div>
          <div>
            <Button variant="secondary" size="sm" asChild>
              <Link href={"/project/settings"}>
                <Settings className="size-4 mr-2" />
                Project Settings
              </Link>
            </Button>

          </div>
        </div>
        <TaskViewSwitcher />
      </div>
    );
};
