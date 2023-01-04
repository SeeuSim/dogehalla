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
      failureRedirect: '/auth/login',
      failureMessage: true
    }
  ), 
  (req: NextApiRequest & { user: any}, res: NextApiResponse) => {
    // To get hold of local IP, run this command in terminal: `ipconfig getifaddr eth0`
    // To get hold of origin IP, user device for session management, you can log these:
    /*
    console.log(req.headers.origin)
    console.log(req.headers["user-agent"])
    */

    res.setHeader("user", req.user);
    return res.redirect("/");
  });

export default handler;