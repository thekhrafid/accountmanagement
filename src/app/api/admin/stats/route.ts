import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth-options";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [users, transactions, income, expense] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "INCOME" },
    }),
    prisma.transaction.aggregate({
      _sum: { amount: true },
      where: { type: "EXPENSE" },
    }),
  ]);

  return NextResponse.json({
    users,
    transactions,
    income: income._sum.amount ?? 0,
    expense: expense._sum.amount ?? 0,
  });
}
