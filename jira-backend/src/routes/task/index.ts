import express from "express";
import {
  createTaskHandler,
  getTasksByProjectHandler,
} from "../../controllers/task.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createTaskHandler);
router.get("/project/:projectId", requireAuth, getTasksByProjectHandler);

export default router;
