import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: {
      transactions: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const data = users.map((u) => {
    const income = u.transactions
      .filter((t) => t.type === "INCOME")
      .reduce((a, b) => a + b.amount, 0);

    const expense = u.transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((a, b) => a + b.amount, 0);

    return {
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      income,
      expense,
      balance: income - expense,
      createdAt: u.createdAt,
    };
  });
  return NextResponse.json(data);
}
