import mongoose from "mongoose";

export type ProjectTemplate = "SCRUM" | "KANBAN";
export type ProjectAccess = "PRIVATE";
export type ProjectType = "TEAM_MANAGED";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    key: { type: String, required: true, unique: true },
    template: { type: String, enum: ["SCRUM", "KANBAN"], required: true },
    access: { type: String, enum: ["PRIVATE", "TEAM"], default: "PRIVATE" },
    type: { type: String, enum: ["TEAM_MANAGED"], default: "TEAM_MANAGED" },
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
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
  

export const Project = mongoose.model("Project", ProjectSchema);
