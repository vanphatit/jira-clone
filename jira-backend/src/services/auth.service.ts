import bcrypt from "bcrypt";
import { User } from "../models/user";
import { redis } from "../utils/redis";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { generate6DigitCode } from "../utils/generateCode";
import { sendVerificationEmail } from "../utils/sendEmail";
import { generateInitialsAvatar } from "../utils/generateInitialAvatar";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  repassword: string
) => {
  if (password !== repassword) throw new Error("Passwords do not match");

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already used");

  const hashed = await bcrypt.hash(password, 10);
  const avatar = generateInitialsAvatar(name);
  const code = generate6DigitCode();

  const user = await User.create({
    name,
    email,
    password: hashed,
    avatar,
    status: "PENDING",
  });

  await redis.set(`verify:${email}`, code, { EX: 600 });
  await sendVerificationEmail(email, code, name);

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  await redis.set(refreshToken, user.id);

  return { accessToken, refreshToken };
};

export const verifyUserEmail = async (email: string, code: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.status === "ACTIVED") throw new Error("Already verified");

  const storedCode = await redis.get(`verify:${email}`);
  if (!storedCode) throw new Error("Code expired or not found");
  if (storedCode !== code) throw new Error("Invalid verification code");

  user.status = "ACTIVED";
  await user.save();
  await redis.del(`verify:${email}`);

  return true;
};

export const resendVerificationCode = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  if (user.status === "ACTIVED") throw new Error("Already verified");

  const code = generate6DigitCode();
  await redis.set(`verify:${email}`, code, { EX: 600 });
  await sendVerificationEmail(email, code, user.name);

  return true;
};

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken) as any;
  const exists = await redis.get(refreshToken);
  if (!exists) throw new Error("Token revoked");

  return signAccessToken({ userId: payload.userId });
};

export const logoutUser = async (refreshToken: string) => {
  await redis.del(refreshToken);
};

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId).select(
    "id name email avatar status"
  );
  if (!user) throw new Error("User not found");
  return user;
};
