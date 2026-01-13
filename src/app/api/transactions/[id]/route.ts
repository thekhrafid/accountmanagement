import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  await prisma.transaction.delete({
    where: { id: id },
  });

  return NextResponse.json(
    { message: "Transaction deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { amount, type, category } = await req.json();

  const transaction = await prisma.transaction.findUnique({
    where: { id: id },
  });

  if (!transaction || transaction.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.transaction.update({
    where: { id: id },
    data: { amount: Number(amount), type, category },
  });

  return NextResponse.json(updated);
}
