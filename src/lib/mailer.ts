import nodemailer from "nodemailer";

export async function sendVerificationEmail(
  email: string,
  token: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Account Manager" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the button below to verify your email</p>
      <a href="${verifyUrl}" 
         style="padding:10px 20px;
         background:#2563eb;
         color:white;
         text-decoration:none;
         border-radius:6px">
         Verify Email
      </a>
    `,
  });
}
