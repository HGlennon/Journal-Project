// src/app/lib/auth-options.ts
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import type { AuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
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

        return { id: String(user.id), email: user.email, name: user.name}
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name; // ✅ Store name in token
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }

      if (token?.name) {
        session.user.name = token.name; // ✅ Set name in session
      }

      return session;
    },
  },
};
