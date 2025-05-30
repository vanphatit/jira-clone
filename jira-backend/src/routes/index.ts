import express from "express";
import authRouter from "./auth";
import oauthRouter from "./auth/oauth"
import projectRouter from "./project"
import workspaceRouter from "./workspace";
import taskRouter from "./task";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/auth/oauth", oauthRouter)

router.use("/workspaces", workspaceRouter);
router.use("/projects", projectRouter);
router.use("tasks", taskRouter);

export default router;