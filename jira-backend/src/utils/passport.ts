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
        async (
        accessToken: any,
        _refreshToken: any,
        profile: {
            emails: { value: any }[];
            displayName: any;
            username: any;
            photos: { value: any }[];
        },
        done: (arg0: unknown, arg1: { id: any } | undefined) => void
        ) => {
        try {
            let email = profile.emails?.[0]?.value;

            // fallback: manually fetch email from GitHub API
            if (!email) {
            const res = await fetch("https://api.github.com/user/emails", {
                headers: {
                Authorization: `token ${accessToken}`,
                "User-Agent": "JiraClone",
                Accept: "application/vnd.github.v3+json",
                },
            });

            const emails = await res.json();
            const primaryEmail = emails.find((e: any) => e.primary && e.verified);
            email = primaryEmail?.email;
            }

            if (!email) return done(new Error("Email not found in GitHub profile"));

            let user = await User.findOne({ email });

            if (!user) {
            user = await User.create({
                name: profile.displayName || profile.username,
                email,
                password: "oauth",
                avatar: profile.photos?.[0]?.value,
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
