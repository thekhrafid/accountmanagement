"use client";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";

export default function Login() {
  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    await signIn("credentials", {
      email,
      password,
      callbackUrl: "/dashboard",
    });
  }

  return (
   <div  className="min-h-screen flex items-center justity-center bg-gray-100 px-4">
     <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <div className="mb-3">
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full border px-3 rounded focus:outline-none focus:ring"
        />
      </div>
      <div className="mb-3">
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full border px-3 rounded focus:outline-none focus:ring"
        />
      </div>
      <button className="btn w-full mt-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
        Login
      </button>
    </form>
   </div>
  );
}
