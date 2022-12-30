import { NextApiRequest, NextApiResponse } from "next";
import passport from "server/auth/passport";
import nextConnect from "next-connect";

import { nextConnectOptions } from "server/auth/nextConnect";
import { authOptions } from "server/auth/session";

/**
 * Login Strategy for password login
 */
const handler = nextConnect(nextConnectOptions).use(...authOptions);

handler.post(
  passport.authenticate(
    "local",
    {
      successReturnToOrRedirect: '/',
      failureRedirect: '/auth/login',
      failureMessage: true
    }
  ), 
  (req: NextApiRequest & { user: any}, res: NextApiResponse) => {
    res.setHeader("user", req.user);
    return res.redirect("/");
  });

export default handler;