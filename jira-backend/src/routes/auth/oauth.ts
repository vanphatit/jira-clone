import express from "express";
import passport from "passport";
import {
  handleGoogleCallback,
  handleGithubCallback,
} from "../../controllers/oauth.controller";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleGoogleCallback
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res, next) => {
    (req as any).oauthAccessToken = (req.user as any)?.accessToken;
    next();
  },
  handleGithubCallback
);

export default router;
