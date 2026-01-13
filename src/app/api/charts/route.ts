import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Monthly chart (Income vs Expense)
  const monthlyGrouped = await prisma.transaction.groupBy({
    by: ["type"],
    _sum: { amount: true },
    where: { userId },
  });

  const monthly = monthlyGrouped.map((item) => ({
    name: item.type === "INCOME" ? "Income" : "Expense",
    amount: item._sum.amount || 0,
  }));

  // Category chart (expense only)
  const categoryGrouped = await prisma.transaction.groupBy({
    by: ["category"],
    _sum: { amount: true },
    where: { userId, type: "EXPENSE" },
  });

  const categories = categoryGrouped.map((item) => ({
    name: item.category,
    value: item._sum.amount || 0,
  }));

  return NextResponse.json({ monthly, categories });
}
