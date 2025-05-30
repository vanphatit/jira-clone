import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  name: string;
  workspaceId: string;
  projectId: string;
  assigneeId: string;
  description?: string;
  dueDate: Date;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  position: number;
}

const TaskSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    workspaceId: { type: String, required: true },
    projectId: { type: String, required: true },
    assigneeId: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"],
      default: "BACKLOG",
    },
    position: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", TaskSchema);
