import express from "express";
import { createProjectHandler } from "../../controllers/project.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createProjectHandler);

export default router;
