import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(["MEMBER", "ADMIN"]),
});
