"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { ConfirmDialog } from "@/features/projects/components/confirm-dialog";
import { useGetMembers } from "@/features/projects/api/use-get-members";
import { InviteMemberDialog } from "@/features/projects/components/invite-member-dialog";
import Image from "next/image";
import { useRemoveMember } from "../api/use-remove-member";
import { useAppSelector } from "@/stores/hooks"; // get current user id from redux
import { updateProjectSchema } from "../schemas";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { fetchProjectsByWorkspace } from "../api/use-get-projects";

interface EditProjectFormProps {
  initialValues?: z.infer<typeof updateProjectSchema>;
}

// 🎨 Badge component
const Badge = ({
  text,
  color,
}: {
  text: string;
  color: "blue" | "gray" | "orange";
}) => {
  const base = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
  const colors = {
    blue: "bg-blue-100 text-blue-700",
    gray: "bg-gray-100 text-gray-700",
    orange: "bg-orange-100 text-orange-700",
  };
  return <span className={`${base} ${colors[color]}`}>{text}</span>;
};

export const EditProjectForm = ({
  initialValues,
}: EditProjectFormProps) => {
  const router = useRouter();
  const { mutateAsync: updateProject } = useUpdateProject(
    initialValues?._id || ""
  );
  const { mutateAsync: deleteProject, isLoading: isDeleting } =
    useDeleteProject();
  const { data: members = [], refetch } = useGetMembers(
    initialValues?._id || ""
  );
  const { mutateAsync: removeMember } = useRemoveMember();

  const currentUser = useAppSelector((state) => state.auth.user); // current user from redux
  const currentWorkspaceId = useAppSelector(
    (state) => state.workspace.currentWorkspaceId
  ); // current workspace id from redux

  const handleRemoveMember = async (userId: string) => {
    try {
      if (currentUser?.id === userId) {
        toast.error("You cannot remove yourself!");
        return;
      }
      await removeMember({ projectId: initialValues?._id || "", userId });
      toast.success("Member removed successfully!");
      refetch(); // refresh member list
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to remove member");
    }
  };

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateProjectSchema>) => {
    try {
      await updateProject(values);
      toast.success("Workspace updated successfully!");
      await fetchProjectsByWorkspace(currentWorkspaceId);
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update workspace");
    }
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(initialValues?._id || "");
      toast.success("Project deleted successfully!");
      await fetchProjectsByWorkspace(currentWorkspaceId);
      router.push("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">
            Project Settings
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Edit Project */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <h3 className="font-bold">Edit Project</h3>
          <DottedSeparator className="my-4" />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter project name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Members Management */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex justify-between items-center">
            <h3 className="font-bold mb-4">Members</h3>
            <InviteMemberDialog workspaceId={initialValues?._id || ""} />
          </div>

          {/* Grid of Member Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {members.map((member: unknown) => (
              <div
                key={member._id}
                className="relative group flex flex-col items-center gap-y-3 p-6 border rounded-lg shadow-sm hover:shadow-md transition"
              >
                {/* Remove Button */}
                {currentUser?.id !== member.userId?._id && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
                    <ConfirmDialog
                      title="Remove Member"
                      description={`Are you sure you want to remove ${
                        member.userId?.name || "this user"
                      }?`}
                      onConfirm={() => handleRemoveMember(member.userId._id)}
                    >
                      <Button
                        size="icon"
                        variant="destructive"
                        className="w-8 h-8 p-0 rounded-full"
                      >
                        ✕
                      </Button>
                    </ConfirmDialog>
                  </div>
                )}

                {member.userId?.avatar ? (
                  <Image
                    src={member.userId.avatar}
                    alt={member.userId.name || "Avatar"}
                    width={74}
                    height={74}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-semibold">
                    {member.userId?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <p className="text-base pt-3 font-semibold">
                  {member.userId?.name || "Unknown"}
                </p>
                <div className="text-sm text-gray-500">
                  {member.userId?.email}
                </div>

                {/* Role Badge */}
                {member.status !== "JOINED" ? (
                  <Badge text="Pending" color="orange" />
                ) : member.role === "ADMIN" ? (
                  <Badge text="Admin" color="blue" />
                ) : (
                  <Badge text="Member" color="gray" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground pt-3">
              This section allows you to delete your project. Please proceed
              with caution as this action cannot be undone.
            </p>
            <ConfirmDialog
              title="Delete Project"
              description="Are you sure you want to delete this project? This action cannot be undone."
              onConfirm={handleDeleteProject}
            >
              <Button
                className="mt-6 w-fit ml-auto"
                size="sm"
                variant="destructive"
                type="button"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </Button>
            </ConfirmDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
