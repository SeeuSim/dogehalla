import nextConnect from "next-connect";
import passport from "server/auth/passport";
import session from "server/auth/session";

import { NextApiRequest, NextApiResponse } from "next";

const auths = [session, passport.initialize(), passport.session()];

export default nextConnect()
  .use(...auths)
  .get(
    passport.authenticate("google", {
      successRedirect: "/",
      failureRedirect: "/login"
    }),
    (req: NextApiRequest & { user: any, session: any }, res: NextApiResponse) => {
      // you can save the user session here. to get access to authenticated user through req.user
      req.session.user = req.user;
      res.json({ user: req.user });
      res.redirect("/");
    }
);