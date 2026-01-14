"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiUserPlus,
} from "react-icons/fi";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // [MARK: FIXED REGISTRATION FLOW]
      // Instead of auto-login, show success message
      setError(null);
      alert(
        "Registration successful! Please check your email for the verification link."
      );
      router.push("/login?registered=true");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white overflow-hidden antialiased font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative w-full max-w-md px-6 my-8">
        <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] shadow-2xl animate-scaleIn">
          <div className="text-center mb-10">
            {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-600 to-purple-600 rounded-3xl mb-6 shadow-2xl shadow-indigo-500/20 ring-1 ring-white/20">
              <FiUserPlus className="text-4xl text-white" />
            </div> */}
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 text-lg">
              Start managing your organization today
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-4 rounded-2xl text-sm font-medium animate-shake flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <FiUser className="text-lg" />
                </div>
                <input
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-400 text-black placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <FiMail className="text-lg" />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-400 text-black placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-indigo-500 transition-colors">
                  <FiLock className="text-lg" />
                </div>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  minLength={6}
                  required
                  className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-400 text-black placeholder-slate-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/50 transition-all shadow-inner"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="group relative w-full flex items-center justify-center py-4 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span className="mr-2">Get Started</span>
                  <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-200 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-400 font-bold ml-1 transition-colors decoration-2 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
