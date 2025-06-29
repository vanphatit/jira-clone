"use client";

import { useState } from "react";
import { RiAddCircleFill } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setCurrentWorkspaceId } from "@/stores/workspacesSlice";
import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { fetchProjectsByWorkspace } from "@/features/projects/api/use-get-projects";

export const WorkspaceSwitcher = () => {
  const dispatch = useAppDispatch();
  const { workspaces, currentWorkspaceId } = useAppSelector(
    (state) => state.workspace
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Workspaces</p>
        <RiAddCircleFill
          onClick={() => setDialogOpen(true)}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>

      <Select
        value={currentWorkspaceId ?? ""}
        onValueChange={(val) => {
          dispatch(setCurrentWorkspaceId(val))
          fetchProjectsByWorkspace(val)
        }}
      >
        <SelectTrigger className="w-full bg-neutral-200 font-medium p-1">
          <SelectValue placeholder="Select Workspace" />
        </SelectTrigger>
        <SelectContent>
          {workspaces.map((w) => (
            <SelectItem key={w._id} value={w._id}>
              <div className="flex justify-start items-center gap-3 font-medium">
                <WorkspaceAvatar name={w.name}/>
                <span className="truncate">{w.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Dialog rendered and controlled by `dialogOpen` */}
      <CreateWorkspaceDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
};
