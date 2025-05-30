import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
{
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }, // hashed
    avatar: { type: String, required: true },
    status: {
        type: String,
        enum: ["PENDING", "ACTIVED", "BANNED"],
        default: "PENDING",
    }
},
{ timestamps: { createdAt: true, updatedAt: false } }
);

export const User = mongoose.model("User", UserSchema)
