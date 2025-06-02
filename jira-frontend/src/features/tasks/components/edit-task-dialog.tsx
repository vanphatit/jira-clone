"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelectCombobox } from "@/components/multi-select-combobox";
import { useSelector } from "react-redux";
import { RootState } from "@/stores";
import { useGetMembers } from "@/features/projects/api/use-get-members";
import { useUpdateTask } from "../api/use-update-task";
import { CreateTaskSchema, createTaskSchema } from "../schemas";
import { toast } from "sonner";
import { TaskStatus } from "../types";
import { useGetTask } from "../api/use-get-task";

interface EditTaskDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditTaskDialog = ({
  taskId,
  open,
  onOpenChange,
}: EditTaskDialogProps) => {
  const currentProjectId = useSelector(
    (s: RootState) => s.project.currentProjectId
  )!;
  const currentWorkspaceId = useSelector(
    (s: RootState) => s.workspace.currentWorkspaceId
  )!;

  const { data: members = [] } = useGetMembers(currentProjectId || "");
  const { data: task, isLoading } = useGetTask(taskId); // <--- fetch the task

  const updateTaskMutation = useUpdateTask();

  const form = useForm<CreateTaskSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      name: task?.name || "",
      description: task?.description || "",
      dueDate: task?.dueDate || "",
      ownerId: task?.ownerId || "",
      position: task?.position || 0,
      status: task?.status || TaskStatus.BACKLOG,
      projectId: currentProjectId,
      workspaceId: currentWorkspaceId,
      assigneeIds: task?.assigneeIds || [],
    },
  });

  useEffect(() => {
    if (open && task) {
      form.reset({
        ...form.getValues(),
        ...task,
      });
    }
  }, [open, task, form]);

  const onSubmit = async (values: CreateTaskSchema) => {
    try {
      await updateTaskMutation.mutateAsync({
        _id: taskId,
        ...values,
      });
      toast.success("Task updated successfully!");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner if you want
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-2"
          >
            {/* Task Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Task name" />
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

            {/* Assignees */}
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

            {/* Description */}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Update Task
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
