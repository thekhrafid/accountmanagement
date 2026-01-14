import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";
import { logActivity } from "@/lib/activityLogger";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Admin only" }, { status: 403 });
  }

  await prisma.transaction.delete({
    where: { id },
  });

  await logActivity({
    userId: session.user.id,
    action: "DELETE",
    entity: "TRANSACTION",
    entityId: id,
  });

  return NextResponse.json({ message: "Transaction deleted successfully" });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { amount, type, category } = await req.json();

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction || transaction.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      amount: Number(amount),
      type,
      category,
    },
  });

  await logActivity({
    userId: session.user.id,
    action: "UPDATE",
    entity: "TRANSACTION",
    entityId: id,
    meta: { amount, type, category },
  });

  return NextResponse.json(updated);
}


export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { amount, type, category } = await req.json();

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      type,
      category,
      userId: session.user.id,
    },
  });

  // 🔥 ACTIVITY LOG (CREATE)
  await logActivity({
    userId: session.user.id,
    action: "CREATE",
    entity: "TRANSACTION",
    entityId: transaction.id,
    meta: { amount, type, category },
  });

  return NextResponse.json(transaction);
}