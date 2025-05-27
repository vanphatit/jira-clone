import express from "express";
import authRouter from "./auth";
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use("/auth", authRouter);

// middleware to protect routes
//router.use(requireAuth)

export default router;
