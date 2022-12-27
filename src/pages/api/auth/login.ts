import { NextApiRequest, NextApiResponse } from "next";
import passport from "server/auth/passport";
import session from "server/auth/session";
import nextConnect from "next-connect";

/**
 * Login Strategy for password login
 */
const auths = [session, passport.initialize(), passport.session()];

const handler = nextConnect().use(...auths)

handler.post(
  passport.authenticate(
    "local",
    {
      successReturnToOrRedirect: '/',
      failureRedirect: '/login',
      failureMessage: true
    }
  ), 
  (req: NextApiRequest & { user: any}, res: NextApiResponse) => {
    res.json({ user: req.user });
  });

export default handler;