import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";

import passport from "server/auth/passport";
import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";

const handler = nextConnect(nextConnectOptions);

handler.use(...authOptions);

handler.get(passport.authenticate("magiclogin"), (req: NextApiRequest & { user: any}, res: NextApiResponse) => {
  res.setHeader("user", req.user);
  return res.redirect("/");
});

export default handler;