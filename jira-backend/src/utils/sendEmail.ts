import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  code: string,
  name?: string
) => {
  const formattedCode = code.match(/.{1,3}/g)?.join(" ") || code; // e.g. "UF8C2K" → "UF8 C2K"

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #ffffff; padding: 24px; color: #1c1f26;">
      <div style="max-width: 480px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <div style="text-align: center; padding: 32px 24px; background: #f1f5f9;">
          <img src="/logo.svg" alt="Logo" width="48" height="48" />
          <h1 style="font-size: 20px; font-weight: 600; margin: 16px 0 0;">You're nearly there!</h1>
        </div>

        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; margin-bottom: 8px;">Hi ${name || email.split("@")[0]},</p>
          <p style="font-size: 16px; margin-bottom: 24px;">Your verification code is:</p>
          <p style="font-size: 36px; font-weight: 700; letter-spacing: 4px; color: #1d4ed8; text-align: center; margin-bottom: 24px;">${formattedCode}</p>
          <p style="font-size: 14px; color: #475569;">
            Enter this verification code to continue setting up your account. This code will expire in 10 minutes.
          </p>
          <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">If you didn't request this code, you can safely ignore this email.</p>
        </div>

        <div style="padding: 16px 24px; font-size: 12px; color: #94a3b8; background: #f8fafc; text-align: center;">
          This message was sent to you by JIRA Clone
        </div>
      </div>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Your verification code",
    html,
  });
};

export const sendWorkspaceInviteEmail = async (
  email: string,
  inviteLink: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>You're invited to join a workspace!</h2>
      <p>Click the button below to accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px;">
        Accept Invitation
      </a>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Workspace Invitation",
    html,
  });
};

export const sendProjectInviteEmail = async (
  email: string,
  inviteLink: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>You're invited to join a project!</h2>
      <p>Click the button below to accept the invitation:</p>
      <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px;">
        Accept Invitation
      </a>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;

  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to: email,
    subject: "Project Invitation",
    html,
  });
};