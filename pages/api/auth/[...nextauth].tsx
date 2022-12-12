import NextAuth from "next-auth/next";
import CoinbaseProvider from "next-auth/providers/coinbase";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CoinbaseProvider({
      clientId: process.env.COINBASE_CLIENT_ID as string,
      clientSecret: process.env.COINBASE_CLIENT_SECRET as string,
    })
  ],
  secret: process.env.JWT_SECRET,
}

export default NextAuth(authOptions);