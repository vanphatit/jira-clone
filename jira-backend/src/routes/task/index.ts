import express from "express";
import {
  updateTaskHandler,
  createTaskHandler,
  deleteTaskHandler,
  getTasksByProjectHandler,
} from "../../controllers/task.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", requireAuth, createTaskHandler);
router.get("/project/:projectId", requireAuth, getTasksByProjectHandler);
router.patch("/:taskId", requireAuth, updateTaskHandler); // <- Add this!
router.delete("/:taskId", requireAuth, deleteTaskHandler);

export default router;
