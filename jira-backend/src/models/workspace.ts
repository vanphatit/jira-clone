import mongoose, { Schema } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Workspace = mongoose.model("Workspace", WorkspaceSchema);
