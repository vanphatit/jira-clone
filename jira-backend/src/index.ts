import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import router from "./routes";
import session from "express-session";
import passport from "passport";

import "./utils/passport";
import { errorHandler } from "./middlewares/error.midlleware";
import { connectToMongo } from "./utils/db";
import { redis } from "./utils/redis";

dotenv.config();
// 👇 explicitly load .env.local
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", router);

app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(errorHandler)

const start = async () => {
  await connectToMongo();

  if (!redis.isOpen) {
    await redis.connect();
  }

  app.listen(process.env.PORT, () =>
    console.log(`✅ Server on http://localhost:${process.env.PORT}`)
  );
};

start();