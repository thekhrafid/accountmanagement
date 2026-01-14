"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const token = params.get("token");
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    fetch(`/api/auth/verify-email?token=${token}`).then(() => {
      router.push("/login?verified=true");
    });
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg font-semibold">Verifying your email...</p>
    </div>
  );
}
