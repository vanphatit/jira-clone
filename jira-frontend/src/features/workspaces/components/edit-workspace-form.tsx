"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { updateWorkspaceSchema } from "../schemas";
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
import { useUpdateWorkspace } from "../api/use-edit-workspace";
import { toast } from "sonner";
import { fetchWorkspaces } from "../api/use-get-workspaces";

interface EditWorkspaceFormProps {
  initialValues?: z.infer<typeof updateWorkspaceSchema>;
}

export const EditWorkspaceForm = ({
  initialValues,
}: EditWorkspaceFormProps) => {
  const router = useRouter();
  const { mutateAsync: updateWorkspace } = useUpdateWorkspace(
    initialValues?._id || ""
  );

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
    },
  });

  const onSubmit = async (values: z.infer<typeof updateWorkspaceSchema>) => {
    try {
      await updateWorkspace(values); // now it will trigger react-query cache invalidation
      toast.success("Workspace updated successfully!");
      await fetchWorkspaces(); // refetch workspaces after update
      router.refresh();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to update workspace");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
          <CardTitle className="text-xl font-bold">
            Workspace Settings
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <h3 className="font-bold">Edit Workspace</h3>

          <DottedSeparator className="my-4" />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Workspace Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter workspace name" />
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

      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h3 className="font-bold">Danger Zone</h3>
            <p className="text-sm text-muted-foreground pt-3">
              This section allows you to delete your workspace. Please proceed
              with caution as this action cannot be undone.
            </p>
            <Button
              className="mt-6 w-fit ml-auto"
              size="sm"
              variant="destructive"
              type="button"
              disabled={form.formState.isSubmitting}
              onClick={() => {}}
            >
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
