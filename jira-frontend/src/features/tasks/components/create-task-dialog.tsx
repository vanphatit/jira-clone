"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/date-picker";
import { useGetMembers } from "@/features/projects/api/use-get-members";
import { createTaskSchema, CreateTaskSchema } from "../schemas";
import { useCreateTask } from "../api/use-create-task";
import { PlusIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectCombobox } from "@/components/multi-select-combobox";
import { toast } from "sonner";

export const CreateTaskDialog = () => {
  const [open, setOpen] = useState(false);

  const currentProjectId = useSelector(
    (s: RootState) => s.project.currentProjectId
  )!;
  const currentWorkspaceId = useSelector(
    (s: RootState) => s.workspace.currentWorkspaceId
  )!;

  const { data: members = [], refetch } = useGetMembers(currentProjectId || "");

  const mutation = useCreateTask(currentProjectId);

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: "",
      description: "",
      dueDate: "",
      position: 0,
      status: "TODO",
      projectId: currentProjectId,
      workspaceId: currentWorkspaceId,
      assigneeIds: [], // ⬅️ Array
    },
  });

  const onSubmit = async (values: CreateTaskSchema) => {
    try {
      await mutation.mutateAsync(values);
      toast.success("Task created successfully!");
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    }
  };

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="w-full lg:w-auto"
          aria-label="Create New Task"
        >
          <PlusIcon className="size-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <DottedSeparator />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            <div className="flex flex-col gap-y-4">
              {/* Task Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Task name"
                        aria-label="Task Name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Due Date */}
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value ? new Date(field.value) : undefined}
                        onChange={(date) =>
                          field.onChange(date ? date.toISOString() : "")
                        }
                        placeholder="Select due date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Assignee */}
              <FormField
                control={form.control}
                name="assigneeIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignees</FormLabel>
                    <FormControl>
                      <MultiSelectCombobox
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select assignees"
                        options={members.map((member) => ({
                          label: member.userId.name,
                          value: member.userId._id,
                          avatarUrl: member.userId.avatar,
                        }))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Task Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Task description"
                        rows={3}
                        aria-label="Task Description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={mutation.isLoading}
              className="w-full"
              aria-label="Submit New Task"
            >
              {mutation.isLoading ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
