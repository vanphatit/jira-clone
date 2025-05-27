import express from "express";

import {
  register, login, refresh, logout,
  getMe
} from "../../controllers/auth.controller";
import { requireAuth } from "../../middlewares/auth.middleware";

const authRouter = express.Router();

authRouter.get("/me", requireAuth, getMe);
authRouter.post("/users", register);
authRouter.post("/sessions", login);
authRouter.post("/sessions/refresh", refresh);
authRouter.delete("/sessions/logout", logout);

export default authRouter;
