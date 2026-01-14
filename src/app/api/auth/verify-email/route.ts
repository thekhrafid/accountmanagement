import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  // [MARK: FIXED SCHEMA FIELD NAME]
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token, // Changed from VerificationToken to verificationToken
      verificationTokenExpiry: {
        gt: new Date(),
      },
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Token expired or invalid" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null, // Changed from VerificationToken to verificationToken
      verificationTokenExpiry: null,
    },
  });

  return NextResponse.redirect(new URL("/login?verified=true", req.url));
}
