import passport from "server/auth/passport";
import { authOptions } from "server/auth/session";
import { nextConnectOptions } from "server/auth/nextConnect";
import nextConnect from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nextConnect(nextConnectOptions);

handler.use(...authOptions);

handler.get(passport.authenticate("coinbase"), (req: NextApiRequest & { user: any}, res: NextApiResponse) => {
  console.log(req.user);
  return res.status(200).json({user: req.user});
});

export default handler;