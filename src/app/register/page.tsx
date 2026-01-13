"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Registation failed");
        setLoading(false);
        return;
      }
      // Auto login using nextAuth

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (loginResult?.error) {
        setError("Registered but auto login failed");
        setLoading(false);
        return;
      }
      router.push("/dashboard");
    } catch (error) {
      setError("something went wrong please try againg");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justity-center bg-gray-100 px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">
          Create Account
        </h1>
        {error && (
          <p className="mb-3 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-3 text-sm text-green-600 bg-green-100 p-2 rounded">
            {success}
          </p>
        )}
        <div className="mb-3">
          <label className="block text-sm mb-1">Name</label>
          <input
            name="name"
            required
            className="w-full border px-3 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border px-3 rounded focus:outline-none focus:ring"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            minLength={6}
            required
            className="w-full border px-3 rounded focus:outline-none focus:ring"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "creating..." : "Register"}
        </button>

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
