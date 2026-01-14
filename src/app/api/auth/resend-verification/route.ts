import { sendVerificationEmail } from "@/lib/mailer";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email: rawEmail } = await req.json();
    const email = rawEmail.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { message: "Email already verified" },
        { status: 400 }
      );
    }

    // [MARK: FIXED TOKEN REDECLARATION & SCHEMA SYNC]
    // Generate a new token
    const verificationTokenVal = crypto.randomUUID();

    // Update the User model directly as per the latest schema change
    await prisma.user.update({
      where: { email },
      data: {
        verificationToken: verificationTokenVal,
        verificationTokenExpiry: new Date(Date.now() + 1000 * 60 * 30), // 30 minutes
      },
    });

    // Also keep the separate model in sync if needed,
    // but the GET verification handler is currently looking at the User model
    await prisma.verificationToken.create({
      data: {
        token: verificationTokenVal,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 30),
      },
    });

    await sendVerificationEmail(email, verificationTokenVal);

    return NextResponse.json({ message: "Verification email sent" });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { message: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
