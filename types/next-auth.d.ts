// src/types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    theme?: "default" | "dark" | "pastel"; // ✅ add theme here
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    theme?: "default" | "dark" | "pastel";
  }
}
