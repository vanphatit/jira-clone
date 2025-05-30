"use client"

import { EditProjectDialog } from "@/features/projects/components/edit-project-dialog";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { useAppSelector } from "@/stores/hooks";

export default function ProjectTasksPage() {
    const { projects, currentProjectId } = useAppSelector(
        (state) => state.project
    );

    const currentProject = projects.find((p) => p._id === currentProjectId);

    return (
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-2">
            <ProjectAvatar name={currentProject?.name} className="size-8" />
            <p className="text-lg uppercase font-semibold">
              {currentProject?.name}
            </p>
          </div>
          <div>
            {/* <Button variant="secondary" size="sm" asChild>
              <Link href={""}>
                <Settings className="size-4 mr-2" />
                Project Settings
              </Link>
            </Button> */}

            <EditProjectDialog />
          </div>
        </div>
        <TaskViewSwitcher />
      </div>
    );
};
