"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-all shadow-md hover:shadow-lg active:scale-95"
    >
      Sign Out
    </button>
  );
}
