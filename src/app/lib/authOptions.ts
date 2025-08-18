// src/app/lib/auth-options.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import type { AuthOptions } from "next-auth";

type Theme = "default" | "dark" | "pastel";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, credentials.email))
          .then((res) => res[0]);

        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: String(user.id),
          email: user.email,
          name: user.name,
          theme: (user.theme as Theme) ?? "default",
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    // NOTE: include trigger + session so update({ theme }) can flow into the token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = (user as any).id;
        token.name = user.name;
        token.theme = (user as any).theme as Theme | undefined;
      }
      if (trigger === "update" && session?.theme) {
        // coming from client: await update({ theme: t })
        token.theme = session.theme as Theme;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as any).id = token.id as string;
      if (token?.theme !== undefined) {
        (session.user as any).theme = token.theme as Theme;
      }
      return session;
    },
  },
};
