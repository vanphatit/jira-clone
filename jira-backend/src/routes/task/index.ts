import express from "express";
import {
  getTaskHandler,
  updateTaskHandler,
  createTaskHandler,
  deleteTaskHandler,
  getTasksByProjectHandler,
} from "../../controllers/task.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createTaskHandler);
router.get("/project/:projectId", requireAuth, getTasksByProjectHandler);
router.get("/:taskId", getTaskHandler);
router.patch("/:taskId", requireAuth, updateTaskHandler); // <- Add this!
router.delete("/:taskId", requireAuth, deleteTaskHandler);

export default router;
