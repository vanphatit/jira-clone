import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user";
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
        try {
            const email = profile.emails?.[0].value;
            let user = await User.findOne({ email });

            if (!user) {
            user = await User.create({
                name: profile.displayName,
                email,
                password: "oauth", // dummy
                avatar:
                profile.photos?.[0].value ||
                generateInitialsAvatar(profile.displayName),
                status: "ACTIVED",
            });
            }

            done(null, { id: user.id });
        } catch (err) {
            done(err);
        }
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
    async (accessToken: any, _refresh: any, profile: any, done: (arg0: null, arg1: any) => void) => {
      (profile as any).accessToken = accessToken;
      done(null, profile);
    }
  )
);
