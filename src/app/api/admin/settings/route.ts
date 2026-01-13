import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  // session check
  const session = await getServerSession(authOptions);
  // login check
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  //    If not Admin
  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Forbidden-Admin only" },
      { status: 403 }
    );
  }
  // If Admin
  return NextResponse.json({
    message: "Welcome Admin",
    settings: { conpanyName: "BIRL", currency: "BDT" },
  });
}
