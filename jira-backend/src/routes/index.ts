import express from "express";
import authRouter from "./auth";
import oauthRouter from "./auth/oauth"
import { requireAuth } from "../middlewares/auth.middleware";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/auth/oauth", oauthRouter)

// middleware to protect routes
//router.use(requireAuth)

export default router;
