import { Request, Response } from "express";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { redis } from "../utils/redis";
import { oauthLogin } from "../services/oauth.service";

export const handleGoogleCallback = async (req: Request, res: Response) => {
  try {
    const profile = req.user as any;
    const user = await oauthLogin("google", profile);

    const accessToken = signAccessToken({ userId: user.id });
    const refreshToken = signRefreshToken({ userId: user.id });

    await redis.set(refreshToken, user.id);

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
  } catch (err: any) {
    res.redirect(
      `${process.env.CLIENT_URL}/error?message=${encodeURIComponent(err.message)}`
    );
  }
};

export const handleGithubCallback = async (req: Request, res: Response) => {
  try {
    const profile = req.user as any;
    const accessToken = (req as any).oauthAccessToken; // passed from strategy
    const user = await oauthLogin("github", profile, accessToken);

    const jwt = signAccessToken({ userId: user.id });
    const refresh = signRefreshToken({ userId: user.id });

    await redis.set(refresh, user.id);

    res.cookie("refreshToken", refresh, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    });

    res.redirect(`${process.env.CLIENT_URL}/callback?token=${jwt}`);
  } catch (err: any) {
    res.redirect(
      `${process.env.CLIENT_URL}/error?message=${encodeURIComponent(err.message)}`
    );
  }
};
