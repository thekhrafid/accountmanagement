"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FiMail, FiLock, FiArrowRight, FiActivity } from "react-icons/fi";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [emailValue, setEmailvalue] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const verified = searchParams.get("verified");

  // [MARK: LOAD REMEMBERED EMAIL]
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmailvalue(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    // [MARK: REMEMBER ME LOGIC]
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          setError("Please verify your email first");
          setEmailvalue(email);
          setShowResend(true);
          setLoading(false);
          return;
        } else {
          setError("Invalid email or password");
        }
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden antialiased font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md px-6">
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl animate-scaleIn">
          <div className="text-center mb-10">
            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-600 rounded-3xl mb-6 shadow-2xl shadow-blue-500/20 ring-1 ring-white/20">
              <FiActivity className="text-4xl text-white" />
            </div> */}
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-lg">
              Manage your finances with confidence
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-4 rounded-2xl text-sm font-medium animate-shake flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <FiMail className="text-lg" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={emailValue}
                  onChange={(e) => setEmailvalue(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-slate-400 text-black placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-slate-600">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs text-red-500 hover:text-red-400 font-semibold tracking-tight"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                  <FiLock className="text-lg" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-slate-400 text-black placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* [MARK: REMEMBER ME CHECKBOX] */}
            <div className="flex items-center ml-1">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-slate-600 cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            <button
              disabled={loading}
              className="group relative w-full flex items-center justify-center py-4 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">Sign In</span>
                  <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-400 font-bold ml-1 transition-colors decoration-2 underline-offset-4 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          <div>
            {showResend && (
              <button
                type="button"
                className="text-blue-600 text-sm underline mt-2"
                onClick={async () => {
                  await fetch("/api/auth/resend-verification", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailValue }),
                  });

                  alert("Verification email sent!");
                }}
              >
                Resend verification email
              </button>
            )}
          </div>
          <div>
            {verified && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm mb-4 animate-scaleIn">
                Email verified successfully! You can login now.
              </div>
            )}
            {searchParams.get("registered") && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm mb-4 animate-scaleIn">
                Registration successful! Please check your email and verify your
                account before logging in.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
