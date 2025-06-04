import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.model";
import { generateInitialsAvatar } from "./generateInitialAvatar";

passport.serializeUser((user: any, done) => {
  done(null, user);
});
passport.deserializeUser((obj: any, done) => {
  done(null, obj);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/api/auth/oauth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: `${process.env.SERVER_URL}/api/auth/oauth/github/callback`,
    },
    async (
      accessToken: any,
      _refresh: any,
      profile: any,
      done: (arg0: null, arg1: any) => void
    ) => {
      (profile as any).accessToken = accessToken;
      done(null, profile);
    }
  )
);
