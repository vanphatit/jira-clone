import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  name: string;
  workspaceId: string;
  projectId: string;
  ownerId: string;
  assigneeId: string;
  description?: string;
  dueDate: Date;
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEWED" | "DONE" | "OVERDUE" | "ARCHIVED";
  position: number;
}

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: [ "BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEWED", "DONE", "OVERDUE", "ARCHIVED" ],
      default: "TODO",
    },
    position: { type: Number, default: 0 },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assigneeIds: [{ type: Schema.Types.ObjectId, ref: "User" }], // ⬅️ ARRAY!
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
