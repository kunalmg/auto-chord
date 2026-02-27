import nodemailer from "nodemailer";

export async function sendResetEmail(to: string, resetUrl: string) {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "0");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.FROM_EMAIL || user || "";
  const secure = String(process.env.SMTP_SECURE || "false").toLowerCase() === "true";
  if (!host || !port || !user || !pass || !from) return false;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
  const text = `Use the link to reset your password: ${resetUrl}`;
  const html = `<p>Use the link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`;
  await transporter.sendMail({
    from,
    to,
    subject: "Reset your password",
    text,
    html,
  });
  return true;
}

