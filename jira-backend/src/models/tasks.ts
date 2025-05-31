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

const taskSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    status: {
      type: String,
      enum: ["TODO", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    position: { type: Number, default: 0 },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    assigneeIds: [{ type: Schema.Types.ObjectId, ref: "User" }], // ⬅️ ARRAY!
  },
  { timestamps: true }
);

export const Task = mongoose.model<ITask>("Task", taskSchema);
