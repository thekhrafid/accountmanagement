import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ message: "Invalid token" }, { status: 400 });
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!record || record.expiresAt < new Date()) {
    return NextResponse.json(
      { message: "Token expired or invalid" },
      { status: 400 }
    );
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });
  await prisma.verificationToken.delete({
    where: { id: record.id },
  });
  return NextResponse.redirect(
    `${process.env.NEXTAUTH_URL}/login?verified=true`
  );
}
