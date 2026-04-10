import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      orgId: string;
      city: string;
      state?: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    orgId: string;
    city: string;
    state?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    orgId: string;
    city: string;
    state?: string;
  }
}
