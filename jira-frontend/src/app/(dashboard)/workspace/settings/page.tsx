"use client"

import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useAppSelector } from "@/stores/hooks";
import { redirect } from "next/navigation";

const WorkspaceSettingsPage = () => {

    // get workspace from redux
    const { workspaces, currentWorkspaceId } = useAppSelector(
      (state) => state.workspace
    );

    const currentWorkspace = workspaces.find((workspace: { _id: unknown; }) => workspace._id === currentWorkspaceId)

    if (!currentWorkspace) {
        redirect("/")
    }

    return (
        <div className="w-full lg:max-w-xl-2xl mx-auto">
            <EditWorkspaceForm initialValues={currentWorkspace} />
        </div>
    );
}

export default WorkspaceSettingsPage;