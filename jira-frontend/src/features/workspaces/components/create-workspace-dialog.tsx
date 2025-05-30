"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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

import { useCreateWorkspace } from "../api/use-create-workspace";
import { createWorkspaceSchema, CreateWorkspaceSchema } from "../schemas";

import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setWorkspaces, setCurrentWorkspaceId } from "@/stores/workspacesSlice";
import { fetchWorkspaces } from "../api/use-get-workspaces";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateWorkspaceDialog = ({ open, onOpenChange }: Props) => {
  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { name: "" },
  });

  const dispatch = useAppDispatch();
  const workspaces = useAppSelector((state) => state.workspace.workspaces);
  const { mutateAsync, isPending } = useCreateWorkspace();

  const onSubmit = async (values: CreateWorkspaceSchema) => {
    try {
      const newWorkspace = await mutateAsync(values);
      dispatch(setWorkspaces([...workspaces, newWorkspace]));
      dispatch(setCurrentWorkspaceId(newWorkspace._id));
      toast.success("Workspace created");
      onOpenChange(false);
      form.reset();
      await fetchWorkspaces()
      window.location.reload(); // reload to reflect changes
    } catch (err: any) {
      toast.error(err.message || "Failed to create workspace");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Design Team" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Creating..." : "Create Workspace"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
