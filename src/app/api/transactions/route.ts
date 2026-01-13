import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { type, amount, category } = await req.json();

  if (!type || amount === undefined || amount === null || !category) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const transaction = await prisma.transaction.create({
    data: {
      type,
      amount: Number(amount),
      category,
      userId: session.user.id,
    },
  });

  return NextResponse.json(transaction, { status: 201 });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const limit = Number(searchParams.get("limit") || 5);

  const where: any = {
    userId: session.user.id,
  };

  if (search) {
    where.OR = [
      { type: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return NextResponse.json({
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();

  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction || transaction.userId !== session.user.id) {
    return NextResponse.json(
      { message: "Transaction not found or unauthorized" },
      { status: 404 }
    );
  }

  await prisma.transaction.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Transaction deleted" }, { status: 200 });
}
