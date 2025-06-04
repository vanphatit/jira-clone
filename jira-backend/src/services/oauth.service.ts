import bcrypt from "bcrypt";

import { User } from "../models/user.model";
import { createUser, findUserByEmail } from "../repositories/user.repository";
import { generateInitialsAvatar } from "../utils/generateInitialAvatar";

export const oauthGoogleLogin = async (profile: any) => {
  const email = profile.emails?.[0]?.value || profile._json?.email;

  if (!email) {
    throw new Error("No verified email returned from Google");
  }

  const existingUser = await findUserByEmail(email);
  if (existingUser) return existingUser;

  const hashed = await bcrypt.hash("password123", 10);

  const newUser = await createUser({
    email,
    name: profile.displayName || "Google User",
    password: hashed,
    avatar:
      profile.photos?.[0]?.value || generateInitialsAvatar(profile.displayName),
    status: "ACTIVED",
  });

  return newUser;
};

export const oauthGitHubLogin = async (profile: any, accessToken?: string) => {
  let email = profile.emails?.[0]?.value;

  // GitHub: if email is missing, fetch manually
  if (!email && accessToken) {
    const res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const emails = await res.json();
    const primary = emails.find((e: any) => e.primary && e.verified);
    email = primary?.email;
  }

  if (!email) throw new Error("No verified email returned from provider");

  let user = await User.findOne({ email });

  const hashed = await bcrypt.hash("password123", 10);

  if (!user) {
    user = await User.create({
      name: profile.displayName || profile.username || "No Name",
      email,
      password: hashed, // placeholder
      avatar:
        profile.photos?.[0]?.value ||
        generateInitialsAvatar(profile.displayName),
      status: "ACTIVED",
    });
  }

  return user;
};
