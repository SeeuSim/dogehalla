import nextSession from "next-session";
import { SessionData } from "next-session/lib/types";
import { promisifyStore } from "next-session/lib/compat";

import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "server/db/client";
import { env } from "env/server.mjs";

import passport from "./passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";


// class PostgresStore {
//   async set(sid: string, sess: SessionData) {
//     try {
//       console.log(sid, sess)
//       const session = await prisma.session.create({
//         data: {
//           sessionToken: sid,
//           expires: sess.cookie.expires?.toDateString() || (Date.now() + 24 * 3600).toString(),
//           data: JSON.stringify(sess.cookie)
//         }
//       });
//     } catch (err) {
//       /* No-Op */
//       return;
//     }
//   }

//   async get(sid: string) {
//     try {
//       const session = await prisma.session.findUnique({
//         where: {
//           sessionToken: sid
//         }
//       });
//       if (session && session.data) {
//         return JSON.parse(session.data) as SessionData;
//       }
//     } catch (err) {

//     }
//     return null;
//   }

//   async destroy(sid: string) {
//     try {
//       const session = await prisma.session.delete({
//         where: {
//           sessionToken: sid
//         }
//       });
//     } catch (err) {
//       /* No-Op */
//     }
//   }
// }

export const getSession = nextSession({
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000,  //ms
    dbRecordIdIsSessionId: undefined,
    dbRecordIdFunction: undefined,
  }),
  cookie: {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    maxAge: 2 * 7 * 24 * 60 * 60, //2 Weeks
    path: "/",
    sameSite: 'strict',
  },
  touchAfter: 1 * 7 * 24 * 60 * 60 // 1 Week
});

export default async function session(request: NextApiRequest, response: NextApiResponse, next: () => any){
  await getSession(request, response);
  next();
}

export const authOptions = [session, passport.initialize(), passport.session()];
