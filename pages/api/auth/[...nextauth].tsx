import NextAuth, { type NextAuthOptions } from "next-auth";
import CoinbaseProvider from "next-auth/providers/coinbase";
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/prismadb";

export const authOptions: NextAuthOptions = {
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
  ],
  secret: process.env.JWT_SECRET,
}

export default NextAuth(authOptions);