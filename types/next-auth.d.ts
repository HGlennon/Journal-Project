import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string; // Add name to the user object
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
