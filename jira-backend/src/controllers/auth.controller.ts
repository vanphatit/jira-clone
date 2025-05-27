import { Request, Response } from "express";
import bcrypt from "bcrypt"

import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { User } from "../models/user";
import { redis } from "../utils/redis";
import { generateInitialsAvatar } from "../utils/generateInitialAvatar";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, repassword } = req.body;

  if (password !== repassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const avatar = generateInitialsAvatar(name)

  const user = await User.create({ name, email, password: hashed, avatar });
  res.status(201).json({ message: "User created", userId: user.id });
};


export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  await redis.set(refreshToken, user.id); // track valid token

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      domain: process.env.COOKIE_DOMAIN,
      path: "/",
    })
    .json({ accessToken });
};


export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const payload = verifyRefreshToken(token) as any;
    const exists = await redis.get(token);
    if (!exists) return res.status(401).json({ message: "Token revoked" });

    const accessToken = signAccessToken({ userId: payload.userId });

    res.json({ accessToken });
  } catch (err) {
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    await redis.del(token); // blacklist/remove
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
  });

  res.status(200).json({ message: "Logged out" });
};

export const getMe = async (req: Request, res: Response) => {
  if (!req.user?.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findById(req.user.userId).select(
    "id name email avatar status"
  );
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};