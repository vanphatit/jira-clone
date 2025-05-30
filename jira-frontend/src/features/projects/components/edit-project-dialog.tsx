"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form"; // ✅ add useFieldArray
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { updateProjectSchema, UpdateProjectSchema } from "../schemas";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Settings, TrashIcon, PlusIcon, XIcon } from "lucide-react"; // add icons
import { DottedSeparator } from "@/components/dotted-separator";
import { ConfirmDialog } from "./confirm-dialog";
import { useAppSelector } from "@/stores/hooks";

export const EditProjectDialog = () => {
  const [open, setOpen] = useState(false);

  const { projects, currentProjectId } = useAppSelector(
    (state) => state.project
  );

  const currentProject = projects.find((p) => p._id === currentProjectId);

  const updateMutation = useUpdateProject();
  const deleteMutation = useDeleteProject();

  const form = useForm<UpdateProjectSchema>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: "",
      members: [],
    },
  });

  // ✅ Manage dynamic members array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "members",
  });

  useEffect(() => {
    if (currentProject) {
      form.reset({
        name: currentProject.name || "",
        members:
          currentProject.members.map((m) => ({
            userId: m.userId,
            email: m.email,
            role: m.role,
          })) || [],
      });
    }
  }, [currentProject, form]);

  const onSubmit = async (values: UpdateProjectSchema) => {
    if (!currentProject) return;
    await updateMutation.mutateAsync({
      projectId: currentProject._id,
      payload: values,
    });
    setOpen(false);
  };

  const onDelete = async () => {
    if (!currentProject) return;
    await deleteMutation.mutateAsync(currentProject._id);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="size-4 mr-2" />
          Project Settings
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
        </DialogHeader>
        <DottedSeparator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            {/* Project Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Members */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <FormLabel>Members</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({ userId: "", email: "", role: "MEMBER" })
                  }
                >
                  <PlusIcon className="size-4 mr-1" />
                  Add Member
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-center border p-3 rounded-md"
                >
                  <FormField
                    control={form.control}
                    name={`members.${index}.email`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="user@example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`members.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <select {...field} className="p-2 border rounded-md">
                            <option value="MEMBER">MEMBER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => remove(index)}
                  >
                    <XIcon className="size-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Save + Delete */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={updateMutation.isLoading}
              >
                {updateMutation.isLoading ? "Saving..." : "Save Changes"}
              </Button>

              <ConfirmDialog
                title="Are you sure you want to delete this project?"
                description="This action cannot be undone."
                onConfirm={onDelete}
              >
                <Button type="button" variant="destructive" className="w-full">
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </Button>
              </ConfirmDialog>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
