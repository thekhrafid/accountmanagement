import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const income = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "INCOME", userId: session.user.id },
  });

  const expense = await prisma.transaction.aggregate({
    _sum: { amount: true },
    where: { type: "EXPENSE", userId: session.user.id },
  });

  const incomeAmount = income._sum.amount ?? 0;
  const expenseAmount = expense._sum.amount ?? 0;

  return NextResponse.json({
    income: incomeAmount,
    expense: expenseAmount,
    balance: incomeAmount - expenseAmount,
    chart: [
      {
        name: "Summary",
        income: incomeAmount,
        expense: expenseAmount,
      },
    ],
  });
}
