import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, repassword } = req.body;
    const user = await AuthService.registerUser(
      name,
      email,
      password,
      repassword
    );
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await AuthService.loginUser(
      email,
      password
    );

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
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) throw new Error("No refresh token");

    const accessToken = await AuthService.refreshAccessToken(token);
    res.json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) await AuthService.logoutUser(token);

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
  try {
    if (!req.user?.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const user = await AuthService.getCurrentUser(req.user.userId);
    res.json(user);
  } catch (err: any) {
    res.status(404).json({ message: err.message });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    await AuthService.verifyUserEmail(email, code);
    res.json({ message: "Email verified successfully" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const resendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.resendVerificationCode(email);
    res.json({ message: "Verification code resent." });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
