import passport from "server/auth/passport";
import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";
import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nextConnect(nextConnectOptions);

handler.use(...authOptions);

handler.get(
  passport.authenticate("google", {
    failureRedirect: "/auth/login"
  }),
  (req: NextApiRequest & { user: any }, res: NextApiResponse) => {
    // you can save the user session here. to get access to authenticated user through req.user
    res.json({ user: req.user });
    res.redirect("/");
  }
);

export default handler;