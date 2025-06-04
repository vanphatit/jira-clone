// utils/db.ts

import mongoose from "mongoose";

const connectToMongo = async () => {
  const mongoUri = process.env.MONGO_URL;

  if (!mongoUri) {
    throw new Error("MONGO_URI not defined");
  }

  const connectWithRetry = async () => {
    try {
      await mongoose.connect(mongoUri);
      console.log("✅ MongoDB connected");
    } catch (err) {
      console.error(
        "❌ MongoDB connection failed, retrying in 5 seconds...",
        err
      );
      setTimeout(connectWithRetry, 5000);
    }
  };

  await connectWithRetry();
};

export { connectToMongo };
