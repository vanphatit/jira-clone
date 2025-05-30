"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useInviteMember } from "../api/use-invite-member";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { PlusIcon, UserPlus } from "lucide-react";

const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "ADMIN"]),
});

export const InviteMemberDialog = ({
  workspaceId,
}: {
  workspaceId: string;
}) => {
  const form = useForm<z.infer<typeof inviteMemberSchema>>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      email: "",
      role: "MEMBER",
    },
  });

  const { mutateAsync: inviteMember } = useInviteMember(workspaceId);

  const onSubmit = async (values: z.infer<typeof inviteMemberSchema>) => {
    try {
      await inviteMember(values);
      toast.success("Invite sent successfully!");
      form.reset();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to send invite");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite New Member</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter member email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <select {...field} className="p-2 border rounded w-full">
                      <option value="MEMBER">MEMBER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Inviting..." : "Send Invite"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
