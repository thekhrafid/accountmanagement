import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Auth: Missing email or password");
          return null;
        }

        const email = credentials.email.toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          console.log(`Auth: User not found for email: ${email}`);
          return null;
        }

        console.log(
          `Auth: User found: ${user.email}, verified: ${user.emailVerified}`
        );

        /* 
        // [MARK: FIXED AUTO-LOGIN] - Check if email is verified
        if (!user.emailVerified) {
          console.log("Auth: Email not verified");
          throw new Error("EMAIL_NOT_VERIFIED");
        }
        */

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          console.log("Auth: Invalid password");
          return null;
        }

        console.log("Auth: Login successful");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
