"use client"

import { CreateProjectDialog } from "@/features/projects/components/create-project-dialog";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setCurrentProjectId } from "@/stores/projectSlice";
import Link from "next/link";
import { useState } from "react";
import { RiAddCircleFill } from "react-icons/ri"

export const Projects = () => {
    const dispatch = useAppDispatch();
    
    const [dialogOpen, setDialogOpen] = useState(false);

    const { projects, currentProjectId } = useAppSelector((state) => state.project);
    
    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex items-center justify-between">
            <p className="text-xs uppercase text-neutral-500">Projects</p>
            <RiAddCircleFill
                onClick={() => setDialogOpen(true)}
                className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
            />
            </div>

            { projects?.map((p) => {
                const href = `workspace/${p.workspaceId}/project/${p._id}`
                const isActive = currentProjectId === p._id;

                return (
                    <Link 
                        href={href} 
                        key={p._id} 
                        onClick={(e) => {
                            e.preventDefault()
                            
                            if (isActive) return

                            dispatch(setCurrentProjectId(p._id))
                        }}>
                        <div className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md hover-opacity-75 transition cursor-pointer text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                        )}>
                            <ProjectAvatar name={p.name}/>
                            <span className="truncate lowercase">{p.name}</span>
                        </div>
                    </Link>
                )})
            }
            {/* Dialog rendered and controlled by `dialogOpen` */}
            <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
        </div>
    );
}