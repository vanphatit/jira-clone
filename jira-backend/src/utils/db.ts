import mongoose from "mongoose";

export const connectToMongo = async () => {
  await mongoose.connect(process.env.MONGO_URL!);
  console.log("✅ MongoDB connected");
};
