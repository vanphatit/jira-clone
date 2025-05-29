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

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold mb-4">
        Workspace:{" "}
        {currentWorkspace ? currentWorkspace.name : "No workspace selected"}
      </h1>
      <CreateProjectDialog />
    </main>
  );
}

export default HomePage;
