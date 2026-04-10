import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabaseAdmin } from "./supabase";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        // Find user by email in ngo_users
        const { data: user, error } = await supabaseAdmin
          .from("ngo_users")
          .select("*, ngo_organizations (*)")
          .eq("email", credentials?.email)
          .single();

        if (error || !user) {
          return null;
        }

        // For MVP phase 4, we accept any dummy password (or a simple check). 
        // In real world, use bcrypt or Supabase Auth.
        if (credentials?.password === "password" || credentials?.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            orgId: user.org_id,
            city: user.ngo_organizations?.city,
            state: user.ngo_organizations?.state,
            role: user.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.orgId = user.orgId;
        token.city = user.city;
        token.state = user.state;
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.orgId = token.orgId;
        session.user.city = token.city;
        session.user.state = token.state;
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours
  },
};
