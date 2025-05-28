import express from "express";
import authRouter from "./auth";
import oauthRouter from "./auth/oauth"
import projectRouter from "./project"
import workspaceRouter from "./workspace";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/auth/oauth", oauthRouter)

router.use("/workspaces", workspaceRouter);
router.use("/projects", projectRouter);

export default router;