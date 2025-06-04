import mongoose, { Schema } from "mongoose";

export type ProjectTemplate = "SCRUM" | "KANBAN";
export type ProjectAccess = "PRIVATE";
export type ProjectType = "TEAM_MANAGED" | "WORKSPACE_MANAGED";

export interface IProject extends Document {
  name: string;
  key: string;
  type: ProjectType;
  workspaceId: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId; // owner userId
  members: {
    userId: string;
    email: string;
    role: "MEMBER" | "ADMIN";
    status: "PENDING" | "JOINED";
  }[];
  tasks: mongoose.Types.ObjectId[]; // Array of task IDs
  deleted: boolean;
}

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    template: {
      type: String,
      enum: ["SCRUM", "KANBAN"],
      default: "KANBAN",
      required: true,
    },
    access: { type: String, enum: ["PRIVATE", "TEAM"], default: "PRIVATE" },
    type: {
      type: String,
      enum: ["TEAM_MANAGED", "WORKSPACE_MANAGED"],
      default: "TEAM_MANAGED",
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        userId: { type: Schema.Types.ObjectId, ref: "User" }, // optional
        email: { type: String, required: true },
        role: { type: String, enum: ["ADMIN", "MEMBER"], default: "MEMBER" },
        status: {
          type: String,
          enum: ["PENDING", "JOINED"],
          default: "PENDING",
        },
      },
    ],
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
  

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
