import NextAuth, { type NextAuthOptions } from "next-auth";

import CoinbaseProvider from "next-auth/providers/coinbase";
import GoogleProvider from "next-auth/providers/google";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID as string,
      clientSecret: env.GOOGLE_CLIENT_SECRET as string,
    }),
    CoinbaseProvider({
      clientId: env.COINBASE_CLIENT_ID as string,
      clientSecret: env.COINBASE_CLIENT_SECRET as string,
    })
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);