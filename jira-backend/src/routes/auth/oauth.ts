import express from "express";
import passport from "passport";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";
import { redis } from "../../utils/redis";

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
  async (req, res) => {
    const userId = (req.user as any).id;
    const accessToken = signAccessToken({ userId });
    const refreshToken = signRefreshToken({ userId });

    await redis.set(refreshToken, userId);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/callback?token=${accessToken}`
    );
  }
);

router.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  async (req, res) => {
    const userId = (req.user as any).id;
    const accessToken = signAccessToken({ userId });
    const refreshToken = signRefreshToken({ userId });

    await redis.set(refreshToken, userId);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });

    res.redirect(
      `${process.env.CLIENT_URL}/callback?token=${accessToken}`
    );
  }
);

export default router;