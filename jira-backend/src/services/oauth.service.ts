import { User } from "../models/user";
import { generateInitialsAvatar } from "../utils/generateInitialAvatar";

export const oauthLogin = async (
  provider: "google" | "github",
  profile: any,
  accessToken?: string
) => {
  let email = profile.emails?.[0]?.value;

  // GitHub: if email is missing, fetch manually
  if (!email && provider === "github" && accessToken) {
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

  if (!user) {
    user = await User.create({
      name: profile.displayName || profile.username || "No Name",
      email,
      password: "oauth", // placeholder
      avatar:
        profile.photos?.[0]?.value ||
        generateInitialsAvatar(profile.displayName),
      status: "ACTIVED",
    });
  }

  return user;
};
