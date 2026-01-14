import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default async function ForceVerifyPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const email = searchParams.email;

  if (!email) {
    return (
      <div className="p-10 text-black">
        Please provide an email in the URL: ?email=...
      </div>
    );
  }

  try {
    const user = await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: { emailVerified: true },
    });
    return (
      <div className="p-10 text-black bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-green-600">SUCCESS!</h1>
        <p>
          User <strong>{user.email}</strong> has been manually verified.
        </p>
        <p>Now try logging in.</p>
      </div>
    );
  } catch (err) {
    return (
      <div className="p-10 text-black bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">FAILED</h1>
        <p>User not found: {email}</p>
      </div>
    );
  }
}
