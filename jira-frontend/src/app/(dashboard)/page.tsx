"use client";

import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { useAppSelector } from "@/stores/hooks";

function HomePage() {

  const { workspaces, currentWorkspaceId } = useAppSelector(
    (state) => state.workspace
  );

  const currentWorkspace = workspaces.find(
    (w) => w._id === currentWorkspaceId
  );

  const { projects, currentProjectId} = useAppSelector((state) => state.project);

  const currentProject = projects.find(
    (p) => p._id === currentProjectId
  );

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Workspace:{" "}
        {currentWorkspace ? currentWorkspace.name : "No workspace selected"}
      </h1>
      <h2 className="text-lg font-medium mb-2">
        Project: {currentProject ? currentProject.name : "No project selected"}
      </h2>
    </main>
  );
}

export default HomePage;
