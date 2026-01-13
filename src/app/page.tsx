import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import SignOutButton from "@/components/SignOutButton";

import { FaChartLine, FaLock, FaBolt, FaArrowRight } from "react-icons/fa";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <h1 className="text-2xl font-extrabold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          <a href="/">AccountManager</a>
        </h1>

        <nav className="flex items-center space-x-6">
          {session ? (
            <>
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Account
                </span>
                <span className="text-sm text-slate-900 font-medium">
                  {session.user?.email}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-blue-600 font-medium transition"
              >
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-600 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)]" />
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 leading-tight">
            Master Your Money with <br />
            <span className="text-blue-600">Smart Tracking</span>
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Take control of your finances. Track every penny, analyze your
            spending with powerful charts, and manage your accounts like a pro.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={session ? "/dashboard" : "/register"}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
            >
              {session ? "Enter Dashboard" : "Start For Free"}
              <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            {!session && (
              <Link
                href="/login"
                className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-all"
              >
                View Demo
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-white border-y border-slate-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Why Choose Us?
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Everything you need to manage your business or personal accounts
              efficiently.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <Feature
              icon={<FaChartLine size={32} />}
              title="Real-time Analytics"
              desc="Visualize your growth with dynamic charts and deep monthly insights."
              color="bg-blue-50 text-blue-600"
            />
            <Feature
              icon={<FaLock size={32} />}
              title="Bank-Grade Security"
              desc="Your data is protected with role-based access and secure authentication."
              color="bg-indigo-50 text-indigo-600"
            />
            <Feature
              icon={<FaBolt size={32} />}
              title="Lightning Fast"
              desc="Experience zero lag with our Next.js and Prisma powered infrastructure."
              color="bg-amber-50 text-amber-600"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 py-12 border-t border-slate-100">
        <div className="container mx-auto px-6 text-center">
          <p className="font-bold text-slate-900 mb-2">AccountManager</p>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} AccountManager. Built for excellence.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* Feature Card Component */
function Feature({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
}) {
  return (
    <div className="bg-white border border-slate-100 p-8 rounded-2xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
      <div
        className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-6`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
