import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/lib/mailer";
import crypto from "crypto"; // [MARK: FIXED] - Explicitly import Node.js crypto

export async function POST(req: Request) {
  const { name, email: rawEmail, password } = await req.json();
  const email = rawEmail.toLowerCase();

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Required fields missing" },
      { status: 400 }
    );
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const token = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      emailVerified: false,
      verificationToken: token, // [MARK: FIXED SCHEMA SYNC]
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    },
  });

  // Keep the separate table in sync for safety
  await prisma.verificationToken.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  await sendVerificationEmail(email, token);

  return NextResponse.json({
    message: "Registration successful. Please verify your email",
  });
}
