"use client"

import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { useAppSelector } from "@/stores/hooks";
import { redirect } from "next/navigation";

const ProjectSettingsPage = () => {

    // get project from redux
    const { projects, currentProjectId } = useAppSelector(
      (state) => state.project
    );

    const currentProject = projects.find((project: { _id: unknown; }) => 
        project._id === currentProjectId)

    if (!currentProject) {
        redirect("/")
    }

    return (
        <div className="w-full lg:max-w-xl-2xl mx-auto">
            <EditProjectForm initialValues={currentProject} />
        </div>
    );
}

export default ProjectSettingsPage;