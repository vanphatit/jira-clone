"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useCreateProject } from "../api/use-create-project";
import { createProjectSchema, CreateProjectSchema } from "../schemas";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { setCurrentProjectId } from "@/stores/projectSlice";
import { fetchProjectsByWorkspace } from "../api/use-get-projects";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProjectDialog = ({ open, onOpenChange } : Props ) => {
  const dispatch = useAppDispatch();
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      key: "",
      type: "WORKSPACE_MANAGED", // Default type
    },
  });

  const { mutateAsync, isPending } = useCreateProject();
  const currentWorkspaceId = useAppSelector(
    (state) => state.workspace.currentWorkspaceId
  );

  const onSubmit = async (values: CreateProjectSchema) => {
    if (!currentWorkspaceId) {
      toast.error("No workspace selected.");
      return;
    }

    try {
      await mutateAsync({
        ...values,
        workspaceId: currentWorkspaceId,
      });

      toast.success("Project created!");
      
      await fetchProjectsByWorkspace(currentWorkspaceId);
      dispatch(setCurrentProjectId(currentWorkspaceId))
      
      onOpenChange(false);
      form.reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to create project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Billing Dashboard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Key</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. BILL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="TEAM_MANAGED">Team Management</SelectItem>
                      <SelectItem value="WORKSPACE_MANAGED">Workspace Management</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !currentWorkspaceId}
            >
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
